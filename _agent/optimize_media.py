"""Media optimization pass (owner ask 2026-10-08): shrink the heavy raw media
found by _agent/media_audit.mjs.
  - all logo-intro-*.mp4 + hero-banners/*.mp4 + wyz-nav-bg-new.mp4 -> 720p/CRF30
  - images/merch/dbc-archive/*.jpg -> max 1600px, q4 (~80)
  - /wyz-crown.png -> 256px webp (splash logo)
Skips files already small. Writes a log; run detached.
"""
import os
import subprocess
import sys

FF = r"C:\Users\torre\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe"
ROOT = r"V:\wyzdesign\public"
LOG = r"C:\Users\torre\AppData\Local\Temp\opencode\optimize_media.log"

VID = ["-c:v", "libx264", "-preset", "medium", "-crf", "30", "-maxrate", "1600k",
       "-bufsize", "3200k", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
       "-vf", "scale=-2:720"]

def log(m):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(m + "\n")
    print(m)

def run(args):
    return subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error", *args]).returncode

def optimize_video(path, min_kb=800):
    if not os.path.isfile(path):
        return
    before = os.path.getsize(path)
    if before < min_kb * 1024:
        log(f"skip (small) {os.path.relpath(path, ROOT)} {before//1024}KB")
        return
    tmp = path + ".opt.mp4"
    rc = run(["-i", path, *VID, tmp])
    if rc != 0 or not os.path.isfile(tmp):
        log(f"FAIL video {os.path.relpath(path, ROOT)}")
        if os.path.isfile(tmp):
            os.remove(tmp)
        return
    after = os.path.getsize(tmp)
    if after < before:
        os.replace(tmp, path)
        log(f"video {os.path.relpath(path, ROOT)} {before//1024}KB -> {after//1024}KB")
    else:
        os.remove(tmp)
        log(f"keep {os.path.relpath(path, ROOT)} (no gain)")

def main():
    open(LOG, "w", encoding="utf-8").close()
    # logo intros
    for n in os.listdir(os.path.join(ROOT, "videos")):
        if n.startswith("logo-intro-") and n.endswith(".mp4"):
            optimize_video(os.path.join(ROOT, "videos", n))
    optimize_video(os.path.join(ROOT, "videos", "wyz-nav-bg-new.mp4"), min_kb=300)
    # hero banners
    hb = os.path.join(ROOT, "videos", "hero-banners")
    if os.path.isdir(hb):
        for n in os.listdir(hb):
            if n.endswith(".mp4"):
                optimize_video(os.path.join(hb, n), min_kb=400)
    # dbc-archive jpgs
    arch = os.path.join(ROOT, "images", "merch", "dbc-archive")
    if os.path.isdir(arch):
        for n in os.listdir(arch):
            if not n.lower().endswith((".jpg", ".jpeg")):
                continue
            p = os.path.join(arch, n)
            before = os.path.getsize(p)
            if before < 250 * 1024:
                continue
            tmp = p + ".opt.jpg"
            rc = run(["-i", p, "-vf", "scale='min(1600,iw)':-2", "-q:v", "4", tmp])
            if rc == 0 and os.path.isfile(tmp) and os.path.getsize(tmp) < before:
                os.replace(tmp, p)
                log(f"jpg {n} {before//1024}KB -> {os.path.getsize(p)//1024}KB")
            elif os.path.isfile(tmp):
                os.remove(tmp)
    # crown -> webp
    crown = os.path.join(ROOT, "wyz-crown.png")
    if os.path.isfile(crown):
        webp = os.path.join(ROOT, "wyz-crown.webp")
        rc = run(["-i", crown, "-vf", "scale=256:-1", "-c:v", "libwebp", "-quality", "85", webp])
        if rc == 0 and os.path.isfile(webp):
            log(f"crown.png {os.path.getsize(crown)//1024}KB -> wyz-crown.webp {os.path.getsize(webp)//1024}KB")
    log("DONE")

if __name__ == "__main__":
    sys.exit(main())
