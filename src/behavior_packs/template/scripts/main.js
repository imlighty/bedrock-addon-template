import { world } from '@minecraft/server'

export const Constants = {
    commandPrefix: '!',
    version: '1.0.0',
}

export const Formatting = {
    colors: {
        black: '§0',
        darkBlue: '§1',
        darkGreen: '§2',
        darkAqua: '§3',
        darkRed: '§4',
        darkPurple: '§5',
        gold: '§6',
        gray: '§7',
        darkGray: '§8',
        blue: '§9',
        green: '§a',
        aqua: '§b',
        red: '§c',
        lightPurple: '§d',
        yellow: '§e',
        white: '§f',
        minecoinGold: '§g',
        materialQuartz: '§h',
        materialIron: '§i',
        materialNetherite: '§j',
        materialRedstone: '§m',
        materialCopper: '§n',
        materialGold: '§p',
        materialEmerald: '§q',
        materialDiamond: '§s',
        materialLapis: '§t',
        materialAmethyst: '§u',
    },
    styles: {
        obfuscated: '§k',
        bold: '§l',
        strikethrough: '§m',
        underline: '§n',
        italic: '§o',
        reset: '§r',
    },
}

for (const beforeEvent in world.beforeEvents) {
    import(`./event/before/${beforeEvent}.js`)
        .then((module) => {
            const event = world.beforeEvents[beforeEvent]
            event.subscribe((event) => module.default(event))
        })
        .catch(() => {})
}

for (const afterEvent in world.afterEvents) {
    import(`./event/after/${afterEvent}.js`)
        .then((module) => {
            const event = world.afterEvents[afterEvent]
            event.subscribe((event) => module.default(event))
        })
        .catch(() => {})
}
