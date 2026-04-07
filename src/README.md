# Hopara Panel

Hopara Panel embeds a Hopara frontend inside Grafana and, in later iterations, can override Hopara datasets with the final results of Grafana queries.

## Overview

Use this plugin when you want Grafana to act as the host shell for a Hopara visualization. The plugin is intentionally thin:

- Grafana owns query execution, variables, time range, and transformations
- Hopara owns the visualization experience inside the iframe
- the panel bridges configuration, discovery, and query-result transport

## Requirements

- A reachable Hopara frontend URL for embedding
- Reachable Hopara endpoints for visualization and dataset discovery
- Grafana 10.0.0 or newer

## Getting Started

1. Install the plugin in Grafana.
2. Add the Hopara Panel to a dashboard.
3. Configure the Hopara URLs in the panel editor.
4. Select the Hopara visualization you want to embed.
5. Map Grafana query results to the Hopara datasets you want to override.

## Status

This repository currently contains the scaffold baseline for the plugin. Runtime integration and panel configuration will be expanded in subsequent tasks.
