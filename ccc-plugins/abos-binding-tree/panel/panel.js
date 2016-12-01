// panel/index.js

const fs       = require('fs')
const encoding = 'utf8'
const PATH     = {
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

    // ipc
    messages: {

    },
    ready () {

        let path = ['packages:/', this.id, 'tools', 'plugin.js'].join('/')

        Editor.import(path).then((Plugin) => {
            return new Plugin(this.id, Editor)
        })
        // .then((plugin) => {
        //     console.log(plugin)
        // })
        .then(function() {
            console.log(arguments)
        })



        Vue.component('node', {
            template: this.customProps.nodeTemplate,
            props: {
                hierarchy: Object,
                source: Object,
                Ipc: Object,
            },
            data () {
                return {
                    open: true,
                    display: true,
                    matched: false,
                    nodeInited: false,
                }
            },
            init () { // not working
            },
            ready() { // not working
            },
            watch: {
                'source.search' (val, oldVal) { //working
                    this.matched = false

                    // 也许还没有被实例化
                    if (!this.hierarchy || !this.hierarchy.id) {
                        return
                    }

                    // 由于 这里 ready 和 init 都不能用 需要在 watch 里初始化节点
                    if (! this.nodeInited) {
                        this.nodeInited = true
                        this.initNode()
                    }

                    if (! this.hierarchy.node) {
                        return
                    }
                    // 如果新值为空， 则不需要继续找了
                    if (! val.length) {
                        this.matched = false
                        this.display = true
                        return true
                    }

                    let __comps__ = this.hierarchy.node.value.__comps__

                    // 如果没有自定义组件， 则没有匹配
                    if (! __comps__ || ! __comps__.length) {
                        this.matched = false
                        this.display = this.isFolder || false
                        return true
                    }

                    __comps__.map((item, index) => {
                        if (this.matched) {
                            return true
                        }
                        // search begin from left, right blur
                        let name   = item.value.name.value.toUpperCase()
                        let search = ['<',this.source.search].join('').toUpperCase()
                        if (name.indexOf(search) > -1) {
                            console.log(name, search)
                            this.matched = true
                        }
                    })
                    this.display = this.isFolder || this.matched
                    return true
                },
            },
            computed: {
                isFolder () {
                    return this.hierarchy.children && this.hierarchy.children.length
                },
            },
            methods: {
                initNode () {
                    Editor.Ipc.sendToPanel('scene', 'scene:query-node', this.hierarchy.id, (error, dump) => {
                        if (error)
                            return Editor.error(error);
                        node = JSON.parse(dump);
                        this.hierarchy.node = node
                    });
                },
                logNode () {
                    console.log(this.hierarchy.node)
                },
                toggle () {
                    if (this.isFolder) {
                        this.open = !this.open
                    }
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
        const vform = new Vue({
            el: this.shadowRoot,
            data: {
                hierarchy: {
                    name: 'top',
                    children: null,
                },
                source: {
                    fire: 'PlayGame',
                    fires: [],
                    search: '',
                },
                Ipc: {
                    messages : [
                        {name: 'refreshSceneFires'}
                    ],
                }
            },
            ready() {
                console.log("amazing! ready works.")
            },
            methods: {
                initManually () {
                    Editor.Ipc.sendToPanel('scene', 'scene:query-hierarchy', (error, sceneID, hierarchy) => {
                        if (error)
                            return Editor.error(error);
                        // set hierarchy
                        // and send it to components
                        this.hierarchy.children = hierarchy
                    });
                },
            }
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