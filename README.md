# Obsidian DM Tools

## What is this plugin?
This is a plugin to help D&D Dungeon Masters work better in Obsidian (or for anyone using Obsidian as a knowledge store/wiki for D&D!).

## What is included?

- Stat Blocks - format nice 5E stat blocks in your notes

(more planned and coming soon!)

## How do I use it?

### Stat Blocks

Using this plugin, you can add nicely formatted stat blocks to creatures in your notes. This works by using a special code block, with a JSON representation of the stat block data.

To add a template stat block, open the Command Palette and choose `Add Creature Statblock`. This will add a complete JSON example block, for you to edit as you wish.

Some fields are required, and others are optional. Required fields are:

- `name`
- `ac` 
- `hp` 
- `speed`
- `challenge`
- `abilityScores` 

In addition, the follow fields are required, but can be empty, in which case they won't be shown in the rendered block.
- `savingThrows`
- `skills`
- `abilities`
- `actions`
- `reactions`
- `bonusActions`
- `legendaryActions`
- `lairActions`

The following fields are optional, and will not be shown if not included.
- `size`
- `creatureType`
- `alignment`
- `proficiency`
- `vulnerabilities`
- `resistances`
- `damageImmunities`
- `conditionImmunities`
- `senses`
- `languages`

You can customise almost any aspect of the block by using the css classes on each element. See the code for classes available.
