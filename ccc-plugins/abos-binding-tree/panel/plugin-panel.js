

function findProp(search, prop, index) {
    prop.matched = false
    // prop level
    prop.display = prop.matchBy.includes(search)
    prop.matched = true
    return prop.display
}

function findComp(search, comp, index) {
    comp.matched = false
    if (! comp.props) {
        // because some comp is ignored, so won't have the props property'
        // filter by plugin-panle.displayComp method
        return false
    }

    let found = comp.props.map(findProp.bind(null, search))

    if (comp.matchBy.includes(search)) {
        comp.display = true
        comp.matched = true
    } else {
        comp.display = found.includes(true)
    }

    return comp.display
}

function findHierarchy(search, hierarchy, index) {

    let foundHierarchy = []
    let foundComp      = []
    hierarchy.display = false

    // hierarchy level, hierarchy don't do search
    // hierarchy just hide when no matched in sub hierarchys
    if (hierarchy.children) {
        foundHierarchy = hierarchy.children.map(findHierarchy.bind(null, search))
    }

    // comp level
    foundComp = hierarchy.node.value.__comps__.map(findComp.bind(null, search))

    hierarchy.display = foundHierarchy.includes(true) || foundComp.includes(true)

    return hierarchy.display
}

function clearSearch(hierarchy) {
    hierarchy.display = true
    hierarchy.node.value.__comps__.map((comp) => {
        if (! comp.props) {
            return false
        }
        comp.display = true
        comp.matched = false
        comp.props.map((prop) => {
            prop.display = true
            prop.matched = false
        })
    })

    // recusive at the bottom, display layer by layer, top to bottom
    if (hierarchy.children) {
        hierarchy.children.map(clearSearch)
    }
}

exports = {
    data () {
        let hierarchy = {
            name: 'name',
            children: [],
        }
        this.initManually()
        return {
            hierarchy: hierarchy,
            showExclude: false,
            source: {
                search: '',
                showComp: true,
                showProp: true,
                typeExcludes: [
                    "Float",
                    "Boolean",
                    "cc.Node",
                    "cc.Color",
                    "cc.SpriteFrame",
                    "cc.Label",
                    "cc.Sprite",
                    "cc.Size",
                    // ""
                ],
                typeToExcludes: [
                    "Enum",
                    "cc.ClickEvent",
                    "Object",
                    "cc.Vec2",
                    "cc.ParticleAsset",
                    "cc.Texture2D",
                    "cc.ParticleSystem",
                    "Animation",
                    "cc.AnimationClip",
                    "cc.Button",
                    "cc.ProgressBar",
                ],
            },
        }
    },
    watch: {
        'source.search': {
            handler (val, oldVal) {

                // if search is empty, set everything.display = true
                if (! val || ! val.length) {
                    this.hierarchy.children.map(clearSearch)
                    return
                }
                let search = ['<', val].join('').toLowerCase()
                this.hierarchy.children.map(findHierarchy.bind(null, search))
            },
        }
    },
    computed: {
        compTypes() {
            let l = []
            l.push(...this.source.typeExcludes,...this.source.typeToExcludes)

            return l.sort()
        }
    },
    // init works, but called before vue is ready
    init () {
    },
    attached() {
        console.log('attached')
    },
    methods: {
        toggleTypeExclude(type) {
            let indexExcluded = this.source.typeExcludes.indexOf(type)
            let indexIncluded = this.source.typeToExcludes.indexOf(type)
            if (indexExcluded < 0 && indexIncluded < 0) {
                aplugin.trace(["error toggleTypeExclude, invalid type", type].join())
                return
            }
            if (indexExcluded > -1) {
                this.source.typeExcludes.splice(indexExcluded, 1)
                this.source.typeToExcludes.push(type)
            } else {
                this.source.typeToExcludes.splice(indexIncluded, 1)
                this.source.typeExcludes.push(type)
            }
        },
        toggleFoldComp() {
            this.source.showComp = !this.source.showComp
        },
        toggleFoldProp() {
            this.source.showProp = !this.source.showProp
            if (! this.source.showProp) {
                this.source.showComp = false
            }
        },
        initManually() {
            aplugin.editor.Ipc.sendToPanel('scene', 'scene:query-hierarchy', (error, sceneID, sceneHierarchy) => {
                if (error)
                    return aplugin.editor.error(error);
                // set hierarchy
                // and send it to components
                this.hierarchy.children = sceneHierarchy
                aplugin.trace(sceneHierarchy)
            });
        }
    }
}
