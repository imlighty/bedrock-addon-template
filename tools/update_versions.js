// update the "dependencies" section of package.json to use the versions from "https://raw.githubusercontent.com/imlighty/bedrock-addon-template/main/package.json"

import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'

const loadJSON = (path) => JSON.parse(fs.readFileSync(pathToFileURL(path)))

await fetch('https://raw.githubusercontent.com/imlighty/bedrock-addon-template/main/package.json')
    .then((res) => res.json())
    .then((json) => {
        const packageJson = loadJSON(path.join(process.cwd(), 'package.json'))
        packageJson.dependencies = json.dependencies
        fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(packageJson, null, 2))
        console.log('Updated package.json')
    })

await fetch('https://raw.githubusercontent.com/imlighty/bedrock-addon-template/main/tools/data.json')
    .then((res) => res.json())
    .then((json) => {
        const dataJson = loadJSON(path.join(process.cwd(), 'tools', 'data.json'))
        dataJson.dependencies = json.dependencies
        fs.writeFileSync(path.join(process.cwd(), 'tools', 'data.json'), JSON.stringify(dataJson, null, 4))
        console.log('Updated data.json')
    })

const manifestDependencies = loadJSON(path.join(process.cwd(), 'tools', 'data.json')).dependencies

fs.readdirSync(path.join(process.cwd(), 'src', 'behavior_packs')).forEach((folder) => {
    // If the folder is a folder
    if (fs.statSync(path.join(process.cwd(), 'src', 'behavior_packs', folder)).isDirectory()) {
        // Add the folder to the list of behavior packs
        const manifest = loadJSON(path.join(process.cwd(), 'src', 'behavior_packs', folder, 'manifest.json'))
        manifest.dependencies.forEach((dependency) => {
            if (Object.keys(manifestDependencies).includes(dependency.module_name)) {
                dependency.version = manifestDependencies[dependency.module_name]
            }
        })
        fs.writeFileSync(
            path.join(process.cwd(), 'src', 'behavior_packs', folder, 'manifest.json'),
            JSON.stringify(manifest, null, 4)
        )
        console.log('Updated manifest.json for ' + folder)
    }
})
