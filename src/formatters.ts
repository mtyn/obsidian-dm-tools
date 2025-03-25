
export function formatModifier(modifier: number): string {
    const modifierPrefix = modifier > 0 ? "+" : "";
    return modifierPrefix + modifier.toString();
}

export function createPrimaryTitleAndDescription(parentElement: HTMLElement, parentClass: string, title: string, description: string | undefined) {
    if (description == undefined || description.length == 0) {
        return;
    }
    createTitledText(
        parentElement,
        parentClass,
        title,
        "dm-tools-statblock-entry-title",
        description
    )
}

export function createSecondaryTitleAndDescription(parentElement: HTMLElement, parentClass: string, title: string, description: string | undefined) {
    if (description == undefined || description.length == 0) {
        return;
    }
    createTitledText(
        parentElement,
        parentClass,
        title,
        "dm-tools-statblock-subentry-title",
        description
    )
}

export function createTitledText(parent: HTMLElement, parentClass: string, text1: string, class1: string, text2: string): HTMLElement {
    const wrapperDiv = parent.createDiv({ cls: parentClass });
    wrapperDiv.createSpan({ text: text1, cls: class1 });
    wrapperDiv.createSpan({ text: " " + text2 });
    return wrapperDiv;
}