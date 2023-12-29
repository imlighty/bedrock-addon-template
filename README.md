# Minecraft Bedrock Edition Add-on Template

This template is provided to help you get started making your own Bedrock Edition add-ons. It's packed with useful features and tools to help you succeed!

## Features

-   **Multi-pack support** - Easily add behavior packs and resource packs and automatically add them in the world's packs list. Server restarting is required for changes to take effect.
-   **Automatic script reloading** - This is achieved by using a Bedrock Dedicated Server and a clever watch script that will automatically reload all the scripts.
-   **Event handler** - Easily handle events such as when a player joins the world by simply adding a file exporting a default function to the `events` folder.

```js
// events/after/playerJoin.js

import { world } from '@minecraft/server'

/**
 * @description This is a function that is called when the event is fired.
 * @param {import('@minecraft/server').PlayerJoinAfterEvent} event
 */
export default function (event) {
    world.sendMessage(`Welcome, ${event.playerName}!`)
}
```

-   **Command handler** - Easily handle commands such as `!version` by simply adding a file exporting a default function to the `cmd` folder.

```js
// cmd/hello.js

/**
 * This is a command that will be executed when the player types the command
 * name in chat.
 * @param {import('@minecraft/server').Player} player
 * @param {string[]} args
 */
export default function (player, args) {
    player.sendMessage(`Hey :D`)
}
```

## Setup and Usage

1. Download and install the latest version of [Visual Studio Code](https://code.visualstudio.com/), as well as the LTS version of [Node.js](https://nodejs.org/en/).
2. Download the latest version of the template from the [releases page](https://github.com/imlighty/bedrock-addon-template/releases).
3. Extract the template to a folder of your choice. Open the folder in Visual Studio Code and feel free to change both the `manifest.json` files in the `behavior_packs` and `resource_packs` folders located in the `src` folder to your liking (for those who know what they're doing, you can also change things like name, description and author in the `package.json` file).
4. Open a terminal in Visual Studio Code and run `npm i -D` to install all the dependencies, including the development dependencies.
5. Run `npm run setup` to download the Bedrock Dedicated Server and set it up properly for use with the template.
6. Run `npm run watch` to start the Bedrock Dedicated Server and watch for changes in the `src` folder. This will also automatically reload all the scripts when a change is detected.
7. You're all set!

## Updating

There's two ways you can update the template:

-   **Dependency update** - If you only want to update the dependencies of your project, just run `npm run update`. Recommended to those people who don't want to change a lot about the template.
-   **Full update** (recommended) - To update the template tools, run `npm run upgrade`, that will run the dependency update script as well. Recommended to those who want to keep the template up to date with the project.
