import { StatBlock } from "src/model";
import { formatAbilityScores } from "./abilityScores";
import { formatAbilityOrActionList } from "./actions";
import { buildKeyStats, buildSecondaryStats } from "./stats";
import { titleCase } from "src/helpers";
import { processSpellcastingBlock } from "./spellcasting";

export function buildStatBlock(parent: HTMLElement, source: string) {
    const statblockWrapper = parent.createDiv({ cls: "dm-tools-statblock" });

    const statBlockSpec: StatBlock = JSON.parse(source);

    const titleWrapper = statblockWrapper.createEl("summary").createSpan();
    titleWrapper.createEl("div", { cls: "dm-tools-statblock-title-header", text: statBlockSpec["name"] });

    statblockWrapper.createEl(
        "div",
        { cls: "dm-tools-statblock-type-alignment", text: parseCreatureTypeAndAlignment(statBlockSpec) }
    );

    buildKeyStats(statBlockSpec, statblockWrapper);
    formatAbilityScores(statBlockSpec, statblockWrapper);
    buildSecondaryStats(statBlockSpec, statblockWrapper);

    formatAbilityOrActionList("Traits", statBlockSpec.traits, statblockWrapper);
    formatAbilityOrActionList("Actions", statBlockSpec.actions, statblockWrapper);
    processSpellcastingBlock(statblockWrapper, statBlockSpec.spellcasting);
    formatAbilityOrActionList("Reactions", statBlockSpec.reactions, statblockWrapper);
    formatAbilityOrActionList("Bonus Actions", statBlockSpec.bonusActions, statblockWrapper);
    formatAbilityOrActionList("Legendary Actions", statBlockSpec.legendaryActions, statblockWrapper);
    formatAbilityOrActionList("Lair Actions", statBlockSpec.lairActions, statblockWrapper);
}

function parseCreatureTypeAndAlignment(spec: StatBlock): string {
    const sizeAndType = ((spec.size ?? "") + " " + (spec.creatureType ?? "")).trim();
    let components = [sizeAndType];
    if (spec.alignment !== null) {
        components.push(spec.alignment!);
    }
    return titleCase(components.join(", ")) ?? "";
}