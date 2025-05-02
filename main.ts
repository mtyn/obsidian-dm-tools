import { Editor, MarkdownView, Plugin, TFile, TFolder, View, moment } from "obsidian";
import { sampleStatblock } from "src/sampleData";
import { pageAndBlockDefinitions } from "src/blockTypes/callouts";
import { buildStatBlock } from "src/statBlock/statBlock";
import { createNewBlockOrConvertPageCommand } from "src/blockTypes/pageAndBlockCommand";

export default class DMToolsPlugin extends Plugin {
    async onload() {
        this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => {
            buildStatBlock(el, source);
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
            this.addCommand(createNewBlockOrConvertPageCommand(def, this.app));
        })
    }

    onunload() { }
}