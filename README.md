# Trail Notes Lab

Trail Notes is a small Node.js web app for browsing hiking trails, with a guided supply-chain lab for Software Supply Chain Guardian. Its learning format is inspired by [OWASP NodeGoat](https://github.com/owasp/nodegoat). The exercises focus on dependency inventory, source paths, and prioritization.

## Getting started

Use Node.js 22 or later.

```sh
npm start
npm test
```

Open [http://127.0.0.1:3000/](http://127.0.0.1:3000/) and choose **Training lab**. The app and its tests use Node.js built-ins. You can also browse from a terminal with `npm run trails -- show cedar-ridge`.

## Run with Docker

```sh
docker build -t trail-notes-lab .
docker run --rm -p 127.0.0.1:3000:3000 trail-notes-lab
```

Open [http://127.0.0.1:3000/](http://127.0.0.1:3000/) to use the lab. The container runs as a non-root user and includes only the application source and static assets. The root `package-lock.json` stays available for Guardian's repository scan.

## Guardian scanner fixture

This repository doubles as a defensive test input for Software Supply Chain Guardian. Its root npm v3 lockfile intentionally contains the fixture versions below as development dependencies. The app and tests run without installing them.

| Expected dependency path | Advisory | GitHub advisory severity |
| --- | --- | --- |
| `trail-notes → cookie@0.6.0` | [CVE-2024-47764](https://github.com/advisories/GHSA-pxg6-pf52-xh8x) | Low |
| `trail-notes → make-dir@3.1.0 → semver@6.3.0` | [CVE-2022-25883](https://github.com/advisories/GHSA-c2qf-rxjj-qqgw) | High |
| `trail-notes → minimist@1.2.5` | [CVE-2021-44906](https://github.com/advisories/GHSA-xvch-5gv4-984h) | Critical |

Scan the repository root and look for two direct development dependencies and one transitive development dependency. Compare the advisory severities with Guardian's application-level risk rankings. Scanner databases and non-CVE rules can produce additional findings, so use the package and advisory IDs to identify the expected cases.

npm audit can also flag `make-dir` as affected through its dependency on `semver`. That parent-package entry traces back to the same semver advisory.
