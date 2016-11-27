'use strict';

const fs       = require('fs')
const path     = require('path')
const encoding = 'utf8'
const collect = []

function scanSceneFires (root) {
    fs.readdir(root, findSceneFires.bind(null, root))
}

function findSceneFires (root, err, files) {
    if (err) throw err
    files.map((file, index) => {
        let filepath = [root, file].join(path.sep)

        if (file.indexOf('.') === 0) {
            return false
        }
        if (file.length < 5 ){
            return false
        }
        if (file.lastIndexOf('.fire') === (file.length-5)) {
            fs.readFile(filepath, encoding, (err, data) => {
                let fire = {name: file, filepath, content: JSON.parse(data)}
                collect.push(fire)
            })
            return true
        }

        fs.stat(filepath, (err, stats) => {
            if (err) throw err
            if (stats.isDirectory()) {
                scanSceneFires(filepath)
            }
        })
        return false
    })
}

module.exports = {
    load () {
        // 当 package 被正确加载的时候执行
    },

    unload () {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        refreshSceneFires(event) {
            let root = [Editor.projectInfo.path, 'assets'].join(path.sep)
            collect.splice(0, collect.length)
            scanSceneFires(root)
            Editor.log(event)
            Editor.Ipc.sendToPanel('hello-abos', 'hehe', JSON.stringify(collect))
        },
        sayHello () {
            Editor.log("Hello Abos, aren't u awesome!");
        },
        openBindingTreeView () {
            Editor.Panel.open('hello-abos')
        },
        parseFire(event, path, third) {
            Editor.log(third)
            if (! fs.existsSync(path)) {
                    Editor.log(['Invalid fire file: ', path].join(''))
            }
            let fire = fs.readFileSync(path)
            fire = JSON.parse(fire)
            if (! fire) {
                    Editor.log(fire, path)
            }
            Editor.log("compile success")
            Editor.log(fire)
            return fire
        }
    },
};