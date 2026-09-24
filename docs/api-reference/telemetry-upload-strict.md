---
sidebar_position: 11
title: Telemetry upload strict
---

Upload operational plant data as **CSV**, one file per request, in Ravenwits'
recommended format.

**POST** `https://api.ravenwits.com/api/v0/telemetry/upload-strict/`

Requires **Bearer** API key.

> This page describes the *encoding*. For what the four quantities mean, how we
use them, and how to decide the value of the `valid` flag, see
**[Telemetry for forecasting: concepts and data quality](/telemetry-concepts)**.

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
|---|---|---|---|
| `plant_id` | string | Yes | Plant identifier. Must exist under [Plants](/api-reference/plants). |
| `file` | file | Yes | A single CSV file (`.csv` extension). |

The **file name determines how the content is interpreted**. It must be exactly
one of:

| File name | Contents | Required |
|---|---|---|
| `generation.csv` | Measured active power, with validity flag | Yes |
| `availability.csv` | Active power the plant was capable of delivering | Recommended |
| `curtailment.csv` | Externally imposed active power ceiling | Recommended |
| `potential.csv` | Active power the plant would have delivered unconstrained | Recommended |

Each file goes in its **own request**. Sending all four for the same period
means four calls.

## Rules common to all files

- The **first line is the header**, with column names exactly as shown below
  (including the space before the unit, e.g. `generation kW`).
- The **column separator is a semicolon** `;`.
- The **decimal separator is a point** `.`. No thousands separator.
- Encoding: **UTF-8**.
- Timestamps are in **UTC**, format `YYYY-MM-DD HH:mm:ss`, e.g.
  `2025-08-01 15:24:30`.
- `period_start` is inclusive, `period_end` is exclusive. Consecutive periods
  therefore share a boundary timestamp and must not overlap.
- All values are **average active power in kW** over the period, not energy.
- Rows should be ordered by `period_start`.
- A period with no data should be **omitted**, not sent with a placeholder value.

> Keep the four files aligned.
Use the same period boundaries across all four files. A record in
`curtailment.csv` whose period does not match a record in `generation.csv`
cannot be applied to it.

## File formats

### `generation.csv`

Four columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `generation kW` | Measured active power over the period, e.g. `123.45` |
| `valid` | `1` if the record may be used for training, `0` if it must be discarded |

#### The `valid` flag

`0` is a **final, irreversible discard of that measurement**: the measured value
is dropped on ingestion and plays no part in any later stage. It does not
necessarily lose the period — if `potential.csv` carries a value for the same
period and that signal validates well, we use it in place of the measurement.
`1` is **not** a commitment to use the record — it means the record is
interpretable, and our filters decide.

Set `1` when either:

- the value reflects real production, unaffected by limitations, outages or
  anything else; or
- the value **is** affected by a limitation or outage, **and you report the
  corresponding value** for that period in `curtailment.csv`,
  `availability.csv` or `potential.csv`.

Set `0` when:

- the value is affected by a limitation or outage you cannot quantify;
- the value is affected by anything else that makes it unrepresentative of
  weather-driven operation — economic shutdown, meter failure, communication
  loss, frozen values, tests, local manual operation;
- you are unsure about the value.

See [the concepts page](/telemetry-concepts#4-the-validity-flag) for the
reasoning and for worked cases.

### `availability.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `availability kW` | Active power the plant was capable of delivering, e.g. `150.00` |

Equal to nominal capacity when the plant is fully operational, reduced for
partial outages, `0` for a full outage.

Records may be sent only for periods in which availability differed from
nominal. If you do so, tell us during onboarding, so that an absent record is
read as "fully available" rather than "unknown".

### `curtailment.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `setpoint kW` | The active power **ceiling in force** during the period, e.g. `100.00` |

> `setpoint kW` is the **limit the plant was not allowed to exceed**, not the
power that was curtailed away. A value of `100.00` on a 150 kW plant means a
100 kW setpoint was in force; a plant under no limitation carries its nominal
capacity, not `0`. If your systems export curtailed energy instead, use
[Telemetry upload custom](/api-reference/telemetry-upload-custom)
and agree the conversion with us.

As with availability, records may be sent only for periods in which a limitation
was in force, by prior agreement.

### `potential.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `potential kW` | Active power the plant would have delivered unconstrained, e.g. `143.10` |

Potential is the most valuable optional file: it lets us keep curtailed and
unavailable periods in the training set instead of discarding them. See
[All four](/telemetry-concepts#all-four).

## Worked example

A 150 kW PV plant, six 15-minute periods on 1 August 2025. The same periods
appear in all four files.

What happened: normal operation, then a 100 kW setpoint from 12:15 (binding at
first, then not, as cloud cover reduces output below the limit), then one of
three inverters trips at 12:45, then a full outage at 13:00, then a meter
failure at 13:15.

**`generation.csv`**

```csv
period_start;period_end;generation kW;valid
2025-08-01 12:00:00;2025-08-01 12:15:00;142.80;1
2025-08-01 12:15:00;2025-08-01 12:30:00;99.60;1
2025-08-01 12:30:00;2025-08-01 12:45:00;61.20;1
2025-08-01 12:45:00;2025-08-01 13:00:00;94.50;1
2025-08-01 13:00:00;2025-08-01 13:15:00;0.00;1
2025-08-01 13:15:00;2025-08-01 13:30:00;0.00;0
```

**`availability.csv`**

```csv
period_start;period_end;availability kW
2025-08-01 12:00:00;2025-08-01 12:15:00;150.00
2025-08-01 12:15:00;2025-08-01 12:30:00;150.00
2025-08-01 12:30:00;2025-08-01 12:45:00;150.00
2025-08-01 12:45:00;2025-08-01 13:00:00;100.00
2025-08-01 13:00:00;2025-08-01 13:15:00;0.00
2025-08-01 13:15:00;2025-08-01 13:30:00;150.00
```

**`curtailment.csv`**

```csv
period_start;period_end;setpoint kW
2025-08-01 12:00:00;2025-08-01 12:15:00;150.00
2025-08-01 12:15:00;2025-08-01 12:30:00;100.00
2025-08-01 12:30:00;2025-08-01 12:45:00;100.00
2025-08-01 12:45:00;2025-08-01 13:00:00;150.00
2025-08-01 13:00:00;2025-08-01 13:15:00;150.00
2025-08-01 13:15:00;2025-08-01 13:30:00;150.00
```

**`potential.csv`**

```csv
period_start;period_end;potential kW
2025-08-01 12:00:00;2025-08-01 12:15:00;142.80
2025-08-01 12:15:00;2025-08-01 12:30:00;143.10
2025-08-01 12:30:00;2025-08-01 12:45:00;61.20
2025-08-01 12:45:00;2025-08-01 13:00:00;141.75
2025-08-01 13:00:00;2025-08-01 13:15:00;138.90
2025-08-01 13:15:00;2025-08-01 13:30:00;139.50
```

How each period is treated:

| Period | Treatment |
|---|---|
| 12:00 | Used as measured |
| 12:15 | Limit binding — trained on the potential value |
| 12:30 | Limit in force but not binding — measured value kept |
| 12:45 | Partial outage — rescaled to full capacity, or potential used |
| 13:00 | Full outage — potential used; discarded if potential were absent |
| 13:15 | `valid=0` — the measurement is dropped, and the potential value is used in its place |

Note that the 13:15 meter failure is invisible in the other three files: the
plant was available and unrestricted, so only the `valid` flag tells us the
measurement cannot be trusted. Because `potential.csv` covers that period, the
period is still usable — `valid=0` discards the measurement, not the period.
Had potential been absent, the period would have been lost.

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/telemetry/upload-strict/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'plant_id=MY_PLANT_IDENTIFIER' \
  --form 'file=@./generation.csv;type=text/csv'
```

## Responses

| Status | Meaning | Body |
|---|---|---|
| **201** | File accepted for ingestion | `{ "message": "…" }` |
| **400** | Request or file rejected | Error description |
| **401** | Invalid or missing API key | — |
| **502** | Storage upload failure (permissions, network) | — |

A **201** means the file was accepted, not that every row passed validation.
Row-level problems are surfaced separately.

Common causes of **400**:

- missing `plant_id` or `file`
- file extension is not `.csv`
- unknown `plant_id` for this API key
- file name is not one of the four accepted names
- header row missing, misspelled, or with the wrong number of columns
- wrong separator, or a comma used as the decimal separator
- unparseable timestamp, or `period_end` not after `period_start`
- non-numeric value in a power column, or a `valid` value other than `0` or `1`
