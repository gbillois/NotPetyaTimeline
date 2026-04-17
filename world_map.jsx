// Orthographic "globe" map — much cleaner continents, auto-rotates to
// focus on the active event's longitude. Pulses fire at event hotspots.

const Globe = ({ events, currentTime, activeEvent }) => {
  const size = 460; // virtual size, SVG is responsive
  const cx = size / 2, cy = size / 2;
  const R = size * 0.46;

  // Target longitude: active event's, so the globe rotates to face it
  const targetLon = activeEvent?.coords?.[1] ?? 20;
  const targetLat = activeEvent?.coords?.[0] ?? 30;

  const [rot, setRot] = React.useState({ lon: targetLon, lat: targetLat });
  const rafRef = React.useRef(null);
  React.useEffect(() => {
    const tl = targetLon, tla = Math.max(-60, Math.min(60, targetLat * 0.35));
    const animate = () => {
      setRot(prev => {
        let dl = tl - prev.lon;
        if (dl > 180) dl -= 360;
        if (dl < -180) dl += 360;
        const dla = tla - prev.lat;
        if (Math.abs(dl) < 0.1 && Math.abs(dla) < 0.1) return prev;
        return {
          lon: prev.lon + dl * 0.06,
          lat: prev.lat + dla * 0.06,
        };
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetLon, targetLat]);

  // Orthographic projection: returns [x, y, visible]
  const project = (lat, lon) => {
    const φ = (lat * Math.PI) / 180;
    const λ = ((lon - rot.lon) * Math.PI) / 180;
    const φ0 = (rot.lat * Math.PI) / 180;
    const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
    if (cosc < 0) return [0, 0, false];
    const x = R * Math.cos(φ) * Math.sin(λ);
    const y = R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ));
    return [cx + x, cy - y, true];
  };

  // Fetch real-world coastline GeoJSON once
  const [landmasses, setLandmasses] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    // world-atlas 110m countries via topojson from a CDN → convert to lat/lon polygons
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then(r => r.json())
      .then(topo => {
        if (cancelled) return;
        // Minimal inline TopoJSON decoder
        const t = topo.transform;
        const sx = t.scale[0], sy = t.scale[1], tx = t.translate[0], ty = t.translate[1];
        const decodeArc = (arc) => {
          let x = 0, y = 0;
          return arc.map(([dx, dy]) => {
            x += dx; y += dy;
            return [x * sx + tx, y * sy + ty]; // [lon, lat]
          });
        };
        const arcs = topo.arcs.map(decodeArc);
        const lineFromArcIdx = (idx) => {
          const rev = idx < 0;
          const arc = arcs[rev ? ~idx : idx];
          return rev ? [...arc].reverse() : arc;
        };
        const geom = topo.objects.land;
        const polys = []; // array of rings, each ring = [[lat,lon],...]
        const addRing = (arcIdxs) => {
          const ring = [];
          arcIdxs.forEach((ai, i) => {
            const seg = lineFromArcIdx(ai);
            for (let k = i === 0 ? 0 : 1; k < seg.length; k++) {
              ring.push([seg[k][1], seg[k][0]]); // lat, lon
            }
          });
          polys.push(ring);
        };
        const walk = (g) => {
          if (g.type === 'Polygon') g.arcs.forEach(addRing);
          else if (g.type === 'MultiPolygon') g.arcs.forEach(p => p.forEach(addRing));
          else if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
        };
        walk(geom);
        setLandmasses(polys);
      })
      .catch(() => { /* fallback: leave null */ });
    return () => { cancelled = true; };
  }, []);

  const now = Date.now();
  const firedEvents = events.filter(e => e.t <= currentTime && e.coords);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%', maxHeight: '100%' }}>
        <defs>
          <radialGradient id="oceanGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#1a1611" />
            <stop offset="60%" stopColor="#12100c" />
            <stop offset="100%" stopColor="#08070a" />
          </radialGradient>
          <radialGradient id="rim" cx="50%" cy="50%">
            <stop offset="85%" stopColor="rgba(230,220,200,0)" />
            <stop offset="95%" stopColor="rgba(230,220,200,0.15)" />
            <stop offset="100%" stopColor="rgba(230,220,200,0)" />
          </radialGradient>
          <radialGradient id="shade" cx="70%" cy="70%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
          <radialGradient id="pulseGrad">
            <stop offset="0%" stopColor="rgba(220,60,40,0.7)" />
            <stop offset="60%" stopColor="rgba(220,60,40,0.18)" />
            <stop offset="100%" stopColor="rgba(220,60,40,0)" />
          </radialGradient>
        </defs>

        {/* Ocean sphere */}
        <circle cx={cx} cy={cy} r={R} fill="url(#oceanGrad)" />

        {/* Graticule — longitude + latitude lines */}
        <g stroke="rgba(230,220,200,0.07)" strokeWidth="0.6" fill="none">
          {[-60,-30,0,30,60].map(lat => {
            const pts = [];
            for (let lon = -180; lon <= 180; lon += 6) {
              const [x, y, v] = project(lat, lon);
              if (v) pts.push(`${x},${y}`);
              else if (pts.length) pts.push('M');
            }
            // Split into runs
            const segments = pts.join(' ').split(' M ').filter(s => s.trim());
            return segments.map((seg, i) => (
              <polyline key={`lat${lat}-${i}`} points={seg} />
            ));
          })}
          {[-150,-120,-90,-60,-30,0,30,60,90,120,150,180].map(lon => {
            const pts = [];
            for (let lat = -85; lat <= 85; lat += 5) {
              const [x, y, v] = project(lat, lon);
              if (v) pts.push(`${x},${y}`);
              else if (pts.length) pts.push('M');
            }
            const segments = pts.join(' ').split(' M ').filter(s => s.trim());
            return segments.map((seg, i) => (
              <polyline key={`lon${lon}-${i}`} points={seg} />
            ));
          })}
        </g>

        {/* Landmasses */}
        <g>
          {(landmasses || []).map((poly, i) => {
            // Split polygon into visible runs; when a vertex flips visibility,
            // start a new sub-polyline so we don't draw across the back.
            const runs = [];
            let cur = [];
            for (const [lat, lon] of poly) {
              const [x, y, v] = project(lat, lon);
              if (v) cur.push(`${x},${y}`);
              else if (cur.length) { runs.push(cur); cur = []; }
            }
            if (cur.length) runs.push(cur);
            return runs.map((r, j) => r.length < 2 ? null : (
              <polyline
                key={`${i}-${j}`}
                points={r.join(' ')}
                fill="rgba(230,220,200,0.12)"
                stroke="rgba(230,220,200,0.55)"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            ));
          })}
        </g>

        {/* Terminator shading — subtle vignette on far side */}
        <circle cx={cx} cy={cy} r={R} fill="url(#shade)" pointerEvents="none" />

        {/* Event pulses */}
        {firedEvents.map(evt => {
          const [x, y, visible] = project(evt.coords[0], evt.coords[1]);
          if (!visible) return null;
          const age = currentTime - evt.t;
          const ageScale = Math.max(0, 1 - age * 2.5);
          const baseR = 2 + (evt.severity || 1) * 1.1;
          const pulseR = baseR + ageScale * 22;
          const color = evt.phase === 'detonation' ? '#dc3c28'
            : evt.phase === 'prelude' ? '#d4a03c' : '#b4afa5';
          const isActive = evt.id === activeEvent?.id;
          return (
            <g key={evt.id}>
              {ageScale > 0.02 && (
                <circle cx={x} cy={y} r={pulseR} fill="url(#pulseGrad)" opacity={ageScale} />
              )}
              {isActive && (
                <circle cx={x} cy={y} r={baseR + 8} fill="none"
                        stroke={color} strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" from={baseR + 4} to={baseR + 18}
                           dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.7" to="0"
                           dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={baseR} fill={color}
                      stroke="#0a0907" strokeWidth="1" />
            </g>
          );
        })}

        {/* Rim highlight */}
        <circle cx={cx} cy={cy} r={R} fill="url(#rim)" pointerEvents="none" />
        <circle cx={cx} cy={cy} r={R} fill="none"
                stroke="rgba(230,220,200,0.18)" strokeWidth="0.8" />
      </svg>
    </div>
  );
};

window.WorldMap = Globe;
window.Globe = Globe;
