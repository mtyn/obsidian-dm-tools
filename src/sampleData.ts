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