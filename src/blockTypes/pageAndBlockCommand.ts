import { moment } from "obsidian";
import { App, Command, Editor, MarkdownView, TFile } from "obsidian";
import { replaceAll, titleCase } from "src/helpers";
import { EntityBlockDef, FieldType, Query } from "src/model";

export function createNewBlockOrConvertPageCommand(def: EntityBlockDef, app: App): Command {
    return {
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

                    addFieldsToFrontMatter(def, view.file, app, true);
                    block = appendQueryHeaders(def, block, view.file!.name);
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
    }
}

export function createNewPageCommand(def: EntityBlockDef, app: App): Command {
    return {
        id: `add-${def.blockType}-block`,
        name: `Add ${titleCase(def.blockType)} Page`,
        editorCallback: async (editor: Editor, view: MarkdownView) => {
            let block = "";
            let parentFolder = app.workspace.activeEditor?.file?.parent;
            if (parentFolder != null) {
                def.headers.forEach(header => {
                    block += `\n## ${header}\n`
                })

                block = appendQueryHeaders(def, block, `new_${def.blockType}`);

                let file = await app.vault.create(parentFolder.path + `/new_${def.blockType}.md`, block);
                addFieldsToFrontMatter(def, file, app, true);
            }
        }
    }
}

function addFieldsToFrontMatter(def: EntityBlockDef, file: TFile, app: App, reset: boolean) {
    app.fileManager.processFrontMatter(file, frontmatter => {
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

function appendQueryHeaders(def: EntityBlockDef, block: string, filename: string): string {
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