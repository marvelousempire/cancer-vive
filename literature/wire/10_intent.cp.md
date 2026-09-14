# Intent ticket — Concise Perspective

Slice: 10 exponential backoff
Station: cancer-vive board
Status: Filed 2026-09-14
Next: `10_exponential_backoff.be.md`
Not: Python first

## One intent

When a call is refused by a rate limit, wait longer each try until a cap, unless a Retry-After number is given.

## Two statements separate

The wait is a number. The call is a separate act.
Retry-After, when present, beats the computed wait.
