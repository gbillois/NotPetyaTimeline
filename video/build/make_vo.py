#!/usr/bin/env python3
"""Generate per-scene voiceover MP3s with edge-tts and report durations."""
import asyncio, json, subprocess, sys, os

sys.path.insert(0, os.path.expanduser("~/Library/Python/3.9/lib/python/site-packages"))
import edge_tts

VOICE = "en-US-AndrewNeural"
RATE = "+4%"

SCENES = {
    "s1": "June 27th, 2017. In seventeen minutes, the world's largest shipping company is about to lose every computer it owns. This is the story of NotPetya — the most destructive cyberattack in history.",
    "s2": "The weapon wasn't built by criminals. EternalBlue — an exploit developed inside the NSA — was stolen, and dumped on the internet. Microsoft had shipped a patch. Much of the world never applied it. WannaCry was the warning shot. The world ignored it.",
    "s3": "June 27th. Russian military hackers detonate a poisoned update inside M.E.Doc — the tax software used by nearly every company in Ukraine. One trusted supplier. Within an hour, ten percent of the country's computers are wiped. Banks. Airports. Even Chernobyl's radiation monitors.",
    "s4": "And the worm doesn't stop at the border. It rides every V P N it finds. Maersk loses forty-nine thousand laptops — in seventeen minutes. Merck halts vaccine production. FedEx. Saint-Gobain. Mondelez. None of them were targets. All of them were collateral damage.",
    "s5": "Maersk survives because of one domain controller in Ghana — offline that day, during a power outage. From that single surviving server, the entire company is rebuilt in ten days — running on WhatsApp, and paper.",
    "s6": "There was never a ransom. NotPetya was a wiper, dressed as cybercrime. Total damage: over ten billion dollars. Five nations name the attacker: Russian military intelligence. Insurers call it an act of war — and refuse to pay. Merck fights five years for its one point four billion.",
    "s7": "Three lessons for the board. You don't have to be the target, to be destroyed. Your most trusted supplier can be the way in. And resilience can hang on a single offline server. NotPetya wasn't the last of its kind. It was the first.",
}

OUT = os.path.join(os.path.dirname(__file__), "vo")

async def gen(name, text):
    tts = edge_tts.Communicate(text, VOICE, rate=RATE)
    await tts.save(os.path.join(OUT, f"{name}.mp3"))

async def main():
    for name, text in SCENES.items():
        await gen(name, text)
    durs = {}
    for name in SCENES:
        p = subprocess.run(
            ["/opt/homebrew/bin/ffprobe", "-v", "quiet", "-show_entries",
             "format=duration", "-of", "csv=p=0", os.path.join(OUT, f"{name}.mp3")],
            capture_output=True, text=True)
        durs[name] = round(float(p.stdout.strip()), 2)
    print(json.dumps(durs, indent=2))
    print("total VO:", round(sum(durs.values()), 2), "s")

asyncio.run(main())
