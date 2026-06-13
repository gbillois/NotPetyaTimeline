#!/usr/bin/env python3
"""Synthesize the documentary underscore (D minor, 116.7s) with numpy → music.wav"""
import json, os, wave
import numpy as np
from scipy.signal import lfilter

D = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(f"{D}/timing.json"))
SR = 44100
TOTAL = T["total"]
N = int(TOTAL * SR)
t = np.arange(N) / SR

dry = np.zeros(N)   # mono dry bus
wet = np.zeros(N)   # send to reverb

def seg(t0, t1):
    a, b = max(0, int(t0 * SR)), min(N, int(t1 * SR))
    return a, b

def env_ar(n, attack, release, sr=SR):
    e = np.ones(n)
    na, nr = int(attack * sr), int(release * sr)
    if na > 0: e[:na] = np.linspace(0, 1, na) ** 2
    if nr > 0 and nr < n: e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e

def lowpass_const(x, cutoff):
    g = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - g], [1, -g], x)

def lowpass(x, cutoff):
    """one-pole lowpass; cutoff may be an array — approximate with chunked constant cutoff"""
    cutoff = np.asarray(cutoff)
    if cutoff.ndim == 0:
        return lowpass_const(x, float(cutoff))
    out = np.empty_like(x)
    chunk = 2048
    for a in range(0, len(x), chunk):
        b = min(a + chunk, len(x))
        g = np.exp(-2 * np.pi * float(cutoff[a:b].mean()) / SR)
        zi = [out[a - 1] * g] if a else [0.0]
        out[a:b], _ = lfilter([1 - g], [1, -g], x[a:b], zi=zi)
    return out

def saw_bl(freq, n, nharm=14):
    tt = np.arange(n) / SR
    out = np.zeros(n)
    k = 1
    while k <= nharm and freq * k < 16000:
        out += np.sin(2 * np.pi * freq * k * tt) / k
        k += 1
    return out * (2 / np.pi)

def add(buf, t0, x, gain=1.0):
    a = int(t0 * SR)
    b = min(N, a + len(x))
    if a >= N: return
    buf[a:b] += x[:b - a] * gain

def pad(freqs, t0, t1, gain, attack=2.0, release=2.5, cutoff=900, detune=0.0012, wetg=0.8):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    x = np.zeros(n)
    for f in freqs:
        x += saw_bl(f * (1 + detune), n) + saw_bl(f * (1 - detune), n)
    x = lowpass_const(x, cutoff)
    x *= env_ar(n, attack, release) * gain / max(len(freqs), 1)
    add(dry, t0, x, 0.55)
    add(wet, t0, x, wetg)

def drone(freqs, t0, t1, gain, attack=3.0, release=3.0):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    tt = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        x += np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2 * tt + 0.5)
    lfo = 1 + 0.12 * np.sin(2 * np.pi * 0.07 * tt)
    x *= env_ar(n, attack, release) * lfo * gain / len(freqs)
    add(dry, t0, x, 0.8)
    add(wet, t0, x, 0.25)

def boom(t0, gain=1.0, f0=95, f1=34, dur=1.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-tt * 7)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-tt * 3.2)
    th = np.random.default_rng(int(t0 * 100)).standard_normal(n) * np.exp(-tt * 26)
    x += lowpass_const(th, 300) * 1.6
    add(dry, t0, x, gain * 0.9)
    add(wet, t0, x, gain * 0.7)

def pluck(t0, freq, gain=0.5, dur=2.2, bright=2200):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * tt) + 0.42 * np.sin(2 * np.pi * freq * 2 * tt)
         + 0.18 * np.sin(2 * np.pi * freq * 3.01 * tt))
    x *= np.exp(-tt * 2.6)
    x = lowpass_const(x, bright)
    x[:80] *= np.linspace(0, 1, 80)
    add(dry, t0, x, gain * 0.7)
    add(wet, t0, x, gain * 0.9)

def sub_pulse(t0, gain=0.6, f=36.7, dur=0.34):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 11)
    x[:40] *= np.linspace(0, 1, 40)
    add(dry, t0, x, gain)

def tick(t0, gain=0.12):
    n = int(0.012 * SR)
    rng = np.random.default_rng(int(t0 * 1000) % 99991)
    x = rng.standard_normal(n) * np.hanning(n)
    x -= lowpass_const(x, 2500)   # highpass via subtraction
    add(dry, t0, x, gain)

def riser(t0, t1, gain=0.5):
    n = int((t1 - t0) * SR)
    rng = np.random.default_rng(777)
    x = rng.standard_normal(n)
    cut = np.linspace(150, 3800, n)
    x = lowpass(x, cut)
    x *= (np.linspace(0, 1, n) ** 2.4) * gain
    add(dry, t0, x, 0.8)
    add(wet, t0, x, 0.5)

# note frequencies
D1, D2, A2, D3, F3, A3, C3, G2, Bb2, E3, C4, D4, E4, F4, Bb3, Cs3 = (
    36.71, 73.42, 110.0, 146.83, 174.61, 220.0, 130.81, 98.0, 116.54,
    164.81, 261.63, 293.66, 329.63, 349.23, 233.08, 138.59)

S = {s["id"]: s for s in T["scenes"]}

# ---- Act structure ----
# S1 cold open
drone([D1, D2], 0.0, S["s2"]["voStart"] + 1.5, 0.55, attack=2.5)
boom(0.55, 0.7)
boom(S["s1"]["voStart"] + 8.7, 0.85)          # title reveal
pluck(S["s1"]["voStart"] + 2.7, D3, 0.30, bright=1200)   # "17 minutes"

# S2 tension
b2 = S["s2"]["voStart"]
drone([D2, A2], b2, S["s3"]["voStart"] + 2.0, 0.5)
pad([D3, F3, A3], b2 + 0.5, S["s3"]["voStart"] - 0.2, 0.30, attack=3.5, cutoff=750)
for i, cue in enumerate([1.6, 4.3, 7.6, 5.9, 11.2]):      # node ticks
    tick(b2 + cue, 0.18)
k = b2 + 0.8
while k < S["s3"]["voStart"] + 2.0:                        # clock ticking
    tick(k, 0.10)
    k += 0.75

# S3 detonation
b3 = S["s3"]["voStart"]
det = b3 + 2.8
riser(b3 - 1.8, det, 0.55)
boom(det, 1.0)
drone([D1, D2], det, S["s5"]["voStart"] + 0.5, 0.6)
# driving pulse from detonation through s4
end4 = S["s4"]["voEnd"]
k = det + 0.9
beat = 0
while k < end4 - 0.4:
    intensity = 0.45 + 0.35 * min(1, (k - det) / 20)
    sub_pulse(k, intensity)
    if beat % 2 == 1: tick(k - 0.3, 0.14)
    k += 0.62
    beat += 1
# dark pads rising through s3/s4
pad([D2, F3, A2], det + 0.7, b3 + 12, 0.26, attack=1.5, cutoff=700)
pad([Bb2, D3, F3], b3 + 12, S["s4"]["voStart"] + 4, 0.30, attack=2.0, cutoff=900)
b4 = S["s4"]["voStart"]
boom(b4 + 3.5, 0.8)                                        # "Maersk loses..."
pad([G2, Bb2, D3], b4 + 4, b4 + 10, 0.32, attack=2.0, cutoff=1100)
pad([A2, Cs3, E3], b4 + 10, end4 + 0.5, 0.36, attack=2.0, cutoff=1400)  # dominant — max tension

# S5 hope
b5 = S["s5"]["voStart"]
pad([Bb2, F3, D4], b5 + 0.3, S["s6"]["voStart"] - 0.3, 0.34, attack=3.0, cutoff=1500, wetg=1.1)
pluck(b5 + 1.9, D4, 0.4)      # "1"
pluck(b5 + 4.2, F4, 0.3)
pluck(b5 + 8.0, Bb3, 0.35)    # "10 days"
drone([D1], b5 + 0.3, S["s6"]["voStart"], 0.3)

# S6 cold fallout
b6 = S["s6"]["voStart"]
drone([D1, D2], b6 - 0.3, S["s7"]["voStart"] + 1.0, 0.5)
for cue, note in [(1.6, D3), (5.5, F3), (9.1, A2), (12.3, G2), (15.4, D3)]:
    pluck(b6 + cue, note, 0.38, dur=2.8, bright=1500)
k = b6 + 0.5
while k < S["s7"]["voStart"]:
    tick(k, 0.07)
    k += 1.5

# S7 resolve
b7 = S["s7"]["voStart"]
pad([D3, F3, A3, E4], b7 + 0.5, b7 + 11.0, 0.32, attack=4.0, cutoff=1300, wetg=1.2)
for cue, note in [(2.2, D4), (5.3, E4), (8.2, F4)]:
    pluck(b7 + cue, note, 0.32)
# final swell
pad([D2, D3, A3, D4, F4], b7 + 10.6, TOTAL - 1.2, 0.42, attack=2.2, release=3.5, cutoff=1800, wetg=1.3)
boom(b7 + 10.9, 0.55, f0=70, f1=36, dur=2.5)
drone([D1], b7 + 10.6, TOTAL - 0.8, 0.4, attack=1.5, release=3.0)

# ---- Schroeder reverb on wet bus ----
def comb(x, delay, fb):
    a = np.zeros(delay + 1); a[0] = 1; a[delay] = -fb
    return lfilter([1], a, x)
def allpass(x, delay, g=0.5):
    b = np.zeros(delay + 1); b[0] = -g; b[delay] = 1
    a = np.zeros(delay + 1); a[0] = 1; a[delay] = -g
    return lfilter(b, a, x)

print("reverb...")
rev = np.zeros(N)
for d, fb in [(1557, 0.78), (1617, 0.76), (1491, 0.79), (1422, 0.77)]:
    rev += comb(wet, d, fb)
rev /= 4
rev = allpass(rev, 225)
rev = allpass(rev, 556)
rev = lowpass_const(rev, 3200)

mono = dry + rev * 0.55

# gentle master fade in/out
fade_in = int(0.4 * SR)
mono[:fade_in] *= np.linspace(0, 1, fade_in)
fade_out = int(2.2 * SR)
mono[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.4

# soft clip + normalize
mono = np.tanh(mono * 1.1)
mono *= 0.82 / max(np.max(np.abs(mono)), 1e-9)

# stereo: haas-widened reverb, centered lows
haas = int(0.011 * SR)
revL = rev; revR = np.concatenate([np.zeros(haas), rev[:-haas]])
side = revL - revR
side = np.tanh(side) * 0.18
L = np.clip(mono + side, -1, 1)
R = np.clip(mono - side, -1, 1)

stereo = np.empty(N * 2, dtype=np.int16)
stereo[0::2] = (L * 32767).astype(np.int16)
stereo[1::2] = (R * 32767).astype(np.int16)
with wave.open(f"{D}/music.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(stereo.tobytes())
print("music.wav written:", round(TOTAL, 2), "s")
