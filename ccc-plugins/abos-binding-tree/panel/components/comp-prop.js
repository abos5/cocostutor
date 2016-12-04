



exports = {
    props: {
        prop: Object,
        source: Object,
    },
    data () {
        this.$set('prop.display', true)
        this.$set('prop.matched', false)
        this.$set('prop.matchBy', [this.prop.name,'<',this.prop.type,'>'].join('').toLowerCase())

        this.prop.excluded = this.source.typeExcludes.indexOf(this.prop.type) > -1
        return {

        }
    },
    watch: {
        'source.typeExcludes': {
            handler() {
                this.prop.excluded = this.source.typeExcludes.indexOf(this.prop.type) > -1
            }
        }
    },
    methods: {

    },
}