/**
 */
let aplugin  = window.aplugin


exports = {
    props: {
        hierarchy: Object,
        source: Object,
    },
    data () {
        this.$set('hierarchy.display', true)
        this.$set('hierarchy.node', {
            value: { // pre define to make sure columns exists
                __comps__: [],
            }
        })
        aplugin.editor.Ipc.sendToPanel('scene', 'scene:query-node', this.hierarchy.id, (error, dump) => {
            if (error)
                return Editor.error(error);

            this.hierarchy.node = JSON.parse(dump)
        });
        return {
            open: true,
            display: true,
            matched: false,
            nodeInited: false,
        }
    },
    computed: {
        isFolder () {
            return this.hierarchy.children && this.hierarchy.children.length
        },
    },
    methods: {
        toggle () {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        displayComp (comp) {
            let ex       = aplugin.pkg.abosPlugin.comp_exclude
            let excluded = true

            if (!ex || !ex.length) {
                return true
            }
            for (let reg of ex) {
                excluded = RegExp(reg).test(comp.value.name.value)
                if (excluded) {
                    return false
                }
            }
            return true
        }
    }
}

