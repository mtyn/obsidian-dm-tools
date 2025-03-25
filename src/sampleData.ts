export const sampleStatblock = `
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
    "initiative": 3,
    "skills": {
        "Acrobatics": 10,
        "Persuasion": -5
    },
    "vulnerabilities": "Bludgeoning",
    "resistances": "Piercing",
    "damageImmunities": "Cold",
    "conditionImmunities": "Exhaustion",
    "senses": "Truesight 30ft.",
    "languages": "Common",
    "challenge": "1/4",
    "traits": {
        "Example Trait": "This is a trait"
    },
    "actions": {
        "Example Action": "This is a action"
    },
    "spellcasting: {
        "description": "This character can cast spells",
        "spells": {
            "At Will": "Eldritch Blast",
            "1/day": "Fireball"
        }
    },
    "legendaryActions": {
        "Example Action": "This is a action"
    },
    "lairActions": {
        "Example Action": "This is a action"
    },
    "bonusActions": {
        "Example Action": "This is a action"
    },
    "reactions": {
        "Example Reaction": "This is a reaction"
    }
}
\`\`\`
`;