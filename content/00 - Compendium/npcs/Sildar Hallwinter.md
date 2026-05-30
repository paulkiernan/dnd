---
obsidianUIMode: preview
cssclasses:
- json5e-monster
tags:
- dm/compendium/src/5e/pabtso
- dm/monster/cr/1
- dm/monster/size/medium
- dm/monster/type/humanoid/human
statblock: inline
statblock-link: "#^statblock"
aliases:
- "Sildar Hallwinter"
---
# [Sildar Hallwinter](Sildar%20Hallwinter.md)
*Source: Phandelver and Below: The Shattered Obelisk p. 22*  

Sildar is a kindhearted human man of nearly fifty years who holds a place of honor in the famous [[The Griffon Cavalry of Waterdeep]]. He is an agent of the Lords' Alliance, a group of allied political powers along the Sword Coast concerned with mutual security and prosperity. The order ensures the safety of the cities and other settlements of Faerûn by proactively handling violent threats, and order members work to bring honor and glory to their leaders and their homeland.

```statblock
"name": "Sildar Hallwinter (PaBTSO)"
"size": "Medium"
"type": "humanoid"
"subtype": "human"
"alignment": "Neutral Good"
"ac": !!int "16"
"ac_class": "[chain mail](compendium/items/chain-mail.md)"
"hp": !!int "27"
"hit_dice": "5d8 + 5"
"modifier": !!int "0"
"stats":
  - !!int "13"
  - !!int "10"
  - !!int "12"
  - !!int "10"
  - !!int "11"
  - !!int "10"
"speed": "30 ft."
"saves":
  - "strength": !!int "3"
  - "constitution": !!int "3"
"skillsaves":
  - "name": "[Perception](rules/skills.md#Perception)"
    "desc": "+2"
"gear":
  - "[heavy crossbow](compendium/items/heavy-crossbow.md)"
  - "[longsword](compendium/items/longsword.md)"
"senses": "passive Perception 12"
"languages": "Common"
"cr": "1"
"actions":
  - "desc": "Sildar makes two Longsword attacks."
    "name": "Multiattack"
  - "desc": "*Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 5 (1d8\
      \ + 1) slashing damage, or 6 (1d10 + 1) slashing damage if used with two hands."
    "name": "Longsword"
  - "desc": "*Ranged Weapon Attack:* +2 to hit, range 100/400 ft., one target. *Hit:*\
      \ 5 (1d10) piercing damage."
    "name": "Heavy Crossbow"
"reactions":
  - "desc": "When an attacker Sildar can see would hit him with a melee attack, he\
      \ can roll a d6 and add the number rolled to his AC against the triggering attack,\
      \ provided he's wielding a melee weapon."
    "name": "Parry"
"source":
  - "PaBTSO"
"image": "compendium/bestiary/npc/token/sildar-hallwinter-pabtso.webp"
```
^statblock