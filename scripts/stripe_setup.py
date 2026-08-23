"""
WYZ Design — Stripe Price ID Setup Helper
Run after creating Prices in Stripe Dashboard.

Usage:
  python stripe_setup.py --starter price_xxx --business price_xxx --pro price_xxx --ultimate price_xxx
  python stripe_setup.py --starter price_xxx --business price_xxx --pro price_xxx --ultimate price_xxx --webhook-secret whsec_xxx
  python stripe_setup.py --check   # Show current config status
"""
import argparse
import subprocess
import sys
import os

VAULT_SCRIPT = r"W:\WYZ_Command_Center\wyz_vault.py"

PRICE_VARS = {
    "starter": "STRIPE_STARTER_PRICE_ID",
    "business": "STRIPE_BUSINESS_PRICE_ID",
    "pro": "STRIPE_PRO_PRICE_ID",
    "ultimate": "STRIPE_ULTIMATE_PRICE_ID",
}

def check_status():
    print("\n=== Stripe Price ID Status ===\n")
    all_set = True
    for tier, var in PRICE_VARS.items():
        result = subprocess.run(
            ["python", VAULT_SCRIPT, "--get", var],
            capture_output=True, text=True, timeout=15
        )
        val = result.stdout.strip()
        if val and val != f"Credential '{var}' not found.":
            print(f"  {tier:12s} = {val[:12]}... SET")
        else:
            print(f"  {tier:12s} = MISSING")
            all_set = False

    # Check webhook secret
    result = subprocess.run(
        ["python", VAULT_SCRIPT, "--get", "STRIPE_WEBHOOK_SECRET"],
        capture_output=True, text=True, timeout=15
    )
    val = result.stdout.strip()
    if val and val != "Credential 'STRIPE_WEBHOOK_SECRET' not found.":
        print(f"  {'webhook':12s} = {val[:12]}... SET")
    else:
        print(f"  {'webhook':12s} = MISSING (webhooks won't process)")
        all_set = False

    print()
    if all_set:
        print("  All Price IDs configured. Ready for checkout.")
    else:
        print("  Some Price IDs are missing. Checkout will show an error.")
        print("  Create Prices in Stripe Dashboard → Products → Prices (recurring monthly)")
        print("  Then run: python stripe_setup.py --starter price_xxx --business price_xxx --pro price_xxx --ultimate price_xxx")
    print()

def save_to_vault(var: str, value: str):
    result = subprocess.run(
        ["python", VAULT_SCRIPT, "--add", var, value],
        capture_output=True, text=True, timeout=15
    )
    if result.returncode == 0:
        print(f"  Saved {var} to vault")
    else:
        print(f"  ERROR saving {var}: {result.stderr or result.stdout}")

def main():
    parser = argparse.ArgumentParser(description="WYZ Design Stripe Price ID Setup")
    parser.add_argument("--check", action="store_true", help="Check current config status")
    parser.add_argument("--starter", help="Stripe Price ID for Starter Pack ($250/mo)")
    parser.add_argument("--business", help="Stripe Price ID for Business Boost ($500/mo)")
    parser.add_argument("--pro", help="Stripe Price ID for Pro Plus ($750/mo)")
    parser.add_argument("--ultimate", help="Stripe Price ID for Ultimate Suite ($1000/mo)")
    parser.add_argument("--webhook-secret", help="Stripe Webhook Signing Secret")
    args = parser.parse_args()

    if args.check:
        check_status()
        return

    if not any([args.starter, args.business, args.pro, args.ultimate]):
        parser.print_help()
        return

    print("\n=== Saving Stripe Price IDs to Vault ===\n")
    if args.starter: save_to_vault("STRIPE_STARTER_PRICE_ID", args.starter)
    if args.business: save_to_vault("STRIPE_BUSINESS_PRICE_ID", args.business)
    if args.pro: save_to_vault("STRIPE_PRO_PRICE_ID", args.pro)
    if args.ultimate: save_to_vault("STRIPE_ULTIMATE_PRICE_ID", args.ultimate)
    if args.webhook_secret: save_to_vault("STRIPE_WEBHOOK_SECRET", args.webhook_secret)

    print("\n=== Next Steps ===")
    print("1. Add these same Price IDs to Vercel Dashboard → Settings → Environment Variables")
    print("2. Redeploy the Vercel project")
    print("3. Run 'python stripe_setup.py --check' to verify")
    print()

if __name__ == "__main__":
    main()
