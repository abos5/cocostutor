




exports = {
    props: {
        comp:   Object,
        source: Object,
    },
    data () {
        let props   = []
        let matchBy = this.comp.value.name.value.toLowerCase()
        if (matchBy.includes('<')) {
            matchBy = matchBy.slice(matchBy.indexOf('<'))
        }

        this.$set('comp.display', true)
        this.$set('comp.matched', false)
        this.$set('comp.props', props)
        this.$set('comp.matchBy', matchBy)
        let propExcludes = [
            '_name',
            '_objFlags',
            'node',
            'name',
            '_id',
            'uuid',
            '__scriptAsset',
            '_enabled',
            'enabled',
            'enabledInHierarchy',
            '_isOnLoadCalled',
            'display',
            'matched',
            'matchBy',
            'type',
            'value',
        ]

        for (let prop in this.comp.value) {
            if (propExcludes.includes(prop)) {
                continue
            }
            let value = this.comp.value[prop]
            props.push({
                name: prop,
                type: value.type,
                excluded: false,
                // comp: this.comp
            })
        }
        return {
        }
    },
    methods: {
    },
}


