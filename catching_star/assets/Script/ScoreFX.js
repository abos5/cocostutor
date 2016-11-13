cc.Class({
    extends: cc.Component,

    properties: {
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        anim: {
            default: null,
            type: cc.Animation,
        }
    },
    init (game) {
        this.game = game
        this.anim.getComponent('ScoreAnim').init(this)
        cc.info(this.anim)
    },
    despawn () {
        this.game.despawnScoreFX(this.node)
    },
    play () {
        cc.audioEngine.playEffect(this.scoreAudio)
        this.anim.play('score_pop')
    }
});
