# Build Report

**Command:** `npm run build` (runs `ng build`)
**Date:** 2026-10-29
**Result:** ❌ **FAILED** (exit code 1)

## Environment

| Component | Version |
|---|---|
| Node.js | v22.23.3 |
| npm | 10.9.9 |
| @angular/cli | 7.3.5 |
| @angular-devkit/build-angular | 0.13.5 |
| webpack | 4.29.0 |

## Error that caused the failure

    Error: error:0308010C:digital envelope routines::unsupported
        at new Hash (node:internal/crypto/hash:101:19)
        at Object.createHash (node:crypto:139:10)
        at module.exports (/workspace/node_modules/webpack/lib/util/createHash.js:90:53)
        at NormalModule._initBuildHash (/workspace/node_modules/webpack/lib/NormalModule.js:401:16)
        ...
      library: 'digital envelope routines',
      reason: 'unsupported',
      code: 'ERR_OSSL_EVP_UNSUPPORTED'

## Summary

The build crashes almost immediately, while webpack is setting up module hashing. It never gets as far as compiling any application code.

- **Where it fails:** `webpack/lib/util/createHash.js` calls `crypto.createHash()` from inside `NormalModule._initBuildHash`.
- **Error code:** `ERR_OSSL_EVP_UNSUPPORTED`.
- **Probable cause:** webpack 4.29.0, which comes with Angular CLI 7, hashes modules with `md4`. Node.js 17 and later ship OpenSSL 3, which turns `md4` off by default. Running this toolchain on Node.js v22 makes the hash call throw. This is a mismatch between the Node runtime and the toolchain, not a problem in the project's code.
- **No source-level errors were reported.** The build stopped before TypeScript or Angular compilation ran.

## Non-fatal output (did not cause the failure)

- `DEP0111` deprecation warning: `process.binding('http_parser')` (printed twice).
- `DEP0060` deprecation warning: `util._extend`.
- npm notice that a newer npm version (12.2.1) is available.

## Notes

As instructed, no fixes were attempted and no source files were changed.
