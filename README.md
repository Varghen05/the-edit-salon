# THE EDIT · Unisex Salon website

Animated one-page site for THE EDIT, Pookattupady, Kochi, with a cinematic editorial entrance. Next.js 16, GSAP ScrollTrigger, Lenis smooth scrolling, Tailwind CSS 4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where to edit content

Everything the salon needs to confirm is in **`src/lib/site.ts`**: contact details, hours, prices, services, team, gallery, FAQs. Lines marked `TODO` are placeholders.

## Launch checklist

- [x] **Logo:** original master vector is `public/logo.svg` (drawn live in the hero from its own layers). Never redraw it.
- [ ] **Owners' story:** have Rekha and Saranya review the chapter wording in `ownerChapters`.
- [ ] **Photos:** `public/images/editorial/` holds graded free-licence photos (see Credits). Swap in real salon photography when ready, keeping the filenames or updating `site.ts`.
- [ ] **Prices:** replace the indicative menu in `priceMenu`, then remove the "Indicative prices" note in `src/components/sections/PriceStack.tsx`.
- [ ] **Contact:** set `phone`, `whatsapp` (digits with country code, e.g. `9198xxxxxxxx`), `email`, `instagram`.
- [ ] **Hours:** confirm `hours` and `timeSlots`.
- [x] **Map:** address confirmed by the owners (`mapsQuery`). Update `geo` from the Google Business Profile pin once it is live.
- [ ] **Grand opening:** confirm the time (invitations show both 10:00 AM and 12:00 PM) in `grandOpening`.
- [ ] **Domain:** set `domain` to the purchased domain.
- [ ] **Google reviews:** once the Google Business Profile is verified, set these environment variables in the hosting dashboard:
  - `GOOGLE_PLACES_API_KEY`: a Google Cloud key with **Places API (New)** enabled, restricted to that API
  - `GOOGLE_PLACE_ID`: the salon's Place ID

  Also set `googleReviewUrl` to the "Ask for reviews" link from the Business Profile. Reviews are cached for an hour.

## Google Flow footage

`FLOW_PROMPTS.md` has ready-made prompts for Google Flow (Veo 3.1 / Nano Banana) in the house black-and-white + gold style. Drop the exported files into `public/video/` with the listed names (`hero.mp4`, `hero-mobile.mp4`, `ritual-consult.mp4`, `ritual-cleanse.mp4`, `ritual-craft.mp4`, `ritual-finish.mp4`, `chair-waiting.mp4`) and rebuild: the site uses them automatically and falls back to photos when a file is missing.

### Flow clips in use

The 7 Flow clips (stored silently in `public/video/`) power the opening screen, the four Ritual steps, the "Your chair is waiting" banner and the shears card. `public/film/` is a 60-frame sequence taken from the scissors clip for the scroll-driven film. Re-run the export if the clip changes.

## How booking works

The booking form builds a message and opens WhatsApp to the salon's number. Nothing is stored. Until `whatsapp` is set, the form shows the request as a preview instead.

## Hosting

Deploy on Vercel (free tier), then add the domain under Project → Settings → Domains and point the registrar's DNS records to Vercel.

## Brand assets

- `public/logo.svg`: original master logo (supplied by the owners).
- `public/brand/`: variants built from the master's own layers (nothing redrawn): `logo-monogram`, `logo-wordmark`, `logo-horizontal`, `logo-gold`, `logo-ivory`, `logo-black`. Copies are in `../SR_THE_EDIT_Brand_Handover/02_Logo_and_Signage/Logo_Variants/`.

## Credits

Photography in `public/images/editorial/` is from [Unsplash](https://unsplash.com/license) (free for commercial use, no attribution required), graded warm to match the Flow footage (espresso shadows, honey highlights). Swap in the salon's own shoot when ready.

- `beauty-apply.jpg`: https://images.unsplash.com/photo-1699726242741-11e3ccc06610
- `beauty-bride.jpg`: https://images.unsplash.com/photo-1600687436073-86a81c9b0daa
- `beauty-bride-2.jpg`: https://images.unsplash.com/photo-1665960212519-adcbb5e2ca03
- `beauty-brush.jpg`: https://images.unsplash.com/photo-1616529484837-8bcdf9d1407b
- `beauty-gold.jpg`: https://images.unsplash.com/photo-1767381819098-4beaccc15a63
- `beauty-jewel.jpg`: https://images.unsplash.com/photo-1727784891995-e311b1b6ba18
- `beauty-pose.jpg`: https://images.unsplash.com/photo-1777521953720-477e2b7f2203
- `beauty-powder.jpg`: https://images.unsplash.com/photo-1704621354138-e124277356f2
- `groom-barber.jpg`: https://images.unsplash.com/photo-1672761431773-a4d77e8ca1d7
- `groom-beard.jpg`: https://images.unsplash.com/photo-1672761431763-02233500ea2f
- `groom-beard-2.jpg`: https://images.unsplash.com/photo-1672761431799-5e91a0ae2f60
- `groom-suit.jpg`: https://images.unsplash.com/photo-1769628027250-d2a7a5a4eb64
- `hair-curls.jpg`: https://images.unsplash.com/photo-1535579710123-3c0f261c474e
- `hair-flow.jpg`: https://images.unsplash.com/photo-1633382148761-d56d55cee3cd
- `hair-texture.jpg`: https://images.unsplash.com/photo-1571375814199-4072612351aa
- `hero-hair.jpg`: https://images.unsplash.com/photo-1633381521050-26bb467d9d5a
- `nails-dark.jpg`: https://images.unsplash.com/photo-1777287216958-84144739db83
- `nails-hand.jpg`: https://images.unsplash.com/photo-1727468939344-44929b044076
- `skin-cream.jpg`: https://images.unsplash.com/photo-1693004925174-d9e06209d0ee
- `skin-glow.jpg`: https://images.unsplash.com/photo-1699726242756-54a80b68405a
- `skin-patch.jpg`: https://images.unsplash.com/photo-1660911582546-2897e25c3b26

- `chair-waiting.jpg`: https://images.unsplash.com/photo-1616105996583-f9e3c00bb31f
- `chair-waiting-2.jpg`: https://images.unsplash.com/photo-1637777269308-6a072f24e8a4
- `ritual-barber.jpg`: https://images.unsplash.com/photo-1585581905588-9e91f63bdd47
- `ritual-cut.jpg`: https://images.unsplash.com/photo-1624981015149-e01395f1d774
- `ritual-mirrors.jpg`: https://images.unsplash.com/photo-1788985375145-81da8cc731a2
- `ritual-mirrors-2.jpg`: https://images.unsplash.com/photo-1788985375162-6e6e704d629e
- `ritual-wash.jpg`: https://images.unsplash.com/photo-1793998370304-3308275bc99c
- `shears-beam.jpg`: https://images.unsplash.com/photo-1621446113284-53ca198c7fa7
- `shears-dark.jpg`: https://images.unsplash.com/photo-1668853060853-4d775f9494b8

Owners' portrait: supplied by the salon; background removed with Apple Vision. Original photo kept in `../SR_THE_EDIT_Brand_Handover/owners-original.jpg`.
