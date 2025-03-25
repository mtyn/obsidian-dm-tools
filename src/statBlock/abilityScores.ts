import { formatModifier } from "src/formatters";
import { StatBlock } from "src/model";

const MOD_GROUP_CLASS = "dm-tools-statblock-abilityscores-modifier-group";
const MOD_ROW_CLASS = "dm-tools-statblock-abilityscores-table-row";
const MOD_ROW_CELL_CLASS = "dm-tools-statblock-abilityscores-table-cell";
const MOD_ROW_SCORE_CLASS = "dm-tools-statblock-abilityscores-table-score-cell";
const MOD_ROW_SAVE_CLASS = "dm-tools-statblock-abilityscores-table-save-cell";
const MOD_ROW_MOD_CLASS = "dm-tools-statblock-abilityscores-table-modifier-cell";
const MOD_ROW_HEADER_CLASS = "dm-tools-statblock-abilityscores-table-header-cell";
const MOD_GROUP_LABEL_CLASS = "dm-tools-statblock-abilityscores-modifier-group-label";

export function formatAbilityScores(spec: StatBlock, parent: HTMLElement) {
    const wrapper = parent.createDiv({cls: "dm-tools-statblock-abilityscores"});
    const table = wrapper.createEl("div", {cls: "dm-tools-statblock-abilityscores-table"});

    // Physical Modifiers
    const physicalModifiers = table.createDiv({
        cls: [MOD_GROUP_CLASS, "dm-tools-statblock-abilityscores-physical"]
    })
    addLabelRow(physicalModifiers)
    formatScore("STR", spec.abilityScores.strength, physicalModifiers);
    formatScore("DEX", spec.abilityScores.dexterity, physicalModifiers);
    formatScore("CON", spec.abilityScores.constitution, physicalModifiers);

    const mentalModifiers = table.createDiv({
        cls: [MOD_GROUP_CLASS, "dm-tools-statblock-abilityscores-mental"]
    })
    addLabelRow(mentalModifiers)
    formatScore("INT", spec.abilityScores.intelligence, mentalModifiers);
    formatScore("WIS", spec.abilityScores.wisdom, mentalModifiers);
    formatScore("CHA", spec.abilityScores.charisma, mentalModifiers);
}

function addLabelRow(parent: HTMLElement) {
    const row = parent.createDiv({
        cls: MOD_ROW_CLASS
    });
    row.createDiv({cls: MOD_ROW_CELL_CLASS});
    row.createDiv({cls: MOD_ROW_CELL_CLASS});
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_GROUP_LABEL_CLASS],
        text: "MOD"
    });
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_GROUP_LABEL_CLASS],
        text: "SAVE"
    });
}

function formatScore(title: string, score: number | number[], parent: HTMLElement) {
    const row = parent.createDiv({
        cls: MOD_ROW_CLASS
    });
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_ROW_HEADER_CLASS],
        text: title
    });
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_ROW_SCORE_CLASS],
        text: formatAbilityScore(score)
    });
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_ROW_MOD_CLASS],
        text: formatAbilityModifier(score)
    });
    row.createDiv({
        cls: [MOD_ROW_CELL_CLASS, MOD_ROW_SAVE_CLASS],
        text: formatAbilitySave(score)
    })
}

function calculateAbilityModifier(score: number | number[]): number {
    var base: number
    if (typeof score === "number") {
        base = score
    } else {
        base = score[0];
    }
    return Math.floor((base - 10) / 2)
}

function formatAbilityModifier(score: number | number[]): string {
    return formatModifier(calculateAbilityModifier(score));
}

function formatAbilitySave(score: number | number[]): string {
    var save: number
    if (typeof score === "number") {
        save = calculateAbilityModifier(score)
    } else {
        save = score[1];
    }

    return formatModifier(save);
}

function formatAbilityScore(score: number | number[]): string {
    if (typeof score === "number") {
        return score.toString();
    } else {
        return score[0].toString();
    }
}
