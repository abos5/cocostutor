/**
 * @todo
 * @done 加入简单的开始菜单界面，在游戏运行的一开始显示开始按钮，点击按钮后才会开始游戏
 * @done 为游戏失败加入简单的菜单界面，游戏失败后点击按钮才会重新开始
 * @done 限制主角的移动不能超过视窗边界
 * @done 为主角的跳跃动作加入更细腻的动画表现
 * @done 为触屏设备加入输入控制
 * @done 修改监听事件的方法， 改为 self.canvas.on
 *
 * @done starPrefab 需要加入 NodePool
 * @done 为星星消失的状态加入计时进度条
 * @done 收集星星的时候播放音效
 *
 * @done 修改星星播放的动画特效， 改为与 polished project 一致
 * @done 修改收集星星播放特性时的声音播放到 ScoreFX 里去管理
 * @done 收集星星的时候播放动画
 * 优化触屏控制， 改为跟随触摸地点移动
 */
const Player  = require('Player')
const ScoreFX = require('ScoreFX')
const Star    = require('Star')

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

        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        score: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Sprite
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        playBtn: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreBoard: {
            default: null,
            type: cc.Node
        },
        fpsDisplay: {
            default: null,
            type: cc.Label
        },
        gameFailed: {
            default: null,
            type: cc.Label,
        },
        // remote: null,
    },
    // use this for initialization
    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY     = this.ground.node.y + this.ground.node.height/2;
        this.player.game = this;
        this.starPool    = new cc.NodePool('Star')
        this.scoreFXPool = new cc.NodePool('ScoreFX')
        this.hideGameFailed()
    },
    hideGameFailed () {
        this.gameFailed.node.runAction(cc.hide())
    },
    connect () {
        // disabled when no internet connection
        // return;
        if (this.remote) {
            return this.remote
        }

        var begin = Date.now()
        this.remote = io.connect('ws://node.abos.space:3000');
        this.remote.on('connect', function(){
            cc.log(['spend:', Date.now() - begin, 'to connect'].join(' '))
        });
        this.remote.on('message', function(msg){
            cc.log(msg)
        });
        this.remote.on('disconnect', function() {
            cc.log('disconnected')
        })
    },
    onStartGame () {
        this.connect()
        // 初始化计时器
        this.timer        = 0
        this.starDuration = 0
        this.running      = true
        this.playBtn.active = false
        this.hideGameFailed()
        this.gameFailed.node.runAction(cc.rotateTo(0.1, 0, 0))
        this.player.node.setPositionY(this.groundY)
        // 初始化计分
        this.score = 0
        // 让主角继续跳
        this.player.onStartGame()
        // 生成一个新的星星
        this.spawnNewStar()
        this.setScoreDisplay()
    },
    setScoreDisplay () {
        this.scoreDisplay.string = this.score.toString()
    },
    spawnScoreFX (pos) {
        var scoreFX = null
        if (this.scoreFXPool.size() > 0) {
            scoreFX = this.scoreFXPool.get(this).getComponent('ScoreFX')
            scoreFX.init(this)
        } else {
            scoreFX = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX')
        }
        this.node.addChild(scoreFX.node)
        scoreFX.node.setPosition(pos)
        scoreFX.play()
    },
    despawnScoreFX (scoreFX) {
        this.scoreFXPool.put(scoreFX)
    },
    spawnNewStar () {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = null

        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this)
        } else {
            newStar = cc.instantiate(this.starPrefab)
        }

        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').init(this);

        // 将新增的节点添加到 Canvas 节点下面
        newStar.setPosition(this.getNewStarPosition());
        // 为星星设置一个随机位置
        this.node.addChild(newStar);

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

        // 配置当前的 星星节点
        this.currStarNode = newStar
    },

    despawnStar () {
        this.starPool.put(this.currStarNode)
        this.spawnNewStar()
    },

    getNewStarPosition () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX
        cc.randomMinus1To1()
        // 返回星星坐标
        return cc.p(randX, randY)
    },
    gainScore (pos)
    {
        this.score += 1
        this.setScoreDisplay()
        this.spawnScoreFX(pos)
    },

    // called every frame, uncomment this function to activate update callback
    update (dt) {

        // 每帧更新计时器，超过限度还没有生成新的星星
        this.timer += dt;

        this.fpsDisplay.string = cc.game.config.frameRate.toString()
        // 就会调用游戏失败逻辑
        if (this.running && this.timer > this.starDuration) {
            this.gameOver();
        }
    },
    gameOver () {
        if (! this.running) {
            return ;
        }
        // 可以确保 gameOver 函数出错后， running 一定是 false
        this.running = false
        this.currStarNode.destroy()
        this.player.onStopGame()  //停止 player 节点的跳跃动作
        // this.star

        // 跳跃上升
        var jumpUp = cc.moveBy(this.player.jumpDuration, cc.p(0,160)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.player.jumpDuration, cc.p(0, -160)).easing(cc.easeCubicActionIn());

        // this.gameFailed.node.active = true
        this.playBtn.active = true
        this.gameFailed.node.runAction(cc.sequence(
            cc.show(),
            cc.spawn(
                cc.sequence(cc.scaleTo(0.25, 3, 2), cc.scaleTo(0.125, 0.3, 0.5), cc.scaleTo(0.125, 1, 1)),
                cc.sequence(cc.rotateBy(0.5, -360*2.1))
            ),
        ));

    },
});
