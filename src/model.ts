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

export interface Skill {
    skill: string;
    modifier: number;
}

export interface AbilityOrAction {
    title: string;
    description: string;
}

/// Arrays here are [value, save]. Modifier is calculated from value.
export interface AbilityScores {
    strength: number | number[];
    dexterity: number | number[];
    constitution: number | number[];
    intelligence: number | number[];
    wisdom: number | number[];
    charisma: number | number[];
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

    proficiency?: number;

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