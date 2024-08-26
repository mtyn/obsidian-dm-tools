import { Editor, MarkdownView, Plugin } from "obsidian";

interface SavingThrow {
    ability: string;
    modifier: number;
}

interface Skill {
    skill: string;
    modifier: number;
}

interface AbilityOrAction {
    title: string;
    description: string;
}

interface AbilityScores {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

interface StatBlock {
    name: string;

    size?: string;
    creatureType?: string;
    alignment?: string;

    ac: number;
    hp: number;
    speed: string;
    challenge: string;

    abilityScores: AbilityScores;

    proficiency?: number;

    savingThrows: SavingThrow[];
    skills: Skill[];

    vulnerabilities?: string;
    resistances?: string;
    damageImmunities?: string;
    conditionImmunities?: string;

    senses?: string;
    languages?: string;

    abilities: AbilityOrAction[];
    actions: AbilityOrAction[];
    reactions: AbilityOrAction[];
    bonusActions: AbilityOrAction[];
    legendaryActions: AbilityOrAction[];
    lairActions: AbilityOrAction[];
}

export default class DMToolsPlugin extends Plugin {
    async onload() {
        this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => {
            const statblockOuterWrapper = el.createDiv({cls: "dm-tools-statblock"});
            const statblockWrapper = statblockOuterWrapper.createEl("details", {cls: "dm-tools-statblock-inner", attr: {"open": true}});

            const statBlockSpec: StatBlock = JSON.parse(source); 

            const titleWrapper = statblockWrapper.createEl("summary").createSpan();
            titleWrapper.createEl("div", {cls: "dm-tools-statblock-title-header", text: statBlockSpec["name"]});
            
            statblockWrapper.createEl(
                "div", 
                {cls: "dm-tools-statblock-type-alignment", text: this.parseCreatureTypeAndAlignment(statBlockSpec)}
            );

            const keyStatSection = statblockWrapper.createDiv({cls: ["dm-tools-statblock-keystats", "dm-tools-statblock-section"]});
            this.createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-ac", "Armor Class", statBlockSpec.ac.toString());
            this.createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-hp", "Hit Points", statBlockSpec.hp.toString());
            this.createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-speed", "Speed", statBlockSpec.speed);
            this.createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-challenge", "Challenge", statBlockSpec.challenge.toString());
            if (statBlockSpec.proficiency != undefined) {
                this.createPrimaryTitleAndDescription(keyStatSection, "dm-tools-statblock-keystats-proficiency", "Proficiency", this.formatModifier(statBlockSpec.proficiency));
            }
            
            this.formatAbilityScores(statBlockSpec, statblockWrapper);

            const secondaryStatSection = statblockWrapper.createDiv({cls: ["dm-tools-statblock-secondarystats", "dm-tools-statblock-section"]})
            this.formatSkills(statBlockSpec, secondaryStatSection);
            this.formatSavingThrows(statBlockSpec, secondaryStatSection);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-vulns", "Vulnerabilities", statBlockSpec.vulnerabilities);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-resistances", "Resistances", statBlockSpec.resistances);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-damage-immunities", "Damage Immunities", statBlockSpec.damageImmunities);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-condition-immunities", "Condition Immunities", statBlockSpec.conditionImmunities);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-senses", "Senses", statBlockSpec.senses);
            this.createPrimaryTitleAndDescription(secondaryStatSection, "dm-tools-statblock-secondarystats-languages", "Languages", statBlockSpec.languages);
            
            this.formatAbilityOrActionList(statBlockSpec.abilities, statblockWrapper, "dm-tools-statblock-abilities");
            this.formatAbilityOrActionList(statBlockSpec.actions, statblockWrapper, "dm-tools-statblock-actions", "ACTIONS");
            this.formatAbilityOrActionList(statBlockSpec.reactions, statblockWrapper, "dm-tools-statblock-reactions", "REACTIONS");
            this.formatAbilityOrActionList(statBlockSpec.bonusActions, statblockWrapper, "dm-tools-statblock-bonusactions", "BONUS ACTIONS");
            this.formatAbilityOrActionList(statBlockSpec.legendaryActions, statblockWrapper, "dm-tools-statblock-legendaryactions", "LEGENDARY ACTIONS");
            this.formatAbilityOrActionList(statBlockSpec.lairActions, statblockWrapper, "dm-tools-statblock-lairactions", "LAIR ACTIONS");
        });

        this.addCommand({
            id: "add-creature-statblock",
            name: "Add Creature Statblock",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                editor.replaceRange(sampleStatblock, editor.getCursor())
            },
        })
    }

    parseCreatureTypeAndAlignment(spec: StatBlock): string {
        const sizeAndType = ((spec.size ?? "") + " " + (spec.creatureType ?? "")).trim();
        let components = [sizeAndType];
        if (spec.alignment !== null) {
            components.push(spec.alignment!);
        }
        return titleCase(components.join(", ")) ?? "";
    }

    formatAbilityScores(spec: StatBlock, parent: HTMLElement) {
        const wrapper = parent.createDiv({cls: "dm-tools-statblock-abilityscores"});
        const table = wrapper.createEl("div", {cls: "dm-tools-statblock-abilityscores-table"});

        // Need a double iteration here sadly to get all the key names correctly added, then all the values, so the table formats nicely
        for (var key in spec.abilityScores) {
            if (spec.abilityScores.hasOwnProperty(key)) {
                table.createEl("div", {
                    cls: "dm-tools-statblock-abilityscores-table-header-cell",
                    text: titleCase(key.slice(0, 3))!
                })
            }
        }
        for (var key in spec.abilityScores) {
            if (spec.abilityScores.hasOwnProperty(key)) {
                table.createEl("div", {
                    cls: "dm-tools-statblock-abilityscores-table-value-cell",
                    text: (spec.abilityScores as any)[key].toString()
                })
            }
        }
    }

    formatModifier(modifier: number): string {
        const modifierPrefix = modifier > 0 ? "+" : "";
        return modifierPrefix + modifier.toString();
    }

    formatSkills(spec: StatBlock, parent: HTMLElement) {
        if (spec.skills.length == 0) {
            return;
        }
        var skillString = spec.skills.map((skill: Skill) => {
            return titleCase(skill.skill) + " " + this.formatModifier(skill.modifier);
        }).join(", ")
        this.createPrimaryTitleAndDescription(parent, "dm-tools-statblock-secondarystats-skills", "Skills", skillString);
    }

    formatSavingThrows(spec: StatBlock, parent: HTMLElement) {
        if (spec.savingThrows.length == 0) {
            return;
        }
        var skillString = spec.savingThrows.map((savingThrow: SavingThrow) => {
            return titleCase(savingThrow.ability) + " " + this.formatModifier(savingThrow.modifier);
        }).join(", ")
        this.createPrimaryTitleAndDescription(parent, "dm-tools-statblock-secondarystats-savingthrows", "Saving Throws", skillString);
    }

    formatAbilityOrActionList(list: AbilityOrAction[], parent: HTMLElement, entryClass: string, title?: string) {
        if (list.length == 0) {
            return;
        }
        const abilitySection = parent.createDiv({cls: [entryClass, "dm-tools-statblock-section"]})
        if (title != undefined) {
            abilitySection.createDiv({cls: "dm-tools-statblock-ability-section-header", text: title.toUpperCase()})
        }
        list.forEach((ability: AbilityOrAction) => {
            this.createSecondaryTitleAndDescription(abilitySection, "dm-tools-statblock-ability-item", ability.title, ability.description)
        })
    }

    createPrimaryTitleAndDescription(parentElement: HTMLElement, parentClass: string, title: string, description: string | undefined) {
        if (description == undefined || description.length == 0) {
            return;
        }
        this.createTitledText(
            parentElement,
            parentClass,
            title,
            "dm-tools-statblock-entry-title",
            description
        )
    }

    createSecondaryTitleAndDescription(parentElement: HTMLElement, parentClass: string, title: string, description: string | undefined) {
        if (description == undefined || description.length == 0) {
            return;
        }
        this.createTitledText(
            parentElement,
            parentClass,
            title,
            "dm-tools-statblock-subentry-title",
            description
        )
    }

    createTitledText(parent: HTMLElement, parentClass: string, text1: string, class1: string, text2: string): HTMLElement {
        const wrapperDiv = parent.createDiv({cls: parentClass});
        wrapperDiv.createSpan({text: text1, cls: class1});
        wrapperDiv.createSpan({text: " " + text2});
        return wrapperDiv;
    }

    onunload() { }
}

// Modified from https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function titleCase(str?: string): string | null {
    if (str == null) {
        return null;
    }
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

const sampleStatblock = `
\`\`\`statblock
{
    "name": "My First Creature",
    "size": "medium",
    "creatureType": "undead",
    "alignment": "neutral evil",
    "ac": 15,
    "hp": 45,
    "speed": "30 ft., fly 40 ft.",
    "abilityScores": {
	    "strength": 10,
	    "dexterity": 10,
	    "constitution": 10,
	    "intelligence": 10,
	    "wisdom":  10,
	    "charisma": 10
	},
    "savingThrows": [
        {
            "ability": "Dexterity",
            "modifier": 11
        }
    ],
    "skills": [
        {
            "skill": "Acrobatics",
            "modifier": 10
        },
        {
	        "skill": "Persuasion",
	        "modifier": -2
        }
    ],
    "vulnerabilities": "Bludgeoning",
    "resistances": "Piercing",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "",
    "languages": "",
    "challenge": "1/4",
    "proficiency": 1,
    "abilities": [
        {
            "title": "Some Ability",
            "description": "This is a cool ability"
        }
    ],
    "actions": [
        {
            "title": "Some Ability",
            "description": "This is a cool ability"
        }
    ],
    "legendaryActions": [
        {
            "title": "Some Ability",
            "description": "This is a cool ability"
        }
    ],
    "lairActions": [
        {
            "title": "Some Ability",
            "description": "This is a cool ability"
        }
    ],
    "bonusActions": [
        {
            "title": "Some Ability (Recharge 4-6)",
            "description": "This is a cool ability"
        }
    ],
    "reactions": [
        {
            "title": "Some Ability",
            "description": "This is a cool ability"
        }
    ]
}
\`\`\`
`;

/*
Sample StatBlock


*/

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
