# 普鲁士蓝 / Prussian Blue

## Narrative Design Document

### Theme

**Core Question:** "Can something that saves humanity also destroy it?"

Fritz Haber embodies the moral paradox of science: his nitrogen fixation process enabled artificial fertilizer, feeding billions of lives, while his development of chemical weapons in WWI contributed to millions of deaths. This story refuses to offer redemption—only questions.

---

### Narrative Structure: Memory Trigger System

Unlike linear narratives, this visual novel uses **chemical concepts as memory portals**. Each chemical compound acts as an emotional/thematic anchor that transports the player to a different time period. The player navigates through emotional and thematic connections, not chronology.

#### Primary Memory Anchors

| Chemical | Color | Associated Scene | Thematic Function |
|----------|-------|------------------|------------------|
| **Prussian Blue** | Deep blue pigment | Auschwitz cell walls | Guilt, complicity, the indelible mark |
| **Cyanide** | Clear/white | Haber's death, Göring's execution | Escape, judgment, moral reckoning |
| **Chlorine** | Green gas cloud | Ypres 1915 | Destruction, scientific hubris |
| **Nitrogen** | Pale yellow liquid | 1907 lab | Creation, life-giving, the "miracle" |

#### Non-Linear Flow

```
                    ┌─────────────────┐
                    │  OPENING SCENE   │
                    │  (Auschwitz)     │
                    │  Prussian Blue   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ CHLORINE   │  │  NITROGEN  │  │  CYANIDE   │
     │   Ypres    │  │   1907 Lab  │  │   Death    │
     └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
                 ┌─────────────────┐
                 │   THE CHOICE     │
                 │  (Klara's Gift) │
                 └────────┬────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │  NUREMBERG │  │ PHILHARMONIC│ │  EPILOGUE │
    │  (Göring)  │  │  (Concert)  │ │  (Open)   │
    └───────────┘  └───────────┘  └───────────┘
```

---

### Scene Breakdown

#### Scene 1: `auschwitz_opening` (OPENING - Central Anchor)
- **Location:** Auschwitz cell, present day
- **Memory Trigger:** Prussian Blue marks on walls
- **Function:** Sets the emotional tone and introduces the central metaphor
- **Key Dialogue:** "The Prussian Blue on these walls will never fade. Neither will the memory of what happened here."

#### Scene 2: `haber_lab_1907` (1907 - The Creation)
- **Location:** Karlsruhe laboratory
- **Memory Trigger:** Nitrogen, the pale yellow liquid
- **Focus:** Haber's obsession with nitrogen fixation, the "miracle" that would feed billions
- **Key Dialogue:** "I am feeding the world. I am solving the crisis of hunger."

#### Scene 3: `ypres_1915` (1915 - The Destruction)
- **Location:** Ypres battlefield
- **Memory Trigger:** Chlorine gas, the green cloud
- **Focus:** The first chemical weapon attack, Haber overseeing the deployment
- **Key Dialogue:** "Science has no morals. Only utility."

#### Scene 4: `klara_garden` (Berlin - The Reckoning)
- **Location:** Haber's garden at night
- **Memory Trigger:** Klara's suicide (connected to chlorine via her use of cyanide)
- **Meaningful Choice:** Player decides whether Haber's work was worth the cost
- **Key Dialogue:** "You have chosen the world over me."

#### Scene 5: `nuremberg_cell` (Nuremberg - The Judgment)
- **Location:** Nuremberg prison cell
- **Memory Trigger:** Red nail polish (Göring's final choice before cyanide)
- **Focus:** The collaborator's judgment, not Haber's
- **Key Dialogue:** "Even in death, I choose my own color."

#### Scene 6: `haber_death_1934` (1934 - The Escape)
- **Location:** Cambridge, England
- **Memory Trigger:** Nitroglycerin (ironic - his heart medication kills him)
- **Focus:** Haber's flight from Germany, his ironic death
- **Key Dialogue:** "I cannot outrun my own chemistry."

#### Scene 7: `berlin_philharmonic` (Final - The Question)
- **Location:** Berlin Philharmonic, 1934
- **Memory Trigger:** Music, the last concert before Haber's death
- **Function:** Open ending, no resolution
- **Key Dialogue:** "The question remains: Can something that saves also destroy?"

---

### Character Profiles

#### Fritz Haber (旁白/叙事者 voice)
- **Emotions:** Obsessed, proud, haunted, resigned
- **Contradiction:** Brilliant scientist, moral compromiser
- **Arc:** From creation to destruction, from pride to haunting

#### Klara Haber (His Wife)
- **Emotions:** Loving,绝望 (desperate), angry
- **Arc:** Supports his early work, cannot bear his involvement in weapons, chooses death
- **Symbol:** Represents the human cost

#### Hermann Göring (Optional)
- **Emotion:** Defiant, ironic, resigned
- **Function:** Represents those who used Haber's science
- **Key detail:** Red nail polish - a final act of defiance

---

### Meaningful Choice: The Klara Scene

At `klara_garden`, the player must choose:

**Choice A: "The fertilizer saved billions. The cost was worth it."**
- Leads to: `nuremberg_cell` (judgment of collaborators)
- Tone: Bitter, accusatory

**Choice B: "I see only the lives lost. I cannot defend this."**
- Leads to: `berlin_philharmonic` (haunting, open)
- Tone: Sorrowful, unresolved

**Choice C: "Science is neutral. It is only how we use it."**
- Leads to: `haber_death_1934` (escape, irony)
- Tone: Ironic, detached

This choice represents the player's own moral reckoning with Haber's legacy.

---

### Visual Symbolism

| Symbol | Visual Representation | Meaning |
|--------|----------------------|---------|
| Prussian Blue | Deep blue marks on brick walls | Indelible guilt |
| Chlorine Green | Gas cloud creeping across battlefield | Scientific hubris unleashed |
| Nitrogen Yellow | Pale liquid in laboratory glass | The "miracle" of creation |
| Cyanide Clear | Small white capsule | Escape, death, final choice |
| Red Nail Polish | Göring's fingernails | Defiance to the end |

---

### Transition Types Used

- **`fadeToBlack`**: Scene endings, emotional beats
- **`crossDissolve`**: Memory shifts, time transitions
- **`iris`**: Focus on specific detail (e.g., cyanide capsule)
- **`fade`**: Standard scene transitions

---

### Ending Philosophy

The story refuses redemption. Haber is neither hero nor villain—he is a question. The final scene at the Berlin Philharmonic poses the question without answering it:

"Can something that saves humanity also destroy it?"

The player must decide for themselves.

---

### Technical Notes

- **Minimum scenes:** 6-8
- **Dialogue per scene:** 3-8 lines
- **Non-linear branching:** Yes, via memory triggers
- **Meaningful choice:** Yes, in Klara scene
- **Transition variety:** fade, fadeToBlack, crossDissolve, iris
