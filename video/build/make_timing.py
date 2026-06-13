#!/usr/bin/env python3
"""Compute the scene timeline from measured VO durations → timing.js + timing.json"""
import json, subprocess, os

D = os.path.dirname(os.path.abspath(__file__))
order = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"]
durs = {}
for n in order:
    p = subprocess.run(["/opt/homebrew/bin/ffprobe", "-v", "quiet", "-show_entries",
                        "format=duration", "-of", "csv=p=0", f"{D}/vo/{n}.mp3"],
                       capture_output=True, text=True)
    durs[n] = float(p.stdout.strip())

LEAD = 0.8          # silence before first line
GAP = 0.55          # gap between scenes
TAIL = 4.8          # end card after last line

t = LEAD
scenes = []
for n in order:
    scenes.append({"id": n, "voStart": round(t, 3), "voEnd": round(t + durs[n], 3)})
    t += durs[n] + GAP
total = round(t - GAP + TAIL, 3)

timing = {"scenes": scenes, "total": total, "fps": 24}
with open(f"{D}/timing.json", "w") as f:
    json.dump(timing, f, indent=2)
with open(f"{D}/timing.js", "w") as f:
    f.write("window.TIMING = " + json.dumps(timing) + ";\n")
print(json.dumps(timing, indent=2))
