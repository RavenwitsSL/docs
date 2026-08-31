---
sidebar_position: 7
title: Telemetry upload
---

Upload **telemetry** as a single **CSV** file per request.
There are three possible files that can be sent to this endpoint, each file goes in a separate request.
The name of the uploaded file must be `generation.csv`, `curtailment.csv` or `availability.csv`.

**POST** `https://api.ravenwits.com/api/v0/telemetry/upload/`

Requires **Bearer** API key.

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `plant_id` | string | Yes | Plant identifier (must exist under [Plants](/api-reference/plants)). |
| `file` | file | Yes | CSV only (`.csv` extension). |

## File formats

In all the files, the first line must be the header, with the column names exactly as shown.
The decimal separator must be a point `.`.

### `generation.csv`

Must have 4 columns, the separator between columns must be a semicolon `;`:

- `period_start`: timestamp of the start of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:24:30`
- `period_end`: timestamp of the end of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:26:30`
- `generation kW`: value of the generated power in kW during that period eg. `123.45`
- `valid`: flag indicating whether the data is considered valid. It will have a value of 1 if valid and 0 if not.

Example of `generation.csv`.

```csv
period_start;period_end;generation kW;valid
2025-08-01 15:24:30;2025-08-01 15:26:30;123.45;1
2025-08-01 15:26:30;2025-08-01 15:28:30;130.10;1
2025-08-01 15:28:30;2025-08-01 15:30:30;0.00;0
```

### `curtailment.csv`

Must have 3 columns, the separator between columns must be a semicolon `;`:

- `period_start`: timestamp of the start of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:24:30`
- `period_end`: timestamp of the end of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:26:30`
- `curtailment kW`: value of the curtailment in kW during that period eg. `123.45`

Example of `curtailment.csv`.

```csv
period_start;period_end;curtailment kW
2025-08-01 15:24:30;2025-08-01 15:26:30;123.45
2025-08-01 15:26:30;2025-08-01 15:28:30;98.70
2025-08-01 15:28:30;2025-08-01 15:30:30;0.00
```

### `availability.csv`

Must have 3 columns, the separator between columns must be a semicolon `;`:

- `period_start`: timestamp of the start of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:24:30`
- `period_end`: timestamp of the end of the measurement period in UTC. Format: `YYYY-MM-dd HH:mm:ss` eg. `2025-08-01 15:26:30`
- `availability kW`: value of the available power in kW during that period eg. `123.45`

Example of `availability.csv`.

```csv
period_start;period_end;availability kW
2025-08-01 15:24:30;2025-08-01 15:26:30;123.45
2025-08-01 15:26:30;2025-08-01 15:28:30;150.00
2025-08-01 15:28:30;2025-08-01 15:30:30;150.00
```

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/telemetry/upload/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'plant_id=MY_PLANT_IDENTIFIER' \
  --form 'file=@./generation.csv;type=text/csv'
```

## Responses

| Status | Body |
| ------ | ---- |
| **201** | `{ "message": "…" }` |
| **400** | Missing `plant_id` / `file`, not `.csv`, unknown plant, etc. |
| **401** | Invalid or missing API key. |
| **502** | S3 upload failure (permissions, network). |
| **503** | Telemetry endpoint not configured. |

---
