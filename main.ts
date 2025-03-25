import { StatBlock, Skill, AbilityOrAction, EntityBlockDef, FieldType, Query } from "src/model";
import { Editor, MarkdownView, Plugin, TFile, TFolder, View, moment } from "obsidian";
import { titleCase, replaceAll } from "src/helpers";
import { sampleStatblock } from "src/sampleData";
import { formatAbilityScores } from "src/statBlock/abilityScores";
import { createSecondaryTitleAndDescription } from "src/formatters";
import { buildKeyStats, buildSecondaryStats } from "src/statBlock/stats";
import { pageAndBlockDefinitions } from "src/blockTypes/callouts";

export default class DMToolsPlugin extends Plugin {
    async onload() {
        this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => {
            const statblockWrapper = el.createDiv({ cls: "dm-tools-statblock" });

            const statBlockSpec: StatBlock = JSON.parse(source);

            const titleWrapper = statblockWrapper.createEl("summary").createSpan();
            titleWrapper.createEl("div", { cls: "dm-tools-statblock-title-header", text: statBlockSpec["name"] });

            statblockWrapper.createEl(
                "div",
                { cls: "dm-tools-statblock-type-alignment", text: this.parseCreatureTypeAndAlignment(statBlockSpec) }
            );

            buildKeyStats(statBlockSpec, statblockWrapper);
            formatAbilityScores(statBlockSpec, statblockWrapper);
            buildSecondaryStats(statBlockSpec, statblockWrapper);

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

        await this.addPageAndBlockCommands();
    }

    async addPageAndBlockCommands() {
        pageAndBlockDefinitions.forEach(def => {
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
                        if (def.blockFields.length > 0) {
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

    parseCreatureTypeAndAlignment(spec: StatBlock): string {
        const sizeAndType = ((spec.size ?? "") + " " + (spec.creatureType ?? "")).trim();
        let components = [sizeAndType];
        if (spec.alignment !== null) {
            components.push(spec.alignment!);
        }
        return titleCase(components.join(", ")) ?? "";
    }

    formatAbilityOrActionList(list: AbilityOrAction[], parent: HTMLElement, entryClass: string, title?: string) {
        if (list.length == 0) {
            return;
        }
        const abilitySection = parent.createDiv({ cls: [entryClass, "dm-tools-statblock-section"] })
        if (title != undefined) {
            abilitySection.createDiv({ cls: "dm-tools-statblock-ability-section-header", text: title.toUpperCase() })
        }
        list.forEach((ability: AbilityOrAction) => {
            createSecondaryTitleAndDescription(abilitySection, "dm-tools-statblock-ability-item", ability.title, ability.description)
        })
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