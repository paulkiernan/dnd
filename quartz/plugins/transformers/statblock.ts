import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "mdast"
import * as yaml from "js-yaml"

interface StatblockData {
  name: string
  size?: string
  type?: string
  alignment?: string
  ac?: string | number
  ac_class?: string
  hp?: string | number
  hit_dice?: string
  speed?: string
  stats?: number[]
  saves?: { [key: string]: string }
  skills?: { [key: string]: string }
  damage_resistances?: string
  damage_immunities?: string
  condition_immunities?: string
  senses?: string
  languages?: string
  cr?: string
  traits?: Array<{ name: string; desc: string }>
  actions?: Array<{ name: string; desc: string }>
  legendary_actions?: Array<{ name: string; desc: string }>
  reactions?: Array<{ name: string; desc: string }>
  spellcasting?: Array<{ name: string; desc: string }>
}

const ABILITY_NAMES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]

function calculateModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

function renderStatblockMarkdown(data: StatblockData): string {
  const ac = data.ac_class ? `${data.ac} (${data.ac_class})` : data.ac

  let output = `
<div class="statblock-container">
  <div class="statblock">
    <div class="statblock-header">
      <h2 class="statblock-name">${data.name}</h2>
      <div class="statblock-type">${data.size || ""} ${data.type || ""}${data.alignment ? `, ${data.alignment}` : ""}</div>
    </div>
    <div class="statblock-separator"></div>
    <p><strong>Armor Class</strong> ${ac || ""}</p>
    <p><strong>Hit Points</strong> ${data.hp || ""}</p>
    <p><strong>Speed</strong> ${data.speed || ""}</p>
    <div class="statblock-separator"></div>
`

  // Ability scores table
  if (data.stats && data.stats.length === 6) {
    output += `    <table>
      <thead>
        <tr>
`
    ABILITY_NAMES.forEach(name => {
      output += `          <th>${name}</th>\n`
    })
    output += `        </tr>
      </thead>
      <tbody>
        <tr>
`
    data.stats.forEach(score => {
      output += `          <td>${score} (${calculateModifier(score)})</td>\n`
    })
    output += `        </tr>
      </tbody>
    </table>
    <div class="statblock-separator"></div>
`
  }

  if (data.saves) {
    output += `    <p><strong>Saving Throws</strong> ${Object.entries(data.saves).map(([k, v]) => `${k} ${v}`).join(", ")}</p>\n`
  }
  if (data.skills) {
    output += `    <p><strong>Skills</strong> ${Object.entries(data.skills).map(([k, v]) => `${k} ${v}`).join(", ")}</p>\n`
  }
  if (data.damage_resistances) output += `    <p><strong>Damage Resistances</strong> ${data.damage_resistances}</p>\n`
  if (data.damage_immunities) output += `    <p><strong>Damage Immunities</strong> ${data.damage_immunities}</p>\n`
  if (data.condition_immunities) output += `    <p><strong>Condition Immunities</strong> ${data.condition_immunities}</p>\n`
  if (data.senses) output += `    <p><strong>Senses</strong> ${data.senses}</p>\n`
  if (data.languages) output += `    <p><strong>Languages</strong> ${data.languages}</p>\n`
  if (data.cr) output += `    <p><strong>Challenge</strong> ${data.cr}</p>\n`

  if (data.traits && data.traits.length > 0) {
    output += `    <div class="statblock-separator"></div>\n`
    data.traits.forEach(trait => {
      output += `    <p><strong><em>${trait.name}.</em></strong> ${trait.desc}</p>\n`
    })
  }

  if (data.spellcasting && data.spellcasting.length > 0) {
    data.spellcasting.forEach(spell => {
      output += `    <p><strong><em>${spell.name}.</em></strong> ${spell.desc}</p>\n`
    })
  }

  if (data.actions && data.actions.length > 0) {
    output += `    <div class="statblock-separator"></div>\n`
    output += `    <h3>Actions</h3>\n`
    data.actions.forEach(action => {
      output += `    <p><strong><em>${action.name}.</em></strong> ${action.desc}</p>\n`
    })
  }

  if (data.reactions && data.reactions.length > 0) {
    output += `    <div class="statblock-separator"></div>\n`
    output += `    <h3>Reactions</h3>\n`
    data.reactions.forEach(reaction => {
      output += `    <p><strong><em>${reaction.name}.</em></strong> ${reaction.desc}</p>\n`
    })
  }

  if (data.legendary_actions && data.legendary_actions.length > 0) {
    output += `    <div class="statblock-separator"></div>\n`
    output += `    <h3>Legendary Actions</h3>\n`
    data.legendary_actions.forEach(action => {
      output += `    <p><strong><em>${action.name}.</em></strong> ${action.desc}</p>\n`
    })
  }

  output += `  </div>
</div>`

  return output
}

function remarkStatblock() {
  return (tree: Root) => {
    visit(tree, "code", (node: any, index, parent) => {
      if (node.lang === "statblock") {
        try {
          // Parse YAML
          const data = yaml.load(node.value) as StatblockData

          // Render the statblock as markdown
          const markdown = renderStatblockMarkdown(data)

          // Replace the code node with HTML node
          const newNode = {
            type: "html",
            value: markdown,
          }

          if (parent && typeof index === "number") {
            parent.children[index] = newNode
          }
        } catch (error) {
          console.error("Error parsing statblock YAML:", error)
        }
      }
    })
  }
}

export const Statblock: QuartzTransformerPlugin = () => {
  return {
    name: "Statblock",
    markdownPlugins() {
      return [remarkStatblock]
    },
    externalResources() {
      return {
        css: [
          {
            content: `
.statblock-container {
  margin: 1.5rem 0;
}

.statblock {
  background: var(--light);
  border: 2px solid var(--darkgray);
  border-radius: 8px;
  padding: 1.5rem;
  font-family: var(--bodyFont);
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.statblock-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.statblock-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--darkgray);
  margin: 0 0 0.25rem 0;
  padding: 0;
  line-height: 1.2;
}

.statblock-type {
  font-style: italic;
  color: var(--gray);
  font-size: 0.9rem;
}

.statblock-separator {
  height: 2px;
  background: linear-gradient(to right, transparent, var(--secondary), transparent);
  margin: 0.75rem 0;
}

.statblock p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.statblock table {
  width: 100%;
  text-align: center;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}

.statblock table td {
  padding: 0.25rem;
  font-weight: 700;
}

.statblock h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--darkgray);
  margin: 0.5rem 0;
  border-bottom: 1px solid var(--secondary);
}

/* Dark mode adjustments */
:root[saved-theme="dark"] .statblock {
  background: var(--darkgray);
  border-color: var(--lightgray);
}

:root[saved-theme="dark"] .statblock-name,
:root[saved-theme="dark"] .statblock h3 {
  color: var(--light);
}

:root[saved-theme="dark"] .statblock-type {
  color: var(--lightgray);
}
            `,
          },
        ],
      }
    },
  }
}
