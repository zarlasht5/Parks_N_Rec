# Rubric: ZIP-Code Park Search

This rubric scores an implementation of the workflow in [`docs/prd.md`](prd.md). Each dimension is built from specific acceptance criteria (AC) in the PRD.

| Dimension | Source ACs | Scale |
|---|---|---|
| 1. Input gating | AC1, AC2 | 1–4 |
| 2. API requests | AC3, AC4, AC11 | 1–4 |
| 3. Results display | AC5, AC9 | 1–4 |
| 4. Failure handling | AC6, AC7, AC8 | 1–4 |
| 5. Key safety | AC10 | Pass / Fail |

## 1. Input gating

**Definition:** Only a well-formed 5-digit ZIP can start a search. Bad input never causes an HTTP request.

| Level | Description | Example case |
|---|---|---|
| 1: Does not meet | The button isn't gated by length, or bad input reaches the API. | The Search button is enabled with `"123"` in the input. Clicking it sends a geocode request for `address=123`. |
| 2: Partially meets | AC1 passes but AC2 fails: length gates the button, but the format isn't checked. | `"12a45"` enables the button. Clicking it sends a geocode request and shows no format message. |
| 3: Meets | AC1 and AC2 both pass. | `"12a45"` makes 0 HTTP requests and shows "Enter a 5-digit ZIP code." `"63109"` starts a search. |
| 4: Exceeds | Meets, and the input also stops bad entry before submit, with unit tests covering both ACs. | The input has `maxlength="5"` and `inputmode="numeric"`, and pasting `" 63109 "` is trimmed to `63109`. The spec has tests for lengths 4, 5 and 6 and for `"12a45"`. |

## 2. API requests

**Definition:** The service calls Geocoding once, then Places Nearby Search once with the coordinates it got back, using the exact endpoints and parameters in the PRD.

| Level | Description | Example case |
|---|---|---|
| 1: Does not meet | Either request is missing, goes to the wrong endpoint, or uses hard-coded data. | `search()` returns three hard-coded St. Louis parks no matter the ZIP, or calls Places with a fixed `location=38.64,-90.28`. |
| 2: Partially meets | Both requests are made, but AC3 or AC4 fails on one detail. | Places is called with `location` from the geocode result, but `rankby=distance` is missing, so results aren't ordered by distance. Or geocoding fires twice for one click. |
| 3: Meets | AC3 and AC4 both pass in an HTTP-mocked test. | `HttpTestingController.expectOne()` matches one geocode URL with `address=63109`, then one Places URL with `location=38.58,-90.29`, `rankby=distance` and `type=park`. |
| 4: Exceeds | Meets, and AC11 is verified live. | With a valid key and working CORS, searching `63109` shows at least 1 chip within 5 seconds, and the run is recorded (date, ZIP, chip count). |

## 3. Results display

**Definition:** The page shows one chip per park, with the park's name, in the order the API returned them. A new search replaces the old results.

| Level | Description | Example case |
|---|---|---|
| 1: Does not meet | Results don't render, or the wrong field is shown. | A response with parks `A`, `B`, `C` shows no chips, or shows `[object Object]` or the `place_id` values. |
| 2: Partially meets | Names render, but AC5 or AC9 fails. | Parks `A`, `B`, `C` show as 3 chips, but a second search returning `D`, `E` shows 5 chips (`A`–`E`). Or the chips are sorted alphabetically instead of in API order. |
| 3: Meets | AC5 and AC9 both pass. | `A`, `B`, `C` shows exactly 3 chips in that order. A second search returning `D`, `E` shows exactly `D`, `E`. |
| 4: Exceeds | Meets, and a component test checks both ACs, with a loading state while a search is running. | The spec asserts the chip text and order after each of two searches. The button shows "Searching…" and is disabled until the promise settles. |

## 4. Failure handling

**Definition:** An unknown ZIP, an area with no parks, or a failed request each ends the workflow cleanly with the message the PRD specifies, and never with an uncaught error.

| Level | Description | Example case |
|---|---|---|
| 1: Does not meet | None of AC6–AC8 pass. Failures throw or fail silently. | A geocode response with `results: []` throws `TypeError: Cannot read property 'geometry' of undefined` in the console, and the page doesn't change. |
| 2: Partially meets | One or two of AC6–AC8 pass. | An unknown ZIP shows "No location found for ZIP 00000.", but an HTTP 500 from Places leaves the previous search's chips on screen with no message. |
| 3: Meets | AC6, AC7 and AC8 all pass. | Each of these shows its PRD message with no console error and no leftover chips: geocode `results: []`, Places `results: []`, and HTTP 500 from either request. |
| 4: Exceeds | Meets, and API-level statuses are handled too, with a test for each failure path. | A geocode HTTP 200 with `status: "REQUEST_DENIED"` is treated as a failure (D7), not as "no location". The spec has at least one test per decision event D4, D6 and D7. |

## 5. Key safety (Pass / Fail)

**Definition:** No Google API key is committed, and the service reads the key from `src/environments`.

| Result | Description | Example case |
|---|---|---|
| Fail | A key is in tracked files, or the key is hard-coded in the service. | `git grep -E 'AIza[0-9A-Za-z_-]{35}'` returns a match. Or `googlemaps.service.ts` has `private apiKey = 'REMOVED'` instead of reading from `environment`. |
| Pass | The grep returns nothing, and the key comes from `environment`. | The grep returns 0 matches. The service uses `environment.googleMapsApiKey`, which is empty in the committed `environment.ts` and filled in locally. |

## Pass threshold

An implementation **passes** only if both of these are true:

1. Dimension 5 (Key safety) is **Pass**.
2. Dimensions 1–4 each score **3 or higher**.

Any 1 or 2, or a Fail on dimension 5, means it doesn't pass, whatever the other scores are. Report the total of dimensions 1–4 (out of 16) alongside the result to compare implementations that pass. A total of 12 means every dimension just meets the bar.
