# Deployment

How this app gets from a green PR to a running production URL.

## Environments

| Environment | Branch        | Workflow                                  | URL              |
| ----------- | ------------- | ----------------------------------------- | ---------------- |
| Staging     | `staging`     | `.github/workflows/staging-deploy.yml`    | _set in workflow_ |
| Production  | `production`  | `.github/workflows/production-deploy.yml` | _set in workflow_ |

Both workflows are triggered by a push to the matching branch. Pushes happen by fast-forwarding `main` into the deploy branch — never by pushing a feature branch directly. See `CONTRIBUTING.md` "Deployments" for the team flow.

## Required secrets and variables

Configure these in GitHub repo **Settings → Secrets and variables → Actions** before the first prod deploy. The variable column is split between repo-scoped and environment-scoped (`production` environment).

### Always required

| Name                              | Where          | Purpose                                                     |
| --------------------------------- | -------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL_PRODUCTION`    | Secret (env)   | API origin used by axios in prod                            |
| `VITE_APP_NAME`                   | Variable       | Document title and Sentry tagging                           |
| `VITE_SENTRY_DSN`                 | Secret (env)   | Error monitoring                                            |
| `VITE_PERSIST_ENCRYPT_KEY_PRODUCTION` | Secret (env) | AES key for `redux-persist-transform-encrypt`. **Rotate per release.** |

### Per target

Pick one of the deploy blocks in `production-deploy.yml` and configure its secrets below.

#### S3 + CloudFront

| Name                              | Where          |
| --------------------------------- | -------------- |
| `AWS_REGION`                      | Variable       |
| `AWS_S3_BUCKET`                   | Variable       |
| `AWS_DEPLOY_ROLE_ARN`             | Secret         |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID`  | Secret         |

Use OIDC (`aws-actions/configure-aws-credentials@v4` with `role-to-assume`) — long-lived access keys are forbidden. Set the role's trust policy to allow this repo's `production` environment only.

#### Netlify

| Name                  | Where  |
| --------------------- | ------ |
| `NETLIFY_AUTH_TOKEN`  | Secret |
| `NETLIFY_SITE_ID`     | Secret |

#### Vercel

| Name                | Where  |
| ------------------- | ------ |
| `VERCEL_TOKEN`      | Secret |
| `VERCEL_ORG_ID`     | Secret |
| `VERCEL_PROJECT_ID` | Secret |

#### GitHub Pages

No extra secrets. Enable Pages under **Settings → Pages → Source: GitHub Actions**, then uncomment the Pages block in the workflow.

## Wiring it up

1. Pick your host above.
2. Add the secrets/variables.
3. Open `.github/workflows/production-deploy.yml`. Uncomment exactly **one** deploy block in the `deploy` job. Delete the `TODO marker` step.
4. Update the `environment.url` in the same job to your production URL (helps GitHub show the deploy link on PRs).
5. Open a PR with the workflow change. The first push to `production` after merge will deploy.

## Promotion flow

```
feat branch → PR → main → ff-merge → staging → smoke test → ff-merge → production
```

- `staging` and `production` are deploy-only branches; the workflows are their only writers (besides the human pressing `git push origin main:production`).
- Hotfixes still go via `main` — branch off `main`, merge to `main`, then ff `staging` and `production` again.

## Verifying a deploy

After a deploy:

1. Open the production URL.
2. Check the Network tab — `VITE_API_BASE_URL` should match the prod API.
3. In Sentry, the latest release tag should match `package.json` version.
4. Trigger a known error from a test account; verify it lands in Sentry.

If anything looks off, roll back by pushing the previous `main` SHA into `production`:

```bash
git push --force-with-lease origin <prev-sha>:production
```

Avoid force-pushing if a rollback can be a forward fix instead — but force-push is the documented escape hatch.

## Rollback

The build artifact uploaded in the `build` job is retained for 7 days. To redeploy a known-good build:

1. Open the Actions tab → previous successful `production-deploy` run.
2. Re-run the `deploy` job (Actions → Re-run jobs → Re-run failed/specific job).

If older than 7 days, force-push the prior `main` SHA to `production` instead.
