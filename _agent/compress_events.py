"""Tighten the events videos (client-events + diy-shows) that the first pass left
heavy (some recaps still 6-17MB; ColorAuraVideo autoplays one on /events)."""
import os
import subprocess

FF = r"C:\Users\torre\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe"
ROOT = r"V:\wyzdesign\public\videos"
LOG = r"C:\Users\torre\AppData\Local\Temp\opencode\compress_events.log"
VID = ["-c:v", "libx264", "-preset", "medium", "-crf", "31", "-maxrate", "1000k",
       "-bufsize", "2400k", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
       "-vf", "scale=-2:720"]

def log(m):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(m + "\n")
    print(m)

def main():
    open(LOG, "w", encoding="utf-8").close()
    for sub in ("client-events", "diy-shows"):
        d = os.path.join(ROOT, sub)
        if not os.path.isdir(d):
            continue
        for n in sorted(os.listdir(d)):
            if not n.lower().endswith(".mp4") or n.endswith(".opt.mp4"):
                continue
            p = os.path.join(d, n)
            before = os.path.getsize(p)
            if before < 1500 * 1024:
                log(f"skip (small) {sub}/{n} {before//1024}KB")
                continue
            tmp = p + ".opt.mp4"
            rc = subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error", "-i", p, *VID, tmp]).returncode
            if rc == 0 and os.path.isfile(tmp) and os.path.getsize(tmp) < before:
                os.replace(tmp, p)
                log(f"{sub}/{n} {before//1024}KB -> {os.path.getsize(p)//1024}KB")
            else:
                if os.path.isfile(tmp):
                    os.remove(tmp)
                log(f"keep {sub}/{n} ({before//1024}KB)")
    log("DONE")

if __name__ == "__main__":
    main()
