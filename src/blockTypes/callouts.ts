import { EntityBlockDef, FieldType } from "src/model";

export const pageAndBlockDefinitions: EntityBlockDef[] = [
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
        headers: ["Plan", "Meanwhile/Rumours", "Ways to Link To Party Stories", "Log"],
        blockFields: [["Date of Session", FieldType.date], "In Game Start Date", "In Game End Date", "Weather", "Campaign", "Arc"],
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