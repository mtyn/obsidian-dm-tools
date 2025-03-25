import { StatBlock } from "src/model";
import { titleCase } from "./helpers";

export function formatAbilityScores(spec: StatBlock, parent: HTMLElement) {
    const wrapper = parent.createDiv({cls: "dm-tools-statblock-abilityscores"});
    const table = wrapper.createEl("div", {cls: "dm-tools-statblock-abilityscores-table"});

    for (var key in spec.abilityScores) {
        if (spec.abilities.hasOwnProperty(key)) {
            const row = table.createEl("div", {
                cls: "dm-tools-statblock-abilityscores-table-row"
            });
            row.createEl("span", {
                cls: "dm-tools-statblock-abilityscores-table-header-cell",
                text: titleCase(key.slice(0, 3))!
            });
            row.createEl("span", {
                cls: "dm-tools-statblock-abilityscores-table-score-cell"
            })
        }
    }

    // // Need a double iteration here sadly to get all the key names correctly added, then all the values, so the table formats nicely
    // for (var key in spec.abilityScores) {
    //     if (spec.abilityScores.hasOwnProperty(key)) {
    //         table.createEl("div", {
    //             cls: "dm-tools-statblock-abilityscores-table-header-cell",
    //             text: titleCase(key.slice(0, 3))!
    //         })
    //     }
    // }
    // for (var key in spec.abilityScores) {
    //     if (spec.abilityScores.hasOwnProperty(key)) {
    //         table.createEl("div", {
    //             cls: "dm-tools-statblock-abilityscores-table-value-cell",
    //             text: this.calculateAbilityScore((spec.abilityScores as any)[key]) + this.calculateAbilityModifier((spec.abilityScores as any)[key])
    //         })
    //     }
    // }
}

function calculateAbilityModifier(score: number | number[]): string {
    var modifier: number
    if (typeof score === "number") {
        modifier = Math.floor((score - 10) / 2);
    } else {
        modifier = score[1];
    }

    return " (" + this.formatModifier(modifier) + ")";
}

function calculateAbilityScore(score: number | number[]): string {
    if (typeof score === "number") {
        return score.toString();
    } else {
        return score[0].toString();
    }
}

