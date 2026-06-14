# Content System (memory)

> Our folder system + operating principles for content creation.
> Distilled from the "Inside YouTube" interview with Nastia (ex-YouTube partner
> manager, content strategist): https://youtu.be/VpKYkZr-1oQ
>
> **Use this folder system for every new piece of content.** When asked to
> create content, start from `templates/piece/` and follow the lifecycle below.

## The 11 principles

1. **Patience over panic.** Don't judge a piece on 24h/48h numbers — YouTube
   itself says real-time data is an *estimate*. Let it sit ~2 days before
   analyzing. Exception: news / time-sensitive content.
2. **Read the right metrics.** Retention, CTR, average view duration (AVD),
   impressions — and above all the **new vs returning vs casual** breakdown.
3. **Velocity, like-for-like.** Compare a piece only to a *similar piece in the
   same pillar*, with the time window set to each one's **first week of life**.
   Never compare to another channel's lifetime totals or different cadence.
4. **Impressions are a confidence wave.** YouTube widens distribution as long as
   each new wave of viewers keeps reacting. Low impressions usually means
   traction *stalled beyond your core audience* — not that the video is "bad"
   for the people who love it. High CTR + good AVD + low impressions = strong
   for the core, no signal yet to push to strangers.
5. **Content pillars.** Group everything into themed pillars. "What works, do
   more." Find the core principle doing the most work and double down; cut or
   stop reinvesting energy in what doesn't.
6. **Waterfalling.** Turn one long-form piece into many assets (community post,
   IG carousel, X thread, LinkedIn). The **YouTube community post is the most
   underused surface** — homepage-distributed, can be ~10% of channel
   impressions on its own.
7. **Community posts give standalone value.** Photo + hook text, or a carousel
   of the value the thumbnail couldn't hold. **Never** just "here's my video,
   go watch" — that's the worst way to promote anything.
8. **Every subscriber counts.** Don't sort subs into "good/bad." An inactive
   subscriber costs nothing and harms nothing. Never close the door.
9. **Spend energy on the next piece.** Prefer investing in the next episode over
   obsessively re-swapping thumbnails. Exception: rare, very high-budget pieces
   where every impression is worth the manual babysitting.
10. **Be data-driven; find patterns on YOUR channel.** There is no universal
    blueprint. Synthesize what already happened on your own channel.
11. **2026 context.** AI slop is being blocked — favor human, quality content.
    The "Ask YouTube" AI search feature (summer 2026) may disrupt
    search-reliant content; diversify into search / show / geo strategies.

## The folder system

```
content/
  CONTENT_SYSTEM.md        <- this memory file (the principles + how to work)
  pillars/                 <- one folder per content pillar (the registry)
    README.md
  pieces/                  <- one folder per piece of content
    YYYY-MM-DD-<slug>/     <- copied from templates/piece/
  templates/
    piece/                 <- copy this for every new piece
      00-idea.md
      01-script.md
      02-packaging.md
      03-publish-checklist.md
      04-analysis.md        (fill in ~2 days AFTER publish)
      waterfall/
        community-post.md
        instagram-carousel.md
        x-thread.md
        linkedin.md
```

## Lifecycle of a piece

1. **Idea** — pick a pillar, write the idea (`00-idea.md`).
2. **Script** — write/outline (`01-script.md`).
3. **Packaging** — title + thumbnail concepts (`02-packaging.md`). This is the
   real estate viewers see; the thumbnail can't hold everything — that surplus
   value becomes waterfall material.
4. **Publish** — run `03-publish-checklist.md`.
5. **Wait ~2 days.** Do not react to real-time numbers.
6. **Analyze** — fill `04-analysis.md`: pull the new/returning breakdown and run
   the first-week, same-pillar velocity comparison.
7. **Waterfall** — turn the surplus value into the assets in `waterfall/`,
   leading with the community post.
8. **Move on** — apply the learning to the next piece. Don't obsessively rescue
   the past.

## How to start a new piece

```sh
cp -r content/templates/piece "content/pieces/$(date +%F)-<slug>"
```
Then work top-to-bottom through the numbered files.
