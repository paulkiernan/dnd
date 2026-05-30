---
obsidianUIMode: preview
cssclasses:
- json5e-monster
tags:
- dm/compendium/src/5e/mm
- dm/monster/cr/1-4
- dm/monster/environment/forest
- dm/monster/environment/grassland
- dm/monster/environment/hill
- dm/monster/size/medium
- dm/monster/type/beast
statblock: inline
statblock-link: "#^statblock"
aliases:
- "Wolf"
---
# [Wolf](compendium/bestiary/beast/wolf.md)
*Source: Monster Manual p. 341, Phandelver and Below: The Shattered Obelisk, Quests from the Infinite Staircase. Available in the <span title='Systems Reference Document (5.1)'>SRD</span> and the Basic Rules (2014)*  

```statblock
"name": "Wolf"
"size": "Medium"
"type": "beast"
"alignment": "Unaligned"
"ac": !!int "13"
"ac_class": "natural armor"
"hp": !!int "11"
"hit_dice": "2d8 + 2"
"modifier": !!int "2"
"stats":
  - !!int "12"
  - !!int "15"
  - !!int "12"
  - !!int "3"
  - !!int "12"
  - !!int "6"
"speed": "40 ft."
"skillsaves":
  - "name": "[Perception](rules/skills.md#Perception)"
    "desc": "+3"
  - "name": "[Stealth](rules/skills.md#Stealth)"
    "desc": "+4"
"senses": "passive Perception 13"
"languages": ""
"cr": "1/4"
"traits":
  - "desc": "The wolf has advantage on Wisdom ([Perception](rules/skills.md#Perception))\
      \ checks that rely on hearing or smell."
    "name": "Keen Hearing and Smell"
  - "desc": "The wolf has advantage on an attack roll against a creature if at least\
      \ one of the wolf's allies is within 5 feet of the creature and the ally isn't\
      \ [incapacitated](rules/conditions.md#Incapacitated)."
    "name": "Pack Tactics"
"actions":
  - "desc": "*Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4\
      \ + 2) piercing damage. If the target is a creature, it must succeed on a DC\
      \ 11 Strength saving throw or be knocked [prone](rules/conditions.md#Prone)."
    "name": "Bite"
"source":
  - "MM"
  - "PaBTSO"
  - "QftIS"
"image": "compendium/bestiary/beast/token/wolf.webp"
```
^statblock

## Environment

grassland, forest, hill