# Pieces

One folder per piece of content, named `YYYY-MM-DD-<slug>` (publish date).

Create a new one by copying the template:

```sh
cp -r content/templates/piece "content/pieces/$(date +%F)-<slug>"
```

Then work top-to-bottom through the numbered files. Fill `04-analysis.md` only
**~2 days after publishing** (principle 1: real-time data is an estimate).
