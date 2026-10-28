# Test Failure Report: Session A

- **Branch:** `feature/agent-a`
- **Command:** `npm test` (runs `ng test`, which uses Karma and Jasmine)
- **Date:** 2026-10-28
- **Environment:** macOS host, Node v10.24.1, Chrome 156
- **Result:** **4 of 4 specs FAILED**

```
Chrome 156.0.0 (Mac OS X 10.15.7): Executed 4 of 4 (4 FAILED) ERROR (12.488 secs / 11.901 secs)
npm ERR! Test failed.
```

## Most important failures

### 1. `AppComponent`: all 3 specs fail on template parse errors

Failing specs: `should create the app`, `should have as title 'parksAndRec'`, `should render title in a h1 tag`

```
Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.   (AppComponent.html@15:59)
'mat-chip' is not a known element.                                    (AppComponent.html@28:2)
'mat-chip-list' is not a known element.                               (AppComponent.html@27:0)
```

- **Cause:** `src/app/app.component.spec.ts` only declares `AppComponent`. The template needs `FormsModule` (for `ngModel`) and `MatChipsModule` (for `mat-chip` and `mat-chip-list`), and the spec imports neither.
- **Impact:** `compileComponents()` throws, so every spec in the file fails before its assertions run. One failure point breaks all 3 tests.
- **Hidden behind it:** these will fail next, once the template compiles:
  - `No provider for HttpClient`, because `AppComponent` injects `GooglemapsService`, which needs `HttpClient`.
  - The stale assertion `'Welcome to parksAndRec!'`. The `<h1>` now renders `Parks & Rec`.

### 2. `GooglemapsService`: `should be created` fails on DI

```
StaticInjectorError(DynamicTestModule)[HttpClient]:
  NullInjectorError: No provider for HttpClient!
```

- **Cause:** `src/googlemaps.service.spec.ts` calls `TestBed.configureTestingModule({})` with no imports, but the service's constructor injects `HttpClient`.
- **Fix:** import `HttpClientTestingModule` from `@angular/common/http/testing`.

## Test-runner problems seen in the run

| Problem | Evidence | Fix |
|---|---|---|
| **Chrome sometimes doesn't connect.** On the first run, Karma killed Chrome after 60 seconds and no specs ran. | `Chrome have not captured in 60000 ms, killing.` | Use `ChromeHeadless`, or raise `captureTimeout`. |
| **The run never exits.** Karma runs with `singleRun: false` and `autoWatch: true`, so it had to be stopped with Ctrl-C. That leads to the misleading `Cannot read property 'success' of undefined` error. | Both runs needed `^C`. | `ng test --watch=false` |
| **The browser data is out of date.** | `Browserslist: caniuse-lite is outdated` | `npm update caniuse-lite browserslist` (only a warning) |
| **The project needs Node 10.** In the Node 22 agent container, the build fails on the OpenSSL change. | `ERR_OSSL_EVP_UNSUPPORTED` | Run the tests on Node 10 (`Dockerfile.angular`), or set `NODE_OPTIONS=--openssl-legacy-provider` on newer Node. |

## Related source issue (not failing yet)

`GooglemapsService.search()` never returns the inner promise, so it returns `undefined` and the parks list never fills in. Any future spec for `search()` or `AppComponent.submit()` will fail. Those specs should mock the Google API calls with `HttpTestingController`.

## Recommended fixes, in priority order

1. **`app.component.spec.ts`:** import `FormsModule`, `MatChipsModule`, `MatButtonModule` and `HttpClientTestingModule`, or add `NO_ERRORS_SCHEMA`. This fixes 2 of the 3 specs right away.
2. **`googlemaps.service.spec.ts`:** import `HttpClientTestingModule`. Also remove the `declare function describe/it/expect` lines, which shadow the `@types/jasmine` globals.
3. **`app.component.spec.ts`:** update the h1 assertion to `Parks` / `Rec` to match the current template.
4. **CI and agents:** run the tests with `ng test --watch=false --browsers=ChromeHeadless` on Node 10.
