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

        jumpHeight: 240,
        jumpDuration: 1.1,
        squashDuration: 0.2,
        strech0Duration: 0.2,
        strech1Duration: 0.5,
        scaleBackDuration: 0.4,
        maxMoveSpeed: 12,
        accel: 5, // 速度的增加操作应该放在 update 里， 放在 update 里的动作自然就一帧帧地增长了.

        // 跳跃音效
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad () {
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 获取墙的位置, 通过canvas的宽度
        this.maxX = this.node.parent.width/2 - this.node.width/2;
        // 初始化键盘输入监听
        this.setInputControl();
        this.jumpAction = this.setJumpAction()
    },
    onStartGame () {
        this.node.runAction(this.jumpAction);
    },
    onStopGame () {
        // this.xSpeed = 0
        this.accLeft = false
        this.accRight = false
        this.node.stopAllActions();
    },
    setJumpAction () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 形变
        var squash = cc.scaleTo(this.squashDuration, 1, 0.4)
        var strech0 = cc.scaleTo(this.strech0Duration, 1, 1.3)
        var strech1 = cc.scaleTo(this.strech1Duration, 1, 1.5)
        var scaleBack = cc.scaleTo(this.scaleBackDuration, 1, 1)
        var callback = cc.callFunc(this.playJumpSound, this)
        // 不断重复
        return cc.repeatForever(cc.sequence(
            cc.sequence(squash, strech0, cc.spawn(cc.sequence(strech1, scaleBack), jumpUp)),
            jumpDown,
            callback
        ));
    },
    playJumpSound () {
        cc.audioEngine.playEffect(this.jumpAudio)
    },
    onTouch (event) {
        var touch = event.getTouches()[0]
        var touchLoc = touch.getLocation()
        if (touchLoc.x > cc.winSize.width/2) {
            this.accLeft = false
            this.accRight = true
        } else {
            this.accLeft = true
            this.accRight = false
        }
    },
    setInputControl () {
        var self = this;
        // 添加键盘事件监听
        self.game.node.on(cc.Node.EventType.TOUCH_START, self.onTouch, self);
        self.game.node.on(cc.Node.EventType.TOUCH_MOVE, self.onTouch, self);
        self.game.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            self.accLeft = false
            self.accRight = false
        }, self)
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node)
    },

    // called every frame, uncomment this function to activate update callback
    update (dt) {
        if (! this.game.running) {
            return ;
        }
        this.updatePlayerPosition(dt);
    },
    updatePlayerPosition (dt) {
        let finalX = 0;
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            let reverse = this.xSpeed >= 0 ? 1 : -1
            this.xSpeed = reverse * this.maxMoveSpeed
        }

        // 根据当前速度更新主角的位置, 且当前位置不能大于边界
        finalX  = this.node.x + this.xSpeed * dt;
        if (Math.abs(finalX) > this.maxX) {
            let reverse = finalX >= 0 ? 1 : -1
            finalX = reverse * this.maxX
            // 同时反弹速度
            this.xSpeed *= -1
        }
        this.node.x = finalX
    }
});
