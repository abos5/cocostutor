// panel/index.js

const Fs = require('fs')
const packageName = 'hello-abos'
const PATH = {
    html: Editor.url('packages://hello-abos/panel/index.html'),
    style: Editor.url('packages://hello-abos/panel/less.css')
}



Editor.Panel.extend({
    style: Fs.readFileSync(PATH.style),
    template: Fs.readFileSync(PATH.html),
    ready () {
        new window.Vue({
            el: this.shadowRoot,
            data: {
                source: {
                    fire: 'Game'
                },
                items: [
                    {name: 'heyhey'},
                    {name: 'yoxi'},
                ]
            },
            methods: {
                parseFire() {
                    let path = [Editor.projectInfo.path, '/', this.source.fire,'.fire'].join('')
                    let fire = Editor.Ipc.sendToMain('hello-abos:parseFire', path)
                    console.log(fire)
                }
            }
        })
//   this.$btn.addEventListener('confirm', () => {
//     Editor.Ipc.sendToMain('simple-package:say-hello', 'Hello, this is simple panel');
//   });
    },
});