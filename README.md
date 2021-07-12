# geekbot-summary

Summary tool for [Geekbot](https://geekbot.com/) updates.
Handy for compiling an end-of-week summary of what you've done, for example, or reviewing things you said you'd do but didn't get around to, based on the contents of your updates.

Basic usage example:

```sh
# Get last 7 days of responses for question that matches 'what did you do'
geekbot-summary distribution-updates robert 'what did you do' --from 7
```

Example output:

```text
DISTRIBUTION-UPDATES > ROBERT > 'WHAT DID YOU DO SINCE {LAST_REPORT_DATE}?'
from 7/5/2021 until now
===========================================================================
7/5/2021, 10:18:00 AM
    - i did a thing
    - and another thing!
    - wow so many things
7/6/2021, 10:05:31 AM
    - such a do-er of things
    - browsed reddit or somethin
7/7/2021, 10:09:12 AM
    - accomplished big accomplishments
    - yay!
```

For more options:

```sh
geekbot-summary --help
```

## Installation

Install using [Deno](https://deno.land/):

```sh
deno install -f --allow-env --allow-net https://raw.githubusercontent.com/bobheadxi/geekbot-summary/master/geekbot-summary.ts
```
