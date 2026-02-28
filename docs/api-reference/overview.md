---
sidebar_position: 4
title: API Reference Overview
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
| **GET** | `/api/v0/forecasts/latest/` | Bearer | Get the latest forecast (JSON or CSV). |
| **GET** | `/health/` | No | Health check; returns `{"status": "healthy"}`. |

## Try the API (playground)

You can try the API in several ways:

1. **[API Playground](/api-playground)** — Send live requests from this documentation: choose an endpoint, add your Bearer token (or request body for login), and click **Try it!** to see the response. Works in the browser when the API allows requests from this site.

2. **Copy and run the examples** — Each endpoint page in this reference includes a **Request** section with a `curl` command. Replace `{your-token}` with your Bearer token, then run the command in your terminal.

3. **Interactive API docs** — Open [https://api.ravenwits.com/docs/v0/](https://api.ravenwits.com/docs/v0/) in your browser to browse endpoints and, where available, send test requests.

4. **Postman or similar** — Use the base URL `https://api.ravenwits.com` and add the header `Authorization: Bearer <token>`. Use the paths and bodies from this reference.

## Detailed endpoint docs

- [Login](/api-reference/auth-login) — **POST** `/api/v0/auth/login/`
- [List strategies](/api-reference/strategies) — **GET** `/api/v0/strategies/<user>`
- [Submit purchase](/api-reference/purchases#submit-purchase) — **POST** `/api/v0/user/<user>/submit-purchase`
- [Update purchase](/api-reference/purchases#update-purchase) — **PUT** `/api/v0/user/<user>/purchase/<uuid>/update`
- [Get purchase](/api-reference/purchases#get-purchase) — **GET** `/api/v0/user/<user>/purchase/<uuid>/get`
- [Latest forecast](/api-reference/forecasts) — **GET** `/api/v0/forecasts/latest/`
- [Health check](/api-reference/health) — **GET** `/health/`
