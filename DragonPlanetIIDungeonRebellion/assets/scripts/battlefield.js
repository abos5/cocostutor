cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        speed: 0.00,
        cameraCanvas: {
            type: cc.Canvas,
            default: null,
        },
        mainstreetNode: {
            type: cc.Node,
            default: null,
        },
        heroPrefab: {
            type: cc.Prefab,
            default: null,
        }
    },

    // use this for initialization
    onLoad: function () {
        console.log(this)
        let heroNode = cc.instantiate(this.heroPrefab)
        let pos      = heroNode.getPosition()
        let follow   = cc.follow(heroNode)

        this._heroNode = heroNode
        this.mainstreetNode.addChild(heroNode)
        heroNode.setPosition(this.node.getPosition())
        heroNode.enable = 1
        this.cameraCanvas.node.runAction(follow)
        this.cameraCanvas.node.setPosition(pos)
        console.log(pos, follow)
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // let newPos = cc.p(this.node.x + this.speed, this.node.y + this.speed)
        // let newPos = cc.p(this.node.x - this.speed, this.node.y - this.speed)
        // this.node.setPosition(newPos)
        // this.node.convertToWorldSpaceAr;
        // cc.log(this.node.x, this.speed, newPos)
        let pos = this._heroNode.getPosition()
        let newPos = cc.p(pos.x - 1, pos.y - 1)
        // console.log(pos, newPos)
        this._heroNode.setPosition(newPos)
    },
});
