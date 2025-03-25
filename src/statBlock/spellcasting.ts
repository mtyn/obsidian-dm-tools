import { createSecondaryTitleAndDescription, createTertiaryTitleAndDescription } from "src/formatters";
import { keysForDictionary } from "src/helpers";
import { Spellcasting } from "src/model";

const SPELLCASTING_BLOCK_CLASS = "dm-tools-statblock-spellcasting";
const SPELLCASTING_DESCRIPTION_CLASS = SPELLCASTING_BLOCK_CLASS + "-description";
const SPELLCASTING_SPELL_DETAILS_CLASS = SPELLCASTING_BLOCK_CLASS + "-spell-details";

export function processSpellcastingBlock(parent: HTMLElement, spellcasting?: Spellcasting) {
    if (spellcasting == undefined) {
        return;
    }

    const spellcastingBlock = parent.createDiv({cls: SPELLCASTING_BLOCK_CLASS});
    createSecondaryTitleAndDescription(spellcastingBlock, SPELLCASTING_DESCRIPTION_CLASS, "Spellcasting", spellcasting.description);
    keysForDictionary(spellcasting.spells).forEach((key: string) => {
        createTertiaryTitleAndDescription(spellcastingBlock, SPELLCASTING_SPELL_DETAILS_CLASS, key, spellcasting.spells[key])
    })
}