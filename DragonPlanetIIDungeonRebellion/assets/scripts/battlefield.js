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
        },
        speedX: 5,
        speedY: 5,
    },

    // use this for initialization
    onLoad () {
        cc.gl.game = this
        let heroNode = cc.instantiate(this.heroPrefab),
             pos     = heroNode.getPosition(),
             follow  = cc.follow(heroNode)

        this._minX = 60
        this._maxX = 480
        this._maxY = 720
        this._minY = 240
        this._heroNode = heroNode
        this._autoMove = false
        // this.node.scaleX = cc.game.canvas.width / this.cameraCanvas.node.width
        // this.node.scaleY = cc.game.canvas.height / this.cameraCanvas.node.height
        this.mainstreetNode.addChild(heroNode)

        heroNode.enable = 1
        heroNode.setPosition(cc.p(0, 0))
    },

    moveArround () {
        this.moveToLeftBottom()
        this.moveToLeftTop()
        this.moveToRightBottom()
        this.moveToRightTop()
    },

    moveToLeftBottom () {
        this._move(1, cc.p(this._minX, this._minY))
    },

    moveToLeftTop () {
        this._move(1, cc.p(this._minX, this._maxY))
    },

    moveToRightBottom () {
        this._move(1, cc.p(this._maxX, this._minY))
    },

    moveToRightTop () {
        this._move(1, cc.p(this._maxX, this._maxY))
    },

    _move (duration, pos) {
        let action = cc.moveTo(duration, pos).easing(cc.easeCubicActionOut())
        console.log(action)
        // this.node.stopAllActions()
        this.node.runAction(cc.sequence(action))
    },

    // called every frame, uncomment this function to activate update callback
    update (dt) {

        if (! this._autoMove) {
            return
        }

        let pos = this.node.getPosition()

        if (pos.x+this.speedX > this._maxX) {
            this.speedX = Math.abs(this.speedX) * -1
        } else if (pos.x+this.speedX < this._minX) {
            this.speedX = Math.abs(this.speedX) * 1
        }


        if (pos.y+this.speedY > this._maxY) {
            this.speedY = Math.abs(this.speedY) * -1
        } else if (pos.y+this.speedY < this._minY) {
            this.speedY = Math.abs(this.speedY) * 1
        }

        let newPos = cc.p(
            pos.x+this.speedX,
            pos.y+this.speedY
        )
        this.node.setPosition(newPos)

        // let newPos = cc.p(this.node.x + this.speed, this.node.y + this.speed)
        // let newPos = cc.p(this.node.x - this.speed, this.node.y - this.speed)
        // this.node.setPosition(newPos)
        // this.node.convertToWorldSpaceAr;
        // cc.log(this.node.x, this.speed, newPos)

    },
});
