import { formatModifier, createPrimaryTitleAndDescription } from "src/formatters";
import { titleCase } from "src/helpers";
import { StatBlock, Skill } from "src/model";

export function formatSkills(spec: StatBlock, parent: HTMLElement) {
    if (spec.skills.length == 0) {
        return;
    }
    let skillString = spec.skills.map((skill: Skill) => {
        return titleCase(skill.skill) + " " + formatModifier(skill.modifier);
    }).join(", ")
    createPrimaryTitleAndDescription(parent, "dm-tools-statblock-secondarystats-skills", "Skills", skillString);
}