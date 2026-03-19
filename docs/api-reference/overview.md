---
sidebar_position: 1
title: Overview
---

# API Reference

The customer API is served under the base path **`/api/v0/`**. All authenticated endpoints require the header `Authorization: Bearer <token>`. See [Authentication](/api-usage/authentication) for how to obtain a token.

## Base URL

All endpoints use the base URL **https://api.ravenwits.com**. The examples below use this URL.

## Endpoints summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/v0/auth/login/` | No | Sign in with email and password; returns a Bearer token. |
| **GET** | `/api/v0/strategies/<user>` | Bearer | List strategies for a user (requires `idretailer`). |
| **POST** | `/api/v0/user/<user>/submit-purchase` | Bearer | Submit a new purchase. |
| **PUT** | `/api/v0/user/<user>/purchase/<uuid>/update` | Bearer | Update an existing purchase (e.g. status, outputs). |
| **GET** | `/api/v0/user/<user>/purchase/<uuid>/get` | Bearer | Get one purchase by ID. |
| **GET** | `/api/v0/forecasts/custom/` | Bearer | Get latest forecast(s) by type (Forecast, DailyHourly, or all) as JSON, CSV, or ZIP. |
| **GET** | `/api/v0/forecasts/normalized/` | Bearer | Get latest normalized forecast per plant (standard for UI); optional plant and timezone; JSON or CSV. |
| **GET** | `/api/v0/plants/` | Bearer | List plants for the logged-in customer. |
| **POST** | `/api/v0/plants/` | Bearer | Create a plant. |
| **GET/PATCH/PUT** | `/api/v0/plants/<uuid>/` | Bearer | Get or update one plant. |
| **GET** | `/api/v0/unavailabilities/` | Bearer | List unavailabilities (optional `plant_id`). |
| **POST** | `/api/v0/unavailabilities/` | Bearer | Create unavailability interval. |
| **GET/PATCH/PUT** | `/api/v0/unavailabilities/<uuid>/` | Bearer | Get or update one record. |
| **POST** | `/api/v0/telemetry/upload/` | Bearer | Upload CSV telemetry (multipart). |
| **GET** | `/health/` | No | Health check; returns `{"status": "healthy"}`. |

## Try the API (playground)

You can try the API in several ways:

1. **[API Playground](/api-playground)** — Send live requests from this documentation: choose an endpoint, add your Bearer token (or request body for login), and click **Try it!** to see the response. Works in the browser when the API allows requests from this site.

2. **Copy and run the examples** — Each endpoint page in this reference includes a **Request** section with a `curl` command. Replace `{your-token}` with your Bearer token, then run the command in your terminal.

3. **Postman or similar** — Use the base URL `https://api.ravenwits.com` and add the header `Authorization: Bearer <token>`. Use the paths and bodies from this reference.

## Detailed endpoint docs

- [Login](/api-reference/auth-login) — **POST** `/api/v0/auth/login/`
- [List strategies](/api-reference/strategies) — **GET** `/api/v0/strategies/<user>`
- [Submit purchase](/api-reference/purchases#submit-purchase) — **POST** `/api/v0/user/<user>/submit-purchase`
- [Update purchase](/api-reference/purchases#update-purchase) — **PUT** `/api/v0/user/<user>/purchase/<uuid>/update`
- [Get purchase](/api-reference/purchases#get-purchase) — **GET** `/api/v0/user/<user>/purchase/<uuid>/get`
- [Custom forecast](/api-reference/forecasts-custom) — **GET** `/api/v0/forecasts/custom/`
- [Normalized forecast](/api-reference/forecasts-normalized) — **GET** `/api/v0/forecasts/normalized/`
- [Plants](/api-reference/plants) — **GET/POST** `/api/v0/plants/`, **GET/PATCH/PUT** `/api/v0/plants/<uuid>/`
- [Unavailabilities](/api-reference/unavailabilities) — **GET/POST** `/api/v0/unavailabilities/`, **GET/PATCH/PUT** `/api/v0/unavailabilities/<uuid>/`
- [Telemetry upload](/api-reference/telemetry-upload) — **POST** `/api/v0/telemetry/upload/` (CSV)
- [Health check](/api-reference/health) — **GET** `/health/`
