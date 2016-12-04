/**
 * This plugin can and should only be initialize
 *  when Editor.Panel.ready
 *
 */
class Plugin {

    // methods
    /**
     * @return Promise
     */
    constructor (id, Editor) {

        // instantly register a global access
        window.aplugin = this

        // props
        this._pkg     = null
        this._id      = id
        this._editor  = Editor
        this.exp      = {}
        this.res      = {}

        return this.init()
    }

    /**
     * 直接占用 windows 全局空间
     * @return Promise
     */
    init () {
        return this.import('package.json')
            // parse project configuration
            .then((pkg) => {
                this._pkg = JSON.parse(pkg)
            })
            // loading all resources before register Vue components
            .then(() => Promise.all(this.pkg.abosPlugin.resources.map((path) => this.import(path.path)
                .then((data) => {
                    this.res[path.name] = data
                })
            )))
            // register Vue components
            .then(() => Promise.all(this.pkg.abosPlugin.vue.resources.map((path) => this.debug('begin loading:', path.name)
                .import(path.js)
                .then((js) => {
                    path.compo = js
                    return this.import(path.html)
                })
                .then((html) => {
                    path.compo.template = html
                    return Vue.component(path.name, path.compo)
                })
            )))
            // just making sure all resources are ready
            // and make sure this is that response last
            .then(() => {
                this.debug('done initialization, begin return Promise')
                return this
            })
    }

    get pkg () {
        return this._pkg
    }

    get editor () {
        return this._editor
    }

    getPkgUrl (target) {
        return ["packages:/", this._id, target].join('/')
    }

    /**
     * simple import
     * if more return data required
     * please wrap it in another method
     */
    import (target) {
        return this.editor.import(this.getPkgUrl(target))
    }

    log() {
        console.log(this.pkg.name, ...arguments)
        return this
    }

    warning() {
        console.warn(this.pkg.name, ...arguments)
        return this
    }

    info() {
        console.info(this.pkg.name, ...arguments)
        return this
    }

    debug() {
        console.debug(this.pkg.name, ...arguments)
        return this
    }

    trace() {
        console.trace(this.pkg.name, ...arguments)
        return this
    }

}


exports = Plugin
