# Manual Smoke Test

## Environment

- Hopara frontend reachable at `embeddedUrl`
- visualization endpoint reachable at `visualizationUrl`
- dataset endpoint reachable at `datasetUrl`
- Grafana dev server running via `docker compose up --build`

## Checks

1. Add the Hopara panel to a dashboard.
2. Set `embeddedUrl`, `visualizationUrl`, and `datasetUrl`.
3. Confirm the visualization combobox loads remote options.
4. Add two dashboard queries, for example `A` and `B`.
5. Confirm the mapping editor shows one row per query identity.
6. Confirm inferred mappings can be manually overridden.
7. Confirm the iframe loads after choosing a visualization.
8. Change the dashboard time range and confirm the visualization refreshes.
9. Change a dashboard variable and confirm the visualization refreshes.
10. Remove one mapping and confirm the panel shows a warning instead of hard failing.
