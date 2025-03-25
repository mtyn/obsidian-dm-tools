import { createSecondaryTitleAndDescription } from "src/formatters";
import { keysForDictionary } from "src/helpers";

export function formatAbilityOrActionList(title: string, list: any, parent: HTMLElement) {
    let actionKeys = keysForDictionary(list);

    if (actionKeys.length == 0) {
        return;
    }
    const abilitySection = parent.createDiv({ cls: ["dm-tools-statblock-section"] })
    const titleDiv = abilitySection.createDiv({ cls: "dm-tools-statblock-ability-section-header"})
    titleDiv.createSpan({cls: "dm-tools-statblock-ability-section-header-capital", text: title[0]})
    titleDiv.createSpan({cls: "dm-tools-statblock-ability-section-header-small-caps", text: title.slice(1)})

    actionKeys.forEach((key: string) => {
        const content = list[key];
        createSecondaryTitleAndDescription(abilitySection, "dm-tools-statblock-ability-item", key, content)
    });
}