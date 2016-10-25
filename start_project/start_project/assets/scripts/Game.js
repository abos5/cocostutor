/**
 * @todo
 * @done 加入简单的开始菜单界面，在游戏运行的一开始显示开始按钮，点击按钮后才会开始游戏
 * 为游戏失败加入简单的菜单界面，游戏失败后点击按钮才会重新开始
 * @done 限制主角的移动不能超过视窗边界
 * 为主角的跳跃动作加入更细腻的动画表现
 * 为星星消失的状态加入计时进度条
 * 收集星星时加入更华丽的效果
 * 为触屏设备加入输入控制
 */
const Player = require('Player');
// const ScoreFX = require('ScoreFX');
const Star = require('Star')

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
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
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
        score: {
            default: 0,
            visible: false,
            type: cc.Integer
        },
        fpsDisplay: {
            default: null,
            type: cc.Label
        },
        fps: {
            default: 0,
            visible: false,
            type: cc.Integer
        },
        fpsSecond: {
            default: 0,
            visible: false,
            type: cc.Integer
        },
        gameFailed: {
            default: null,
            type: cc.Label,
        }
    },

    // use this for initialization
    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        this.player.game = this;
        this.hideGameFailed()
    },
    hideGameFailed () { 
        this.gameFailed.node.runAction(cc.hide())
    },
    onStartGame: function() {

        // 初始化计时器
        this.timer        = 0;
        this.starDuration = 0;
        this.running      = true;
        this.playBtn.setPositionX(this.node.height);
        this.player.node.setPositionY(this.groundY);
        // 初始化计分
        this.score = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        this.gameFailed.node.setPositionX(0);
        this.player.onStartGame();
    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);

        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').game = this;

        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);

        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },
    gainScore: function()
    {
        this.score += 1
        this.scoreDisplay.string = this.score.toString()
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
        // 每帧更新计时器，超过限度还没有生成新的星星
        this.timer += dt;
        this.fpsDisplay.string = cc.director.getSecondsPerFrame().toString();
        // 就会调用游戏失败逻辑
        if (this.running && this.timer > this.starDuration) {
            this.gameOver();
        }
    },
    gameOver: function () {
        if (! this.running) {
            return ;
        }
        this.player.onStopGame(); //停止 player 节点的跳跃动作
        this.running = false;
        
        // 跳跃上升
        var jumpUp = cc.moveBy(this.player.jumpDuration, cc.p(0,160)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.player.jumpDuration, cc.p(0, -160)).easing(cc.easeCubicActionIn());
        this.gameFailed.node.runAction(cc.sequence(
            cc.show(),
            cc.spawn(
                cc.sequence(cc.scaleTo(0.25, 3, 2), cc.scaleTo(0.125, 0.3, 0.5), cc.scaleTo(0.125, 1, 1)),
                cc.sequence(cc.rotateBy(0.5, -360*1.9))
            ),
        ));
        
        // cc.director.loadScene('game');
    },
});
