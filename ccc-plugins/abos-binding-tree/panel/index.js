// panel/index.js
/**
 * @file panel/index.js
 * interface of panel html
 * because this file mxied two enviroment,
 * so it's best not to put too many codes here.
 */
Editor.Panel.extend({
    // put css codes in plugin-panel instead
    style: '',
    // fixed style, normally this will suffice
    template: '<plugin-panel ></plugin-panel>',
    // ipc
    messages: {
    },
    // while panel is ready to run our custom codes
    ready () {
        Editor.import(['packages:/', this.id, 'tools', 'plugin.js'].join('/'))
        .then((Plugin) => {
            return new Plugin(this.id, Editor)
        })
        .then((promise) => {
            new Vue({
                el: this.shadowRoot,
            })
        }) // end then
    },
});
