// Download the repository (https://github.com/imlighty/bedrock-addon-template/releases) and extract its tools folder
// after deleting the existing tools folder in your project.

// Path: tools/update_deps.js

import path from 'path'
import fs from 'fs'
import ProgressBar from 'progress'
import https from 'https'
import extract from 'extract-zip'
import fse from 'fs-extra'
import { pathToFileURL } from 'url'

const loadJSON = (path) => JSON.parse(fs.readFileSync(pathToFileURL(path)))

const bar = new ProgressBar('[:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 100,
})

const link = 'https://codeload.github.com/imlighty/bedrock-addon-template/zip/refs/heads/main'

const zip = fs.createWriteStream(path.join(process.cwd(), 'template.zip'))

https.get(link, (res) => {
    res.pipe(zip)
    res.on('data', (chunk) => {
        bar.tick((chunk.length / res.headers['content-length']) * 100)
    })
    res.on('end', () => {
        zip.close()

        extract(path.join(process.cwd(), 'template.zip'), { dir: process.cwd() }).then(() => {
            fs.unlinkSync(path.join(process.cwd(), 'template.zip'))
            fs.rm(path.join(process.cwd(), 'template.zip'), () => {})

            fs.rm(path.join(process.cwd(), 'tools'), { recursive: true, force: true }, () => {
                fse.moveSync(
                    path.join(process.cwd(), 'bedrock-addon-template-main', 'tools'),
                    path.join(process.cwd(), 'tools')
                )

                fs.rm(path.join(process.cwd(), 'bedrock-addon-template-main'), { recursive: true, force: true }, () => {
                    console.log('Updated tools')
                })
            })
        })
    })
})
