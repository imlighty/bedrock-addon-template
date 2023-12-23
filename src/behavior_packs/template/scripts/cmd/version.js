import { Constants } from '../main'

/**
 * This is a command that will be executed when the player types the command
 * name in chat.
 * @param {import('@minecraft/server').Player} player
 * @param {string[]} args
 */
export default function (player, args) {
    player.sendMessage(`Template Add-on v${Constants.version}`)
}
