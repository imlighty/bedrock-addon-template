import { EntityInitializationCause, world } from '@minecraft/server'

/**
 *
 * @param {import('@minecraft/server').EntitySpawnAfterEvent} event
 */
export default function (event) {
    if (event.cause === EntityInitializationCause.Spawned) {
        world.sendMessage(`An entity of type ${event.entity.typeId} spawned!`)
    }
}
