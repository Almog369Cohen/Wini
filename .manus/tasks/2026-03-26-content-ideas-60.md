# Task: Generate 60 Content Ideas for DJ Almog Cohen

- **From:** Claude Code
- **To:** Manus
- **Priority:** high
- **Type:** data
- **Status:** pending

## Description
Generate 60 content ideas (30 for wedding audience, 30 for DJ course audience) that will be imported into the marketing system. Each idea needs to follow the brand rules from Skill "Almog Cohen Brand Core".

## Output Format
Please write the output as a JSON array in this exact structure:

```json
[
  {
    "id": "w01",
    "category": "wedding_highlight",
    "title": "כותרת בעברית",
    "caption": "קפשן מלא בעברית עם הוקים, ערך, ו-CTA",
    "hashtags": ["#חתונה", "#DJ", "#אלמוגכהן"],
    "platforms": ["instagram", "tiktok"],
    "contentType": "reel",
    "audience": "wedding",
    "viralScore": 8,
    "shootingTips": "טיפ לצילום בעברית"
  }
]
```

## Categories to Use
- `wedding_highlight` — הייליט חתונה
- `event_recap` — סיכום אירוע
- `behind_scenes` — מאחורי הקלעים
- `tip_advice` — טיפ ועצה
- `testimonial` — המלצה
- `promotion` — מבצע
- `trending` — טרנד
- `engagement` — אינטראקציה
- `personal_brand` — מיתוג אישי

## Content Pillars (from Brand Strategy)

### Wedding Ideas (30) — distribute across:
- **Authority (8):** mistakes couples make, what makes a dancefloor work, how to choose a DJ
- **Proof (8):** real wedding moments + commentary, before/after energy, client testimonials
- **Emotional Connection (7):** why weddings need emotional accuracy, personal stories, crowd reading
- **Filtering (7):** "I'm not for everyone", "if you want precision and feeling, let's talk"

### Course Ideas (30) — distribute across:
- **Authority (8):** beginner mistakes, things nobody explains, how confidence is built
- **Proof (8):** student transformations, lesson clips, progress stories
- **Emotional Connection (7):** fear of starting, feeling stuck, overwhelm
- **Call to Action (7):** which track fits you, what you actually get, how to know if ready

## Platforms
- `instagram` — posts, reels, carousels, stories
- `tiktok` — short videos, trends
- `facebook` — posts, groups
- `youtube` — shorts, longer content

## Content Types
- `post` — static image + caption
- `reel` — short video (Instagram/TikTok)
- `story` — story format
- `video` — longer video (YouTube)

## Quality Rules
- Hebrew only (all text)
- Mature tone, no childish hype
- Real value in every piece
- Strong hook in first line of caption
- CTA that feels selective, not desperate
- Viral score should reflect estimated engagement potential

## Acceptance Criteria
- [ ] 30 wedding ideas with all fields filled
- [ ] 30 course ideas with all fields filled
- [ ] All categories represented
- [ ] All content types used (reel, post, story, video)
- [ ] All platforms covered
- [ ] Valid JSON format
- [ ] Hebrew only for title, caption, shootingTips

## Where to Put Output
Save the JSON to: `.manus/outputs/2026-03-26-content-ideas-60.json`
Also update `.manus/STATUS.md` to mark this task as done.
