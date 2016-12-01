/**
 * This plugin can and should only be initialize
 *  when Editor.Panel.ready
 *
 * ```js
 *
 *      Plugin = Editor.import([
 *          'packages://', this.id, 'tools', 'plugin.js'
 *      ].join('/'))
 *
 *      plugin = new Plugin(this.id)
 *
 * ```
 *
 */
class Plugin {

    // methods
    constructor (id, Editor) {

        // props
        this._package = null
        this._id      = null
        this._editor  = null

        this._id = id
        this._editor = Editor

        // package won't is not usable all the time.
        Editor.import(this.getPackageUrl('package.json')).then((pkg) => {
            this._package = JSON.parse(pkg)
        })
    }

    get package () {
        return this._package
    }

    getPackageUrl (target) {
        return ["packages:/", this._id, target].join('/')
    }

    import (target) {
        return this.Editor.import(this.getPackageUrl(target))
    }

}

exports = Plugin
