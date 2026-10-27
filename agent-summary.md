# Repo Summary: `parks-and-rec`

A small, single-page **Angular 7** app (generated with Angular CLI 7.3.1). The user enters a 5-digit ZIP code and the app lists nearby parks as Material chips. The search is currently **mocked**: it returns three hard-coded St. Louis parks and does not call Google APIs.

## Top-level layout

```
.
├── angular.json            # Angular CLI workspace config (project: parksAndRec)
├── package.json            # Angular 7.2, Material/CDK 7.3, flex-layout, RxJS 6.3, TS 3.2
├── package-lock.json
├── tsconfig.json / tslint.json / .editorconfig / .gitignore
├── README.md               # CLI boilerplate plus a "Run in Docker" section
├── Dockerfile.angular      # node:10 image: npm ci, then `ng serve` on 0.0.0.0:4200
├── Dockerfile.agent        # node:22 image with Claude Code installed (dev tooling)
├── e2e/                    # Protractor end-to-end tests (default scaffold)
├── src/                    # Application source (see below)
├── dist/parksAndRec/       # Built output (not tracked)
└── node_modules/           # Installed dependencies (not tracked)
```

## `src/`

| Path | Purpose |
|---|---|
| `main.ts`, `polyfills.ts`, `index.html`, `styles.scss` | Bootstrap, polyfills, host page, global styles |
| `app/app.module.ts` | Root module: imports Forms, HttpClient, BrowserAnimations, Material (Button, Checkbox, Chips), FlexLayout |
| `app/app.component.ts` | Only component. Holds `zipcode` and `parks: Promise`; `submit()` calls the service |
| `app/app.component.html` | Title, shield image, ZIP input with a Search button (enabled at 5 chars), `mat-chip-list` of park names via `async` pipe |
| `app/app.component.scss` | Component styles |
| `app/app.component.spec.ts` | Unit test for the component |
| `googlemaps.service.ts` | `GooglemapsService.search(zip)` returns `Promise<Park[]>` with mock data. Defines the `Park` interface (`name`, `vicinity`, `place_id`) |
| `googlemaps.service.spec.ts` | Service unit test |
| `environments/` | `environment.ts` / `environment.prod.ts` |
| `assets/images/` | `park.jpg`, `shield.png`, and an untracked PDF (`Standardized Client Application (revised 1-15-18).pdf`) |
| `karma.conf.js`, `test.ts`, `tsconfig.*.json`, `tslint.json`, `browserslist` | Test, TypeScript, and lint configuration |

## Scripts (`package.json`)

- `npm start`: `ng serve` (dev server on :4200)
- `npm run build`: `ng build` (output in `dist/parksAndRec`)
- `npm test`: Karma/Jasmine unit tests
- `npm run lint`: TSLint
- `npm run e2e`: Protractor

## Notes

- The data flow is one component calling one service. There is no routing and there are no other modules.
- The working tree has uncommitted changes to README, the component, the service and its spec, `index.html`, and `package-lock.json`. The two Dockerfiles and the PDF are untracked.
- A stray `.DS_Store` is present at the root.
