# _CONFER brief: Review agent (code review + adversarial)

Lane: independent review and adversarial checks.

## Do
- Review every diff for correctness, regressions, redirect loops, and duplicate routes.
- Adversarially check the merge plan: what breaks if a redirect is wrong, if a page is thin, or if two routes point at the same target.
- Confirm gates pass (build, tsc, lint, tests, axe, gutters) and the deploy is live for the exact SHA.
- Report verified, inferred, and unverified separately.

## Verdict (fill in)
- Blockers found:
- Risks the plan misses:
- Gates status:
- Vote (see `_CONFER/README.md` matrix):
