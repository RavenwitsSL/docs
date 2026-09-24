---
sidebar_position: 3
title: Telemetry concepts
---
# Telemetry for forecasting: concepts and data quality

**Applies to:** all clients sending operational data to Ravenwits, regardless of
the format or endpoint used. If you use our recommended CSV format, see also
the [Telemetry upload strict](https://docs.ravenwits.com/api-reference/telemetry-upload-strict)
API reference. If you send data through a custom integration, the concepts here
still apply — only the encoding differs.

---

## 1. Why this matters

Our forecasting models learn the relationship between **weather conditions** and
**how much a plant can produce**. To learn that relationship correctly, the
model needs to see production values that were actually driven by the weather.

Every period in which the plant produced less than it could have — because of a
grid limitation, an equipment failure, or a commercial decision — is a period
where production and weather have come apart. If we cannot identify those
periods, the model interprets them as "these weather conditions yield low
output" and learns a distorted relationship.

The practical consequence is a **systematic downward bias**, concentrated
exactly where it hurts most: sunny or windy periods at high output, which are
also the periods with the largest imbalance exposure. Four quantities let us
avoid this.

---

## 2. The four quantities

All four are defined **for the same timestamp or measurement period**, expressed
as **average active power in kW** over that period.

### 2.1 Generation (required)

The active power actually delivered by the plant, as measured.

This is the base signal. Every client provides it.

### 2.2 Availability (optional, strongly recommended)

The active power the plant **was physically capable of delivering** during the
period, given the state of its equipment.

- Full operation → availability equals the plant's nominal capacity.
- One string, inverter or turbine out of service → availability is reduced
  proportionally.
- Full outage → availability is 0.

Availability describes **the plant's own condition**, not any external
instruction.

### 2.3 Curtailment (optional, strongly recommended)

The **active power limit imposed on the plant from outside**: a setpoint from
the TSO or DSO, a connection-point cap, or any other externally imposed ceiling
on output.

- No limitation in force → the limit equals the plant's nominal capacity (or the
  field may be omitted, see §5).
- A setpoint of 100 kW on a 150 kW plant → the value is 100.

Curtailment describes **what the plant was allowed to do**, not what it could do.

> **Note on convention.** We express this quantity as the *ceiling in force*, not
> as the *energy lost*. A value of 100 kW means "the plant was not allowed to
> exceed 100 kW", not "100 kW were curtailed away". If your internal systems use
> the opposite convention, tell us during onboarding — both are workable, but we
> need to know which one your files carry.

### 2.4 Potential (optional, the most valuable addition when it is reliable)

The active power the plant **would have delivered** during the period if it had
been fully available and unrestricted — the unconstrained production, however
your systems estimate it (irradiance or wind-based model, reference cells,
unaffected strings or turbines extrapolated to the full plant, etc.).

Potential is the quantity our models are ultimately trying to predict, so a good
signal gives us the training target directly instead of asking us to reconstruct
it. But unlike the other three quantities, potential is an **estimate rather
than a measurement**, and its quality varies widely between clients and plants.
We therefore validate it before relying on it: we compare it against measured
generation over periods when the plant was fully available and unrestricted, and
use it accordingly — directly, with a correction, or not at all.

Send the signal you have, even if you consider it rough, and we will make the
best use of it.

### 2.5 How they relate

Under normal, consistent data:

```
generation  ≤  min(availability, curtailment limit)
generation  ≤  potential
potential   ≈  generation   when the plant is fully available and unrestricted
```

We use these relationships as automatic consistency checks. Persistent
violations usually point to a units mismatch, a timestamp offset, or a
measurement point that is not the one we assume (see §6).

---

## 3. What we do with each quantity

| Quantity | Use |
|---|---|
| Generation | Training target and, where applicable, real-time model input |
| Availability | Recover periods with partial outages instead of discarding them |
| Curtailment | Distinguish limitations that actually bound production from those that did not |
| Potential | Train directly on unconstrained output; evaluate forecast accuracy fairly |

### 3.1 Availability: rescaling instead of discarding

- **Full outage** (availability = 0): the period carries no information about the
  weather–production relationship and is discarded.
- **Partial outage** (0 < availability < nominal): generation is **scaled
  proportionally** to the available capacity to reconstruct the equivalent
  full-plant output, and the period is kept.

Without availability data, every one of these periods is either lost or
poisonous. With it, most are recovered.

### 3.2 Curtailment: was the limit actually binding?

A setpoint in force does not mean production was affected by it. A 100 kW cap on
a plant that was only producing 60 kW because of cloud cover changed nothing.

So we compare generation against the limit for the same period:

- Generation **close to the limit** → the limit was binding, the value does not
  reflect the weather → **discard**.
- Generation **clearly below the limit** → the limit was not binding, the value
  is genuine weather-driven production → **keep**.

Without curtailment data, all we would see is "the plant underproduced", and we
would have to discard every period of every curtailment window — including the
majority in which nothing was actually lost.

### 3.3 Potential: the direct answer

When potential is available and trustworthy, the reconstruction steps above
become unnecessary for the affected periods: we already have the unconstrained
value. This is the only one of the four quantities that lets us retain
**essentially 100% of curtailed and partially unavailable periods** as usable
training data.

The same substitution applies to periods whose generation measurement is
unusable for reasons none of the other quantities capture — an economic
shutdown, a meter failure, a communications gap. Where the measurement is marked
not valid and a trustworthy potential value exists for that period, we train on
the potential instead. Potential is therefore the only quantity that can rescue
a period regardless of **why** the measurement failed.

Potential also improves what we can report back to you: forecast error measured
against constrained generation penalises the model for limitations it was never
asked to predict. Measured against potential, the accuracy figures describe the
model rather than your dispatch.

---

## 4. The validity flag

Whatever the format, each generation record carries — explicitly or by
convention agreed at onboarding — an indication of whether it can be used for
training.

| Value | Meaning |
|---|---|
| **Valid** (`1` / `true`) | **Candidate** record. It enters our validation process and is used if it passes the filters in §3. |
| **Not valid** (`0` / `false`) | **Unusable** record. Discarded automatically and irreversibly, with no further analysis. |

The flag applies **record by record**, not to the whole file or upload.

### 4.1 Mark a record valid when

- **a)** The value reflects the plant's real production, with no limitation,
  outage or other factor altering it; **or**
- **b)** The value is affected by a limitation and/or an outage **and you report
  the corresponding value** for that same period — the limit in the curtailment
  data, the available power in the availability data, or the unconstrained
  output in the potential data.

The key to (b) is that the cause is **quantified**. If we know how much the
plant was held back, we can correct or discard the record on an informed basis.

### 4.2 Mark a record not valid when

- **c)** The value is affected by a limitation or an outage that you **do not
  report**, or that you know occurred but for which you **do not have** the
  limit, the available power or the potential.
- **d)** The value is affected by **any other cause** that prevents it from
  representing normal weather-driven operation: shutdown on low prices or other
  economic criteria, meter failure, loss of communications, frozen or null
  values, commissioning tests, local manual operation.
- **e)** You have any doubt about the origin or quality of the value.

### 4.3 The decision is asymmetric

A **not valid** mark is final **for that measurement**: the measured value never
re-enters the pipeline at any later stage. It does not necessarily mean the
period is lost — if you also send a potential value for that period, and that
signal validates well, we use the potential in place of the measurement. The
flag tells us the meter cannot be trusted; potential tells us what to use
instead.

A **valid** mark is not a commitment — it only means the record is
interpretable, and our filters still decide.

> **Rule of thumb.** Mark a record not valid only when you know it is
> contaminated **and you cannot tell us by how much**. If you can quantify the
> cause, mark it valid and leave the filtering to us.

Over-marking records as not valid impoverishes the training set with no way
back. Over-marking as valid, where the cause is quantified, carries no risk.

---

## 5. What you gain by sending more

Not every client has all four quantities, and we can work with any subset. The
optional three are **independent of one another**: you do not need availability
in order to benefit from potential, nor curtailment in order to benefit from
availability. What follows are the combinations we see most often — examples,
not a ladder to climb.

### Generation only

**Works.** Model quality then rests entirely on how well the validity flag is
set.

Every curtailed or partially unavailable period has to be marked not valid,
since we have no way to correct it and nothing to substitute for it. In a plant
with frequent curtailment this can remove a large share of the highest-output
periods from training — precisely the periods the model most needs to learn. If
those periods are instead left marked valid, the bias described in §1 enters the
model.

### Generation + availability

**Recovers partial outages.** Periods with a degraded but working plant are
rescaled rather than dropped. Full outages are still lost, and curtailment still
has to be handled through the flag. Often the cheapest improvement to make,
since availability is usually already tracked in the O&M system.

### Generation + curtailment

**Recovers non-binding limitation windows.** In most curtailment episodes only a
fraction of the periods are actually constrained; this combination keeps the
rest instead of discarding the whole window. It also lets us report how much
energy was lost to limitations. Outages still have to be handled through the
flag.

### Generation + potential, with neither availability nor curtailment

**Common, and stronger than it looks.** This combination works by a different
mechanism from the two above: rather than reconstructing what the plant would
have produced, we substitute a value you have already estimated.

Its advantage is that it does not require us to know **why** a measurement is
unusable. Curtailment, outage, economic shutdown, meter failure — all of them
are handled the same way, provided the period is marked not valid and the
potential signal validates well (§2.4). In exchange, everything depends on the
quality of that signal, which is why we assess it before relying on it.

If you can only add one quantity beyond generation, this is usually the one with
the largest effect — and worth sending even if you consider the signal rough,
since we measure its quality rather than take it on trust.

### All four

**Best available.** Potential is used where it validates well; reconstruction
from availability and curtailment covers the periods and plants where it does
not, and serves as an independent check on the potential signal itself. This is
also the only combination that lets us separate energy lost to limitations from
energy lost to equipment when reporting back to you.

### Partial and irregular coverage

You do not need full historical coverage to benefit. Curtailment and outage data
are, by nature, sparse: sending records **only for the periods in which
something happened** is the normal case and is enough, provided the convention
is agreed in advance — that is, we know whether an absent record means "no
limitation in force" or "unknown".

---

## 6. Requirements common to every format

These apply whether you use our CSV format or your own.

**Timestamps.** Unambiguous and consistent. UTC is strongly preferred. If you
send local time, state explicitly whether daylight saving is applied — the two
duplicated and missing hours each year are a frequent source of silent
misalignment.

**Periods.** Defined by start and end, or by a fixed resolution agreed in
advance. Keep the resolution stable; a resolution matching your market
settlement period is usually the best choice. Periods must not overlap.

**Units.** Average active power in kW over the period, for all four quantities.
If your systems export energy per period (kWh) or use MW, tell us during
onboarding rather than converting on the fly — mixed conventions inside a single
history are much harder to detect than a consistent one.

**Measurement point.** Tell us whether generation is metered at the inverter, at
the plant's point of connection, or net of auxiliary consumption, and whether
night-time auxiliary consumption appears as negative values. We can work with
any convention; we cannot work with an undeclared one.

**Alignment across quantities.** The four quantities must use the same
timestamps and the same resolution. If your availability data is recorded at
event level ("inverter 3 down from 09:14 to 11:47"), either convert it to the
common resolution or tell us and we will do the conversion.

**History depth.** For an initial model, we typically look for **at least 12
months** of history, so that the full annual cycle is covered. Shorter histories
are workable — from roughly 3 months we can produce a model — but accuracy in
seasons not represented in the data will be noticeably weaker.

**Ongoing delivery.** Continued delivery of telemetry after go-live is what keeps
models retrained against the plant's current condition. Where the model uses
recent measurements as an input, delivery latency also affects short-horizon
accuracy directly.

**Gaps.** A missing record is unambiguous and harmless — we treat it as unknown.
A record present with a placeholder value (`0`, `-1`, `9999`, last known value
repeated) is actively harmful, because it looks like a measurement. Omit the
record instead, or send it marked not valid.

---

## 7. Worked examples

A 150 kW PV plant. `—` means the quantity is not available at this client's
level.

| Situation | Generation | Availability | Curtailment limit | Potential | Valid | Outcome |
|---|---|---|---|---|---|---|
| Clear sky, normal operation | 142.8 | 150 | 150 | 142.8 | ✔ | Used as is |
| Setpoint 100 kW, plant pinned at the limit | 99.6 | 150 | 100 | 143.1 | ✔ | Trained on potential (or discarded if potential is absent) |
| Setpoint 100 kW, cloud cover, output well below | 61.2 | 150 | 100 | 61.2 | ✔ | Kept — the limit was not binding |
| One inverter of three down | 94.5 | 100 | 150 | 141.8 | ✔ | Rescaled to full capacity |
| Full outage | 0.0 | 0 | 150 | 138.9 | ✔ | Trained on potential (or discarded if potential is absent) |
| Curtailment known to have occurred, setpoint unknown | 88.0 | — | — | — | ✘ | Discarded — nothing available to substitute |
| Shutdown on negative prices | 0.0 | 150 | 150 | 137.4 | ✘ | Potential used in place of the measurement |
| Meter failure, output frozen at zero | 0.0 | 150 | 150 | 139.5 | ✘ | Potential used in place of the measurement |

Note the last two rows. The plant was physically available and unrestricted, so
none of the other quantities flags the anomaly — **only the validity flag tells
us the measurement cannot be trusted**. But "cannot be trusted" is not the same
as "lost": because a potential value exists for those periods, we train on it
instead. The flag says not to use the meter; the potential says what to use in
its place. Without a potential signal, the same two rows would simply be
discarded, as in the row above them.

---

## 8. Onboarding checklist for custom formats

If you are sending data through your own format and endpoint, confirm the
following with us at integration time:

- [ ] Which of the four quantities you can provide, and from when
- [ ] Time zone and DST handling
- [ ] Period resolution, and whether timestamps mark the start or the end of the
      period
- [ ] Units, and power-versus-energy convention
- [ ] Curtailment convention: ceiling in force, or energy lost
- [ ] Measurement point, and sign convention for auxiliary consumption
- [ ] How the validity flag is carried — an explicit field, or a rule we apply on
      our side from the other quantities
- [ ] Whether absent curtailment/availability records mean "nothing in force" or
      "unknown"
- [ ] Delivery mechanism, frequency and expected latency
- [ ] Behaviour on resubmission: whether a later delivery corrects an earlier one

---

## 9. Summary

| If you can send… | You get |
|---|---|
| Generation alone, accurately flagged | A working model, at the cost of discarding constrained periods |
| Generation \+ availability | Partial outages recovered instead of lost |
| Generation \+ curtailment | Non-binding limitation periods recovered; loss attribution reporting |
| Generation \+ potential | Constrained and faulty periods retained at their unconstrained value, to the extent the signal validates |
| All four | The above, plus an independent check on the potential signal |

The single most valuable thing you can do is make sure the **validity flag is
honest**: no contaminated period marked valid without the data to correct it,
and no clean period thrown away out of caution.
