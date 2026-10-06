#!/bin/sh
# WYZ Design ignoreCommand guard (vercel.json -> `sh _agent/vercel_ignore.sh`).
# Compares app files against the last READY production deployment via Vercel API,
# NOT the tip commit: VERCEL_GIT_PREVIOUS_COMMIT behaves as HEAD^ and wrongly
# canceled a multi-commit bundle push that ended with a docs commit (2026-10-05).
# Fail-open: any unknown state builds (a wasted build beats a stale site).
# vercel.json ignoreCommand field is schema-capped at 256 chars, hence this file.
NODE=$(command -v node || echo none)
if [ "$NODE" = "none" ]; then
  echo "guard: no node in ignore step -> build"
  exit 1
fi
node -e 'const k=process.env.VERCEL_API_KEY||process.env.VERCEL_DEPLOY_TOKEN;fetch("https://api.vercel.com/v6/deployments?projectId=prj_NTkWtVYYEaldcK9agG3U8kYjCS54&limit=25",{headers:{Authorization:"Bearer "+k,Accept:"application/json"}}).then(r=>r.json()).then(d=>{const x=(d.deployments||[]).find(y=>y.readyState==="READY"&&y.target==="production");process.stdout.write(x&&x.meta?x.meta.githubCommitSha||"":"")}).catch(e=>{process.stderr.write("fetchfail:"+e.message)})' > /tmp/last_live_sha 2>/tmp/guard_err
B=$(cat /tmp/last_live_sha 2>/dev/null)
F="src public package.json package-lock.json next.config.ts next.config.js vercel.json tsconfig.json"
if [ -n "$B" ]; then
  if git diff --quiet "$B" HEAD -- $F; then
    echo skip-no-app-changes-since-$B
    exit 0
  else
    echo build-app-changes-since-$B
    exit 1
  fi
fi
echo "guard-diag: token_len=${#VERCEL_API_KEY} node=$NODE err=$(head -c 200 /tmp/guard_err 2>/dev/null) -> build"
exit 1
