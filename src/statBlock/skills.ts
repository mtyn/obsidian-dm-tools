import { formatModifier, createPrimaryTitleAndDescription } from "src/formatters";
import { keysForDictionary, titleCase } from "src/helpers";
import { StatBlock } from "src/model";

export function formatSkills(spec: StatBlock, parent: HTMLElement) {
    const skillKeys = keysForDictionary(spec.skills);

    if (skillKeys.length == 0) {
        return;
    }

    let skillString = skillKeys.map((skillKey: string) => {
        return titleCase(skillKey) + " " + formatModifier(spec.skills[skillKey]);
    }).join(", ")
    createPrimaryTitleAndDescription(parent, "dm-tools-statblock-secondarystats-skills", "Skills", skillString);
}