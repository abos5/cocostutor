// panel/index.js

const fs = require('fs')
const packageName = 'hello-abos'
const encoding = 'utf8'
const PATH = {
    html: Editor.url('packages://hello-abos/panel/index.html'),
    nodeTemplate: Editor.url('packages://hello-abos/panel/node-template.html'),
    style: Editor.url('packages://hello-abos/panel/less.css')
}


Editor.Panel.extend({
    style: fs.readFileSync(PATH.style, encoding),
    template: fs.readFileSync(PATH.html, encoding),
    customProps: {
        nodeTemplate: fs.readFileSync(PATH.nodeTemplate, encoding)
    },
    ready () {
        console.log('panel ready')
        Vue.component('node', {
            template: this.customProps.nodeTemplate,
            props: {
                hierarchy: Object,
            },
            data () {
                return {
                    open: false
                }
            },
            init () {
                // console.log('compo inited', this.hierarchy.name)
                // if (! this.hierarchy.id) {
                //     return
                // }
                // Editor.Ipc.sendToPanel('scene', 'scene:query-node-info', 'this.hierarchy.id', 'cc.Node', (error, info) => {
                //     if (error)
                //         return Editor.error(error);
                //     // info
                //     console.log(info)
                // });
            },
            computed: {
                isFolder () {
                    return this.hierarchy.children && this.hierarchy.children.length
                }
            },
            methods: {
                toggle () {
                    if (this.isFolder) {
                        this.open = !this.open
                    }
                },
                displayBindding () {
                    if (!this.hierarchy || this.hierarchy.info) {
                        return
                    }
                    if (!this.hierarchy.id) {
                        return
                    }
                    let self = this
                    Editor.Ipc.sendToPanel('scene', 'scene:query-node-info', this.hierarchy.id, 'cc.Node', (error, info) => {
                        if (error)
                            return Editor.error(error);
                        // info
                        self.hierarchy.info = info
                        console.log(info)
                    });

                    Editor.Ipc.sendToPanel('scene', 'scene:query-node', this.hierarchy.id, (error, dump) => {
                        if (error)
                            return Editor.error(error);
                        node = JSON.parse(dump);
                        self.hierarchy.node = node
                        console.log(node)
                    });

                },
                getFireList () {
                    return this.source.fires
                },
                parseFire() {
                    let path = [Editor.projectInfo.path, '/assets/', this.source.fire,'.fire'].join('')
                    let fire = Editor.Ipc.sendToMain('hello-abos:refreshSceneFires', path)
                },
                sendToMain(index) {
                    let message = this.Ipc.messages[index].name
                    message     = ['hello-abos', message].join(':')
                    let rsp = Editor.Ipc.sendToMain(message, this.source, ...arguments)
                    Editor.log(rsp)
                }
            }
        })
        const vform = new window.Vue({
            el: this.shadowRoot,
            data: {
                hierarchy: {
                    name: 'top',
                    children: null,
                },
                initManually () {
                    console.log('inited')
                    let self = this
                    Editor.Ipc.sendToPanel('scene', 'scene:query-hierarchy', (error, sceneID, hierarchy) => {
                        if (error)
                            return Editor.error(error);
                        // hierarchy
                        self.hierarchy.children = hierarchy
                        console.log(self.hierarchy)
                    });
                },
                source: {
                    fire: 'PlayGame',
                    fires: []
                },
                Ipc: {
                    messages : [
                        {name: 'refreshSceneFires'}
                    ],
                }
            },
        })
        window.exp = {
            vform
        }
        vform.initManually()
//   this.$btn.addEventListener('confirm', () => {
//     Editor.Ipc.sendToMain('simple-package:say-hello', 'Hello, this is simple panel');
//   });
    },
});