# PRD: ZIP-Code Park Search

## Workflow

A user enters a 5-digit U.S. ZIP code and clicks **Search**, and the app geocodes the ZIP and shows the names of nearby parks as chips, nearest first.

## Trigger

The user clicks the **Search** button in `AppComponent` (`submit()`) while the ZIP code input holds exactly 5 characters.

The button is disabled at any other length, so a click at another length does not start the workflow.

## Decision events

| # | Decision point | Condition | Outcome |
|---|---|---|---|
| D1 | Input length | `zipcode.length === 5` | Search button is enabled. Otherwise it is disabled and nothing happens. |
| D2 | Input format | Input is 5 digits (`/^\d{5}$/`) | Continue to geocoding. Otherwise show "Enter a 5-digit ZIP code." and make no HTTP request. |
| D3 | Geocode request | Geocoding API returns HTTP 200 with `status: "OK"` and at least one result | Continue with the first result's `lat`/`lng`. |
| D4 | Geocode no match | Geocoding API returns `ZERO_RESULTS` or an empty `results` array | Stop. Show "No location found for ZIP <zip>." Do not call Places. |
| D5 | Places request | Nearby Search returns HTTP 200 with at least one result | Render the results. |
| D6 | Places no parks | Nearby Search returns `ZERO_RESULTS` or an empty `results` array | Show "No parks found near <zip>." with an empty chip list. |
| D7 | Request failure | Either request fails (network error, non-2xx status, or a status like `REQUEST_DENIED` or `OVER_QUERY_LIMIT`) | Stop. Show "Search failed. Please try again." Clear the previous results. |

## Ordered actions

1. The user types a ZIP code into the input bound to `AppComponent.zipcode`.
2. The user clicks **Search**, and `submit()` runs (D1).
3. `submit()` checks the input format (D2) and clears any previous results and messages.
4. `submit()` calls `GooglemapsService.search(zip)`.
5. `search()` sends a GET to the Google Geocoding API (`maps/api/geocode/json?address=<zip>&key=<apiKey>`) (D3, D4, D7).
6. `search()` reads `results[0].geometry.location.lat` and `.lng`.
7. `search()` sends a GET to Places Nearby Search (`maps/api/place/nearbysearch/json`) with `location=<lat>,<lng>`, `rankby=distance`, `type=park`, and `key=<apiKey>` (D5, D6, D7).
8. `search()` resolves with the Places `results` array, in the order the API returns it.
9. `submit()` assigns the array to `AppComponent.parks`.
10. The template renders one `mat-chip` per park showing `park.name`, in array order. If a decision event in step 3, 5 or 7 ended the workflow, the template shows that event's message instead.

## Acceptance criteria

Each criterion can be checked with a unit test that mocks HTTP (`HttpClientTestingModule`) or by hand in a running app.

1. **Button gating:** With 0–4 or 6+ characters in the input, the Search button has the `disabled` attribute. With exactly 5 characters it does not.
2. **Format check:** Submitting `"12a45"` makes 0 HTTP requests and shows "Enter a 5-digit ZIP code."
3. **Geocode request:** Submitting `"63109"` makes exactly one GET to a URL that starts with `https://maps.googleapis.com/maps/api/geocode/json` and has `address=63109`.
4. **Places request:** Given a mocked geocode response with `lat: 38.58, lng: -90.29`, the service makes exactly one GET to `https://maps.googleapis.com/maps/api/place/nearbysearch/json` with the query params `location=38.58,-90.29`, `rankby=distance` and `type=park`.
5. **Rendering and order:** Given a mocked Places response with 3 results named `A`, `B` and `C` in that order, the page shows exactly 3 `mat-chip` elements with the text `A`, `B` and `C` in that order.
6. **Unknown ZIP:** Given a mocked geocode response with `results: []`, the service makes 0 Places requests, throws no uncaught error, and the page shows "No location found for ZIP <zip>."
7. **No parks:** Given a mocked Places response with `results: []`, the page shows 0 chips and "No parks found near <zip>."
8. **Request failure:** If either request returns HTTP 500 or a network error, no uncaught error appears in the console, the page shows "Search failed. Please try again.", and no chips from an earlier search remain.
9. **Replace, don't append:** Running two searches in a row with different results shows only the second search's chips.
10. **No committed key:** `git grep` for a Google API key pattern (`AIza[0-9A-Za-z_-]{35}`) across tracked files returns no matches. The key is read from `src/environments`.
11. **Live smoke test:** In a running app with a valid API key and working CORS, searching `63109` shows at least 1 chip within 5 seconds.

## Out of scope

- Showing park addresses (`vicinity`), maps, or details pages
- Paging through more than the first page of Places results
- ZIP+4 or non-U.S. postal codes
- Fixing CORS. Browser calls to the Places web service currently need a CORS-disabling extension. A backend proxy or the Maps JavaScript SDK is a separate piece of work.
