import { createPrimaryTitleAndDescription, formatModifier } from "../formatters";
import { StatBlock } from "../model";
import { formatSkills } from "./skills";

export function buildKeyStats(statBlockSpec: StatBlock, parent: HTMLElement) {
    const keyStatSection = parent.createDiv({cls: ["dm-tools-statblock-keystats", "dm-tools-statblock-section"]});
    createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-ac", "Armor Class", statBlockSpec.ac.toString());
    createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-hp", "Hit Points", statBlockSpec.hp.toString());
    createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-speed", "Speed", statBlockSpec.speed);
    if (statBlockSpec.proficiency != undefined) {
        createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-proficiency", "Proficiency", formatModifier(statBlockSpec.proficiency));
    }
    if (statBlockSpec.initiative != undefined) {
        createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-initiative", "Initiative", formatModifier(statBlockSpec.initiative));
    }
}

export function buildSecondaryStats(statBlockSpec: StatBlock, parent: HTMLElement) {
    const secondaryStatSection = parent.createDiv({cls: ["dm-tools-statblock-secondarystats", "dm-tools-statblock-section"]})
    formatSkills(statBlockSpec, secondaryStatSection);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-vulns", "Vulnerabilities", statBlockSpec.vulnerabilities);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-resistances", "Resistances", statBlockSpec.resistances);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-damage-immunities", "Damage Immunities", statBlockSpec.damageImmunities);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-condition-immunities", "Condition Immunities", statBlockSpec.conditionImmunities);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-senses", "Senses", statBlockSpec.senses);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-languages", "Languages", statBlockSpec.languages);
    createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-keystats-challenge", "Challenge", statBlockSpec.challenge.toString());
}