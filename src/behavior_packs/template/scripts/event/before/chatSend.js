import { Constants, Formatting } from '../../main'

/**
 *
 * @param {import('@minecraft/server').ChatSendBeforeEvent} event
 */
export default function (event) {
    if (handleCommand(event.sender, event.message)) return (event.cancel = true)
}

/**
 * Invoked when a player sends a chat message.
 * @param {import('@minecraft/server').Player} player
 * @param {string} message The message sent by the player in chat.
 * @returns {boolean} Whether or not a command was executed.
 */
function handleCommand(player, message) {
    if (!message.startsWith(Constants.commandPrefix)) return false
    const [command, ...args] = parseArguments(message.slice(1))
    /**
     * @param {import('@minecraft/server').Player} player
     * @param {string[]} args
     */
    let toExecute = function (player, args) {
        player.sendMessage(`${Formatting.colors.red}Unknown command: ${command}`)
    }
    import(`../../cmd/${command}.js`)
        .then((module) => {
            toExecute = module.default
        })
        .catch(() => {})
        .finally(() => {
            toExecute(player, args)
        })
    return true
}

/**
 * Parses a string input containing space-separated arguments, accounting for quoted and escaped characters.
 *
 * @param {string} input - The input string containing space-separated arguments.
 * @returns {string[]} An array of parsed arguments.
 */
function parseArguments(input) {
    const output = []
    let quoted = false
    let escaped = false
    let construct = ''
    for (let i = 0, length = input.length; i < length; i++) {
        const character = input[i]
        if (character === ' ' && !quoted) {
            output.push(construct)
            construct = ''
            continue
        }
        if (character === '"' && !escaped) {
            quoted = !quoted
            continue
        }
        if (character === '\\' && !escaped) {
            escaped = true
            continue
        } else {
            escaped = false
        }
        construct = `${construct}${character}`
    }
    output.push(construct)
    return output
}
