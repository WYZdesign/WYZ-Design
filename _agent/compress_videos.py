"""Compress oversized videos in public/videos (WYZ Design).

Files >= 4MB are re-encoded to 720p-max H.264 (CRF 27, veryfast), AAC 96k,
faststart. Writes to a temp file first; only replaces the original if the
result is smaller. Never truncates a source. Logs every step to _LOGS path
passed as argv[1] (default: _compress.log next to this file).
"""
import os
import subprocess
import sys
import time

ROOT = r"V:\wyzdesign\public\videos"
LOG = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "_compress.log")
THRESHOLD = 4 * 1024 * 1024
SCALE = ("scale=w='if(gt(min(iw,ih),720),if(gt(iw,ih),-2,720),iw)'"
         ":h='if(gt(min(iw,ih),720),if(gt(iw,ih),720,-2),ih)'")

def log(msg: str) -> None:
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"[{time.strftime('%H:%M:%S')}] {msg}\n")

def main() -> None:
    jobs = []
    for dirpath, _, files in os.walk(ROOT):
        for name in files:
            if not name.lower().endswith((".mp4", ".mov", ".webm")):
                continue
            p = os.path.join(dirpath, name)
            if os.path.getsize(p) >= THRESHOLD:
                jobs.append(p)
    jobs.sort(key=lambda p: os.path.getsize(p), reverse=True)
    log(f"start: {len(jobs)} files >=4MB")
    done = fail = 0
    for src in jobs:
        orig = os.path.getsize(src)
        tmp = src + ".tmp.mp4"
        cmd = ["ffmpeg", "-y", "-i", src, "-vf", SCALE, "-c:v", "libx264",
               "-crf", "30", "-preset", "veryfast", "-pix_fmt", "yuv420p",
               "-maxrate", "1600k", "-bufsize", "3200k",
               "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", tmp]
        t0 = time.time()
        try:
            r = subprocess.run(cmd, capture_output=True, timeout=1800)
            if r.returncode == 0 and os.path.exists(tmp):
                new = os.path.getsize(tmp)
                if new and new < orig:
                    os.replace(tmp, src)
                    done += 1
                    log(f"OK {os.path.relpath(src, ROOT)} {orig//1048576}MB -> {new//1048576}MB ({time.time()-t0:.0f}s)")
                else:
                    os.remove(tmp)
                    log(f"SKIP {os.path.relpath(src, ROOT)} result not smaller ({new} vs {orig})")
            else:
                if os.path.exists(tmp):
                    os.remove(tmp)
                fail += 1
                err = (r.stderr or b"")[-300:].decode("utf-8", "replace")
                log(f"FAIL {os.path.relpath(src, ROOT)} rc={r.returncode}: {err}")
        except subprocess.TimeoutExpired:
            if os.path.exists(tmp):
                os.remove(tmp)
            fail += 1
            log(f"TIMEOUT {os.path.relpath(src, ROOT)}")
    log(f"done: ok={done} fail={fail}")

if __name__ == "__main__":
    main()
