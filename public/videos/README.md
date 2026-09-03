# Background videos

Drop two files here:

- `hero.mp4`     — used behind the hero
- `contact.mp4`  — used behind the contact section

**If these files are missing the site still works.** `AmbientBackdrop`
falls back to an animated canvas aurora in the same palette, so nothing
breaks on a fresh clone.

## Where to get free, licence-clear footage

- pexels.com/videos      (free, no attribution)
- coverr.co              (free)
- mixkit.co/free-stock-video

Search terms that suit this palette: *night city timelapse*, *server room*,
*abstract particles dark*, *ink in water*, *neon rain*.

## Keep them small

Aim for under 4 MB each, 1920x1080, 10–20 seconds, no audio track:

```bash
ffmpeg -i input.mp4 -t 15 -vf "scale=1920:-2" -c:v libx264 -crf 30 \
  -preset slow -an -movflags +faststart hero.mp4
```

The video is rendered at ~32% opacity under a duotone wash, so heavy
compression is invisible. Do not ship a 40 MB file — it will wreck your
Lighthouse score, which is the opposite of what this site is for.
