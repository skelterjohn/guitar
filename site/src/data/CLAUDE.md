# site/src/data

## repertoire.yaml / njgo-roster.yaml

These two files are live-edited in production through the site's njgo
editor (bookend writes straight to GCS at `gs://skelterjohnguitar-pdf/`),
so the copy in this directory can silently drift out of date relative to
what's actually live. `build-site.yaml`'s deploy pipeline deliberately
does **not** sync these files for the same reason — an unconditional
overwrite at deploy time could discard live edits made outside of git.

Before making any change to either file, first download the current prod
copy and diff it against the local one to confirm they still match:

```powershell
site\devops\download-yaml-config.ps1
```

(or `gcloud storage cp gs://skelterjohnguitar-pdf/repertoire.yaml <tmp>` to
compare without overwriting the local file first — use
`diff --strip-trailing-cr` since `gcloud storage cp` downloads with
different line endings than the local git checkout).

If they diverge, surface that to the user before overwriting anything.

Once a change is ready, push it live with:

```powershell
site\devops\upload-yaml-config.ps1
```

Note the local dev copy is separate: the Vite dev server and local
`bookend` point at the `skelterjohnguitar-dev` sandbox bucket by default
(see `site/AGENTS.md`), synced via `upload-yaml-config-dev.ps1` /
`download-yaml-config-dev.ps1`. The prod-divergence check above is about
`skelterjohnguitar-pdf` specifically, since that's the bucket other people
can edit live.
