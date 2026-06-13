// Fetch world-atlas land-110m TopoJSON (same source as world_map.jsx),
// decode to plain [lon,lat] polygons, write land.js for the render page.
const fs = require('fs');

(async () => {
  const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json');
  const topo = await res.json();
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

  const ringFromArcs = (arcIdxs) => {
    const pts = [];
    for (const idx of arcIdxs) {
      let a = idx >= 0 ? arcs[idx] : [...arcs[~idx]].reverse();
      if (pts.length) a = a.slice(1);
      pts.push(...a);
    }
    return pts;
  };

  const polys = [];
  const walk = (g) => {
    if (g.type === 'Polygon') g.arcs.forEach(r => polys.push(ringFromArcs(r)));
    else if (g.type === 'MultiPolygon') g.arcs.forEach(p => p.forEach(r => polys.push(ringFromArcs(r))));
    else if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
  };
  walk(topo.objects.land);

  // Drop tiny islands, round coords to save space
  const cleaned = polys
    .filter(p => p.length > 8)
    .map(p => p.map(([lon, lat]) => [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]));

  fs.writeFileSync(__dirname + '/land.js',
    'window.LAND = ' + JSON.stringify(cleaned) + ';\n');
  console.log('polygons:', cleaned.length, 'bytes:', fs.statSync(__dirname + '/land.js').size);
})();
