import path from 'path'
import fs from 'fs'
import ProgressBar from 'progress'
import https from 'https'
import extract from 'extract-zip'
import { pathToFileURL } from 'url'

const loadJSON = (path) => JSON.parse(fs.readFileSync(pathToFileURL(path)))

const version = loadJSON(path.join(process.cwd(), 'tools', 'data.json')).server_version

if (fs.existsSync(path.join(process.cwd(), 'server'))) {
    fs.rm(path.join(process.cwd(), 'server'), { recursive: true, force: true }, () => {
        fs.mkdir(path.join(process.cwd(), 'server'), () => {})
    })
}

console.log('Getting the correct download link for BDS ' + version + '...')
let link = 'https://minecraft.azureedge.net/bin-linux/bedrock-server-' + version + '.zip'
if (process.platform === 'win32') {
    link = 'https://minecraft.azureedge.net/bin-win/bedrock-server-' + version + '.zip'
}

console.log('Downloading server...')
const bar = new ProgressBar('[:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 100,
})
const zip = fs.createWriteStream(path.join(process.cwd(), 'server.zip'))
https.get(link, function (response) {
    response.pipe(zip)
    response.on('data', function (chunk) {
        bar.tick((chunk.length / response.headers['content-length']) * 100)
    })
    response.on('end', function () {
        zip.close()

        console.log('\nExtracting server...')
        extract(path.join(process.cwd(), 'server.zip'), { dir: path.join(process.cwd(), 'server') }).then(() => {
            fs.unlinkSync(path.join(process.cwd(), 'server.zip'))
            fs.rm(path.join(process.cwd(), 'server.zip'), () => {})

            // Change the values in server.properties
            console.log('Changing values in server.properties...')
            const properties = fs
                .readFileSync(path.join(process.cwd(), 'server', 'server.properties'))
                .toString()
                .split('\n')
            properties.forEach((line, index) => {
                // Change server-name
                if (line.startsWith('server-name')) {
                    properties[index] = 'server-name=Add-on Testing'
                }
                if (line.startsWith('difficulty')) {
                    properties[index] = 'difficulty=normal'
                }
                if (line.startsWith('allow-cheats')) {
                    properties[index] = 'allow-cheats=true'
                }
                if (line.startsWith('level-name')) {
                    properties[index] = 'level-name=Development Server'
                }
            })
            fs.writeFileSync(path.join(process.cwd(), 'server', 'server.properties'), properties.join('\n'))

            // Copy level.dat_old as level.dat in the world folder
            console.log('Copying level.dat_old...')
            fs.mkdirSync(path.join(process.cwd(), 'server', 'worlds', 'Development Server'), { recursive: true })
            fs.copyFileSync(
                path.join(process.cwd(), 'tools', 'assets', 'level.dat_old'),
                path.join(process.cwd(), 'server', 'worlds', 'Development Server', 'level.dat')
            )

            console.log('Done!')
        })
    })
})
