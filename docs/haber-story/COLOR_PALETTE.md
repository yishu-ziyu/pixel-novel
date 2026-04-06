# Fritz Haber Visual Novel - Color Palette

## Brand Identity

A cold, scientific palette rooted in Prussian Blue — the color of nitrogen fixation,
of industrial chemistry, and of tragedy. Bitter Almond hints at the cyanide that would
follow Haber's work. Dark blood reds mark the human cost.

---

## Palette

### Primary: Prussian Blue
The dominant color of the entire visual identity — representing chemistry,
cold precision, and German institutional atmosphere.

| Hex       | Usage |
|-----------|-------|
| `#193b6a` | Main prussian blue — walls, uniforms, equipment |
| `#1a3a5c` | Secondary blue — shadows, depth |
| `#0d2137` | Darkest blue — near-black backgrounds, deep shadows |

### Secondary: Bitter Almond
Used sparingly to hint at the poison gas / cyanide thread that runs through the story.

| Hex       | Usage |
|-----------|-------|
| `#8B4513` | Warm brown — leather, wood, organic elements |
| `#6B3E26` | Darker brown — shadows on wooden surfaces |

### Accent: Dark Red / Blood
Marks violence, death, and sacrifice throughout the narrative.

| Hex       | Usage |
|-----------|-------|
| `#8B0000` | Blood red — pools, accents, danger |
| `#660000` | Dark blood — deep stains, heavy atmosphere |

### Background: Near Black
Base background color for all scenes — oppressive, nightmarish.

| Hex       | Usage |
|-----------|-------|
| `#0a0a0f` | Near black — main background |
| `#111111` | Slightly lighter — floor/ground differentiation |

### Highlight: Pale Blue
Moonlight, cold light sources, and the thin line between science and humanity.

| Hex       | Usage |
|-----------|-------|
| `#a8c0d8` | Pale blue — moonlight, scientific glass |
| `#c0d8e8` | Lighter pale — highlights, glows |

---

## Scene Color Keys

| Scene | Key Colors | Mood |
|-------|-----------|------|
| **auschwitz_cell** | `#0d2137` `#1a3a5c` + blood stains | Oppressive, cold, institutional |
| **chemistry_lab** | `#193b6a` + warm `#ffcc66` lamp | Scientific, warm-cold contrast |
| **ypres_battlefield** | `#3a6a2a` `#4a7a3a` chlorine gas | Toxic, deathly, eerie |
| **berlin_garden_night** | `#c0d8e8` moonlight + `#8B0000` blood | Tragic, quiet, night |
| **nuremberg_cell** | `#1a3a5c` bars + `#8B0000` nail polish | Claustrophobic, human vanity |
| **berlin_concert_hall** | `#193b6a` architecture + `#c0d8e8` pale faces | Tense, farewell, collective |
| **escape_road** | `#0a0a0f` `#111111` road + `#193b6a` sky | Isolated, end of journey |

---

## Typography

- Scene labels: uppercase, monospace
- All UI text: pale blue `#a8c0d8` on near-black

---

## CSS Variables Reference

```css
:root {
  /* Primary */
  --prussian-1: #193b6a;
  --prussian-2: #1a3a5c;
  --prussian-3: #0d2137;

  /* Secondary */
  --almond-1: #8B4513;
  --almond-2: #6B3E26;

  /* Accent */
  --blood-1: #8B0000;
  --blood-2: #660000;

  /* Background */
  --bg-1: #0a0a0f;
  --bg-2: #111111;

  /* Highlight */
  --highlight-1: #a8c0d8;
  --highlight-2: #c0d8e8;
}
```
