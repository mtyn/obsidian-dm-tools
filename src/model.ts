export enum FieldType {
    text, date, list
}

export interface Query {
    header: string;
    referenceTypes: string[];
    referenceFields: string[]; 
}

export interface EntityBlockDef {
    blockType: string;
    blockFields: (string|[string, FieldType])[];
    headers: string[];
    isPage: boolean;
    queryHeaders: Query[];
}

/// Arrays here are [value, save]. Modifier is calculated from value.
export interface AbilityScores {
    strength: number | [number, number];
    dexterity: number | [number, number];
    constitution: number | [number, number];
    intelligence: number | [number, number];
    wisdom: number | [number, number];
    charisma: number | [number, number];
}

export interface Spellcasting {
    description: string;
    spells: any;
}

export interface StatBlock {
    name: string;

    size?: string;
    creatureType?: string;
    alignment?: string;

    ac: number;
    hp: number;
    speed: string;
    challenge: string;

    abilityScores: AbilityScores;

    // Deprecated, no longer used.
    proficiency?: number;
    initiative?: number;

    skills?: any;

    vulnerabilities?: string;
    resistances?: string;
    damageImmunities?: string;
    conditionImmunities?: string;

    senses?: string;
    languages?: string;

    traits?: any;
    actions?: any;
    reactions?: any;
    bonusActions?: any;
    legendaryActions?: any;
    lairActions?: any;
    spellcasting?: Spellcasting;
}