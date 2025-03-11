import { Editor, MarkdownView, Plugin, TFile, TFolder, View, moment} from "obsidian";

enum FieldType {
    text, date, list
}

interface Query {
    header: string;
    referenceTypes: string[];
    referenceFields: string[]; 
}

interface EntityBlockDef {
    blockType: string;
    blockFields: (string|[string, FieldType])[];
    headers: string[];
    isPage: boolean;
    queryHeaders: Query[];
}

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
        });

        await this.addCalloutCommands();
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
                    text: (spec.abilityScores as any)[key].toString() + this.calculateAbilityModifier((spec.abilityScores as any)[key] as number)
                })
            }
        }
    }

    calculateAbilityModifier(modifier: number): string {
        const value = Math.floor((modifier - 10) / 2)
        return " (" + this.formatModifier(value) + ")";
    }

    formatModifier(modifier: number): string {
        const modifierPrefix = modifier > 0 ? "+" : "";
        return modifierPrefix + modifier.toString();
    }

    formatSkills(spec: StatBlock, parent: HTMLElement) {
        if (spec.skills.length == 0) {
            return;
        }
        let skillString = spec.skills.map((skill: Skill) => {
            return titleCase(skill.skill) + " " + this.formatModifier(skill.modifier);
        }).join(", ")
        this.createPrimaryTitleAndDescription(parent, "dm-tools-statblock-secondarystats-skills", "Skills", skillString);
    }

    formatSavingThrows(spec: StatBlock, parent: HTMLElement) {
        if (spec.savingThrows.length == 0) {
            return;
        }
        let skillString = spec.savingThrows.map((savingThrow: SavingThrow) => {
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

    addFieldsToFrontMatter(def: EntityBlockDef, file: TFile, reset: boolean) {
        this.app.fileManager.processFrontMatter(file, frontmatter => {
            Object.keys(frontmatter).forEach((key) => {
                delete frontmatter[key];
            })
            frontmatter["Entity Type"] = titleCase(def.blockType);

            def.blockFields.forEach(field => {
                if (typeof field === 'string') {
                    frontmatter[field] = ""
                } else {
                    switch (field[1] as FieldType) {
                        case FieldType.date:
                            frontmatter[field[0]] = moment(file.stat.ctime).format('')
                        case FieldType.text:
                            frontmatter[field[0]] = ""
                        case FieldType.list:
                            frontmatter[field[0]] = [""]
                    }
                }
            });
        })
    }

    async addCalloutCommands() {
        const blockDefinitions: EntityBlockDef[] = [
            { 
                blockType: "readout", 
                blockFields: [],
                headers: [],
                isPage: false,
                queryHeaders: []
            },
            { 
                blockType: "person", 
                blockFields: [
                    "Species", "Gender", "Alignment", 
                    "Partner Of", 
                    ["Parent Of", FieldType.list], 
                    ["Child Of", FieldType.list], 
                    ["Sibling Of", FieldType.list], 
                    ["Relative Of", FieldType.list], 
                    "Lives In", 
                    "Originally From", 
                    ["Member Of", FieldType.list],
                    "Leader Of", 
                    ["Owner Of", FieldType.list], 
                    ["Worships", FieldType.list]
                ],
                headers: [],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "business",
                blockFields: ["Owner", ["Located In", FieldType.list], "Business Type"],
                headers: [],
                isPage: true,
                queryHeaders: [
                    {header: "Inventory", referenceFields: ["Sold In"], referenceTypes: ["Item"]}
                ]
            },
            {
                blockType: "creature",
                blockFields: [["Found In", FieldType.list]],
                headers: ["Stat Block"],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "deity",
                blockFields: ["Pantheon", "Worshipped By", "Domain/Aspect", "Relatives", "Status"],
                headers: [],
                isPage: true,
                queryHeaders: [
                    {header: "Worshipped By", referenceFields: ["Worships"], referenceTypes: ["Person", "Organisation"]}
                ]
            },
            {
                blockType: "pantheon",
                blockFields: ["Parent Pantheon"],
                headers: [],
                isPage: true,
                queryHeaders: [
                    {header: "Members", referenceFields: ["Pantheon"], referenceTypes: ["Deity"]},
                    {header: "Sub-Pantheons", referenceFields: ["Parent Pantheon"], referenceTypes: ["Pantheon"]}
                ]
            },
            {
                blockType: "item",
                blockFields: [
                    "Owned By", 
                    "Created By", 
                    ["Associated With", FieldType.list],
                    "Cost", 
                    "Rarity", 
                    "Item Type", 
                    ["Sold In", FieldType.list]
                ],
                headers: [],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "landmark",
                blockFields: ["Owner", "Located In", "Landmark Type"],
                headers: [],
                isPage: true,
                queryHeaders: [
                    {header: "Landmarks", referenceTypes: ["Landmark"], referenceFields: ["Located In"]}, 
                    {header: "Settlements", referenceTypes: ["Settlement"], referenceFields: ["Located In"]},
                    {header: "Residents", referenceTypes: ["Person"], referenceFields: ["Lives In", "Originally From"]},
                    {header: "Organisations", referenceTypes: ["Organisation"], referenceFields: ["Based In", "Has Prescence In"]},
                ]
            },
            {
                blockType: "organisation",
                blockFields: [
                    "Based In", 
                    ["Has Prescence In", FieldType.list], 
                    "Organisation Type", 
                    ["Worships", FieldType.list], 
                    ["Allies", FieldType.list], 
                    ["Enemies", FieldType.list], 
                    "Leader",
                    ["Part Of", FieldType.list]
                ],
                headers: [],
                isPage: true,
                queryHeaders: [
                    {header: "Members", referenceTypes: ["Person"], referenceFields: ["Member Of", "Leader Of"]},
                    {header: "Suborganisations", referenceTypes: ["Organisation"], referenceFields: ["Part Of"]}
                ]
            },
            {
                blockType: "quest",
                blockFields: [
                    ["Prerequisites", FieldType.list], 
                    ["Required For", FieldType.list], 
                    "Campaign"
                ],
                headers: ["Premise", "Hooks", "Description", "NPCs", "Rewards"],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "settlement",
                blockFields: ["Settlement Type", "Ruled By", "Located In", "World"],
                headers: ["Specialities", "Quests"],
                isPage: true,
                queryHeaders: [
                    {header: "Landmarks", referenceTypes: ["Landmark"], referenceFields: ["Located In"]}, 
                    {header: "Businesses", referenceTypes: ["Business"], referenceFields: ["Located In"]}, 
                    {header: "Residents", referenceTypes: ["Person"], referenceFields: ["Lives In", "Originally From"]},
                    {header: "Organisations", referenceTypes: ["Organisation"], referenceFields: ["Based In", "Has Prescence In"]},
                ]
            },
            {
                blockType: "region",
                blockFields: ["Region Type", "Ruled By", "Located In", "World"],
                headers: ["Specialities", "Quests"],
                isPage: true,
                queryHeaders: [
                    {header: "Sub-Regions", referenceTypes: ["Region"], referenceFields: ["Located In"]}, 
                    {header: "Landmarks", referenceTypes: ["Landmark"], referenceFields: ["Located In"]}, 
                    {header: "Settlements", referenceTypes: ["Settlement"], referenceFields: ["Located In"]},
                    {header: "Residents", referenceTypes: ["Person"], referenceFields: ["Lives In", "Originally From"]},
                    {header: "Organisations", referenceTypes: ["Organisation"], referenceFields: ["Based In", "Has Prescence In"]}
                ]
            },
            {
                blockType: "episode",
                headers: ["Plan", "Meanwhile/Rumours", "Log"],
                blockFields: [["Date of Session", FieldType.date], "In Game Start Date", "In Game End Date", "Weather"],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "spell",
                headers: ["At Higher Levels"],
                blockFields: ["Casting Time", "Range", "Components", "Duration", "Level", ["Available Classes", FieldType.list]],
                isPage: true,
                queryHeaders: []
            },
            {
                blockType: "encounter",
                blockFields: ["Suitable for Level", "DND Beyond Link", ["Location(s)", FieldType.list]],
                headers: ["Rewards"],
                isPage: true,
                queryHeaders: []
            }
        ]

        blockDefinitions.forEach(def => {
            this.addCommand({
                id: `convert-${def.blockType}-block`,
                name: def.isPage ? `Convert to ${titleCase(def.blockType)} Page` : `Add ${titleCase(def.blockType)} Block`,
                editorCallback: (editor: Editor, view: MarkdownView) => {
                    let block: string = `>[!${def.blockType}]`;

                    if (def.isPage) {
                        if (view.file != null) {
                            // Remove quote for full page entity
                            block = "";

                            def.headers.forEach(header => {
                                block += `\n## ${header}\n`
                            })

                            this.addFieldsToFrontMatter(def, view.file, true);
                            block = this.appendQueryHeaders(def, block, view.file!.name);
                        }
                    } else {
                        if (def.blockFields.length > 0 ) {
                            def.blockFields.forEach(field => {
                                block += `\n>**${field}** : `
                            });
                        } else {
                            block += "\n>"
                        }

                        def.headers.forEach(header => {
                            block += `\n## ${header}\n`
                        })
                    }

                    editor.replaceRange(block, editor.getCursor())
                },
            })

            if (def.isPage) {
                this.addCommand({
                    id: `add-${def.blockType}-block`,
                    name: `Add ${titleCase(def.blockType)} Page`,
                    editorCallback: async (editor: Editor, view: MarkdownView) => {
                        let block = "";
                        let parentFolder = this.app.workspace.activeEditor?.file?.parent;
                        if (parentFolder != null) {
                            def.headers.forEach(header => {
                                block += `\n## ${header}\n`
                            })

                            block = this.appendQueryHeaders(def, block, `new_${def.blockType}`);
        
                            let file = await this.app.vault.create(parentFolder.path + `/new_${def.blockType}.md`, block);
                            this.addFieldsToFrontMatter(def, file, true);
                        }
                    }
                })
            }
        });
    }

    folderIfExists(name: string): TFolder | undefined {
        return this.app.vault.getAllFolders().find((folder: TFolder) => {
            folder.name === name
        })
    }

    appendQueryHeaders(def: EntityBlockDef, block: string, filename: string): string {
        let blockCopy = block;
        def.queryHeaders.forEach((query: Query) => {
            let adjustedFilename = filename.substring(0, filename.length - 3);
            let typeFieldString = query.referenceTypes.map((value) => {
                return `type = "${value}" or entity-type = "${value}"`
            }).join(" or ");
            let fieldValueString = query.referenceFields.map((value) => {
                let normalisedValue = replaceAll(value.toLowerCase(), " ", "-");
                return `contains(${normalisedValue}, [[${adjustedFilename}]])`
            }).join(" or ");
            blockCopy += `
## ${query.header}
\`\`\`dataview
LIST
WHERE (${typeFieldString}) and (${fieldValueString})
\`\`\``
        })
        blockCopy += "\n"
        return blockCopy;
    }
}

// Modified from https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function titleCase(str?: string): string | null {
    if (str == null) {
        return null;
    }
    let splitStr = str.toLowerCase().split(' ');
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
    "name": "Example Creature",
    "size": "medium",
    "creatureType": "humanoid",
    "alignment": "chaotic good",
    "ac": 10,
    "hp": 10,
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
            "modifier": 10
        }
    ],
    "skills": [
        {
            "skill": "Acrobatics",
            "modifier": 10
        },
        {
	        "skill": "Persuasion",
	        "modifier": -5
        }
    ],
    "vulnerabilities": "Bludgeoning",
    "resistances": "Piercing",
    "damageImmunities": "Cold",
    "conditionImmunities": "Exhaustion",
    "senses": "Truesight 30ft.",
    "languages": "Common",
    "challenge": "1/4",
    "proficiency": 3,
    "abilities": [
        {
            "title": "Example Ability",
            "description": "This is a ability"
        }
    ],
    "actions": [
        {
            "title": "Example Action",
            "description": "This is a action"
        }
    ],
    "legendaryActions": [
        {
            "title": "Example Legendary Action",
            "description": "This is a legendary action"
        }
    ],
    "lairActions": [
        {
            "title": "Example Lair Action",
            "description": "This is a lair action"
        }
    ],
    "bonusActions": [
        {
            "title": "Example Bonus Action (Recharge 4-6)",
            "description": "This is a bonus action"
        }
    ],
    "reactions": [
        {
            "title": "Example Reaction",
            "description": "This is a reaction"
        }
    ]
}
\`\`\`
`;

function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  
  function replaceAll(str: string, find: string, replace: string): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }