---
sidebar_position: 1
title: Overview
---

The customer API is served under the base path **`/api/v0/`**. All authenticated endpoints require the header `Authorization: Bearer <api-key>`. See [Authentication](/api-usage/authentication) for how to obtain an API key.

## Base URL

All endpoints use the base URL `https://api.ravenwits.com`. The examples below use this URL.

## Endpoints summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/api/v0/auth/login/` | No | Sign in with email and password; returns a Bearer token. |
| **POST** | `/api/v0/auth/password/` | Bearer | Change the authenticated user's password; invalidates all existing tokens. |
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
| **POST** | `/api/v0/outages/upload/` | Bearer | Upload CSV outage records (multipart). |
| **GET** | `/api/v0/prices/<region>/<market>` | Bearer + market permission | Get latest price prediction as JSON or CSV. |

## Try the API (Swagger UI)

You can try the API in several ways:

1. **Swagger UI** — Send live requests from swagger: Add your Bearer API key, choose an endpoint, click **Try it out**, fill required parameters (or request body) and click **Execute** to see the response.

2. **Copy and run the examples** — Each endpoint page in this reference includes a **Request** section with a `curl` command. Replace `{your-api-key}` with your Bearer API key, then run the command in your terminal.

3. **Postman or similar** — Use the base URL `https://api.ravenwits.com` and add the header `Authorization: Bearer <api-key>`. Use the paths and bodies from this reference.

## Detailed endpoint docs

- [Login](/api-reference/auth-login) — **POST** `/api/v0/auth/login/`
- [Change password](/api-reference/auth-change-password) — **POST** `/api/v0/auth/password/`
- [List strategies](/api-reference/strategies) — **GET** `/api/v0/strategies/<user>`
- [Submit purchase](/api-reference/purchases#submit-purchase) — **POST** `/api/v0/user/<user>/submit-purchase`
- [Update purchase](/api-reference/purchases#update-purchase) — **PUT** `/api/v0/user/<user>/purchase/<uuid>/update`
- [Get purchase](/api-reference/purchases#get-purchase) — **GET** `/api/v0/user/<user>/purchase/<uuid>/get`
- [Custom forecast](/api-reference/forecasts-custom) — **GET** `/api/v0/forecasts/custom/`
- [Normalized forecast](/api-reference/forecasts-normalized) — **GET** `/api/v0/forecasts/normalized/`
- [Plants](/api-reference/plants) — **GET/POST** `/api/v0/plants/`, **GET/PATCH/PUT** `/api/v0/plants/<uuid>/`
- [Unavailabilities](/api-reference/unavailabilities) — **GET/POST** `/api/v0/unavailabilities/`, **GET/PATCH/PUT** `/api/v0/unavailabilities/<uuid>/`
- [Telemetry upload](/api-reference/telemetry-upload) — **POST** `/api/v0/telemetry/upload/` (CSV)
- [Outages upload](/api-reference/outages-upload) — **POST** `/api/v0/outages/upload/` (CSV)
- [Prices](/api-reference/prices) — **GET** `/api/v0/prices/<region>/<market>`
