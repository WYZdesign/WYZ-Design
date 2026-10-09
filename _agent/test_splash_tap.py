"""Mobile tap test: does the splash Enter Site button actually navigate?

Run:  python _agent/test_splash_tap.py [base_url]
Emulates a phone (touch + mobile UA), taps button.wyz-enter on /splash and
asserts the route leaves /splash. Also asserts the scroll lock is still
engaged, since the fix had to keep blocking scroll while no longer
canceling the tap.
"""
import sys

from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3311").rstrip("/")
UA = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)
SHOT = r"W:\WYZ_Command_Center\_STATE\web_shots\splash_tap_result.png"


def main() -> int:
    fails = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True,
            user_agent=UA,
        )
        page = ctx.new_page()
        page.goto(f"{BASE}/splash", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(3000)

        locked = page.evaluate("document.documentElement.dataset.splashLocked === 'true'")
        print("scroll lock engaged:", locked)
        if not locked:
            fails.append("scroll lock not engaged")

        btns = page.locator("button.wyz-enter")
        n = btns.count()
        print("enter buttons found:", n)
        if n == 0:
            fails.append("no button.wyz-enter on /splash")
        else:
            btns.first.tap(timeout=15000)
            page.wait_for_timeout(4000)
            url = page.url
            print("url after tap:", url)
            if "/splash" in url:
                fails.append(f"tap did not navigate, still on {url}")

        page.screenshot(path=SHOT, full_page=False)
        print("shot:", SHOT)
        browser.close()

    if fails:
        print("FAIL:", "; ".join(fails))
        return 1
    print("PASS: touch tap on Enter Site navigates away from /splash")
    return 0


if __name__ == "__main__":
    sys.exit(main())
