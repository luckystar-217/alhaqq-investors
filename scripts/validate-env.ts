#!/usr/bin/env node
/**
 * scripts/validate-env.ts
 *
 * Runs automatically in the `prebuild` step.  It re-uses the *single source
 * of truth* in `lib/env.ts`; if that file throws, the build will fail.
 * When the import succeeds we exit(0).  This prevents duplicate / divergent
 * validation logic and allows the fallback-secret mechanism to work.
 */

import { env, isDevelopment } from "../lib/env"

console.log(`✅ Environment validated for ${env.APP_NAME} (NODE_ENV=${env.NODE_ENV}).`)

if (isDevelopment) {
  console.log("ℹ️  Development mode detected – fallback secrets generated where necessary.")
}
