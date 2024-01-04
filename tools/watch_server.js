import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import process from 'node:process'
import fse from 'fs-extra'
import readline from 'readline'
import { pathToFileURL } from 'url'

const loadJSON = (path) => JSON.parse(fs.readFileSync(pathToFileURL(path)))

function generateJsonFiles() {
    let behaviorPacks = []
    let resourcePacks = []
    fs.readdirSync(path.join(process.cwd(), 'src', 'behavior_packs')).forEach((folder) => {
        // If the folder is a folder
        if (fs.statSync(path.join(process.cwd(), 'src', 'behavior_packs', folder)).isDirectory()) {
            // Add the folder to the list of behavior packs
            const manifest = loadJSON(path.join(process.cwd(), 'src', 'behavior_packs', folder, 'manifest.json'))
            behaviorPacks.push({
                pack_id: manifest.header.uuid,
                version: manifest.header.version,
            })
        }
    })
    if (
        fs.existsSync(path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_behavior_packs.json'))
    ) {
        fs.unlinkSync(path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_behavior_packs.json'))
    }
    fs.writeFileSync(
        path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_behavior_packs.json'),
        JSON.stringify(behaviorPacks)
    )
    fs.readdirSync(path.join(process.cwd(), 'src', 'resource_packs')).forEach((folder) => {
        // If the folder is a folder
        if (fs.statSync(path.join(process.cwd(), 'src', 'resource_packs', folder)).isDirectory()) {
            // Add the folder to the list of resource packs
            const manifest = loadJSON(path.join(process.cwd(), 'src', 'resource_packs', folder, 'manifest.json'))
            resourcePacks.push({
                pack_id: manifest.header.uuid,
                version: manifest.header.version,
            })
        }
    })
    if (
        fs.existsSync(path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_resource_packs.json'))
    ) {
        fs.unlinkSync(path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_resource_packs.json'))
    }
    fs.writeFileSync(
        path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'world_resource_packs.json'),
        JSON.stringify(resourcePacks)
    )
}

function copyPacks() {
    // Copy the behavior packs in the server/development_behavior_packs folder
    if (fs.existsSync(path.join(process.cwd(), 'server', 'development_behavior_packs'))) {
        fs.rmSync(path.join(process.cwd(), 'server', 'development_behavior_packs'), { recursive: true })
    }
    fs.mkdirSync(path.join(process.cwd(), 'server', 'development_behavior_packs'), { recursive: true })
    fs.readdirSync(path.join(process.cwd(), 'src', 'behavior_packs')).forEach((folder) => {
        // If the folder is a folder
        if (fs.statSync(path.join(process.cwd(), 'src', 'behavior_packs', folder)).isDirectory()) {
            // Copy the folder to the server/development_behavior_packs folder
            fse.copySync(
                path.join(process.cwd(), 'src', 'behavior_packs', folder),
                path.join(process.cwd(), 'server', 'development_behavior_packs', folder)
            )
        }
    })
    // Copy the resource packs in the server/development_resource_packs folder
    if (fs.existsSync(path.join(process.cwd(), 'server', 'development_resource_packs'))) {
        fs.rmSync(path.join(process.cwd(), 'server', 'development_resource_packs'), { recursive: true })
    }
    fs.mkdirSync(path.join(process.cwd(), 'server', 'development_resource_packs'), { recursive: true })
    fs.readdirSync(path.join(process.cwd(), 'src', 'resource_packs')).forEach((folder) => {
        // If the folder is a folder
        if (fs.statSync(path.join(process.cwd(), 'src', 'resource_packs', folder)).isDirectory()) {
            // Copy the folder to the server/development_resource_packs folder
            fse.copySync(
                path.join(process.cwd(), 'src', 'resource_packs', folder),
                path.join(process.cwd(), 'server', 'development_resource_packs', folder)
            )
        }
    })
}

let ready = false

generateJsonFiles()
copyPacks()

chokidar.watch(path.join(process.cwd(), 'src')).on('all', (event, pathStr) => {
    if (!ready) return
    if (event === 'addDir' || event === 'unlinkDir') {
        try {
            reloadPacks()
        } catch (e) {
            console.error(e)
        }
    }
    if (event === 'add' || event === 'change' || event === 'unlink') {
        if (pathStr.startsWith(path.join(process.cwd(), 'src', 'behavior_packs'))) {
            try {
                reloadPacks()
            } catch (e) {
                console.error(e)
            }
        }
        if (pathStr.startsWith(path.join(process.cwd(), 'src', 'resource_packs'))) {
            try {
                reloadPacks()
            } catch (e) {
                console.error(e)
            }
        }
    }
})

function reloadPacks() {
    generateJsonFiles()
    copyPacks()
    if (ready) {
        server.stdin.write('reload\n')
    }
}

// Create a process that starts the server in the server folder
import { spawn } from 'child_process'
let executable = 'bedrock_server'
if (process.platform === 'win32') {
    executable = 'bedrock_server.exe'
}
const server = spawn(path.join(process.cwd(), 'server', executable), [''], {
    cwd: path.join(process.cwd(), 'server'),
    stdio: process.platform === 'win32' ? 'overlapped' : 'pipe',
})

server.stdout.setEncoding('utf8')

server.stdout.on('data', (data) => {
    if (data.toString().includes('Quit correctly')) {
        console.log('Quit correctly')
        process.exit()
    }
    if (data.toString().includes('started.')) {
        ready = true
    }
    process.stdout.write(data)
})

server.stderr.on('data', (data) => {
    process.stderr.write(data)
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '',
})
rl.on('line', (input) => {
    if (ready) server.stdin.write(input + '\n')
})
