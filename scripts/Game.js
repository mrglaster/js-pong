
let PLAYER_VS_PLAYER = false
let PLAYER_VS_BOT = true

let GAME_MODE = PLAYER_VS_PLAYER 
let DIFFICULTY = 0
let VELOCITY = 0

let PLATFORM_HEIGHT = 80;
let PLATFORL_WIDTH = 24;

let LP_GOALS = 0
let RP_GOALS = 0




let WIN_SOUND = 'sound/win_sound.mp3'
let LOOSE_SOUND = 'sound/loose_sound.mp3'
let HIT_SOUND = 'sound/ball_hit.mp3'
let START_SOUND = 'sound/start_sound.mp3'

class Platform {
    static get PID() {
        return {
            P: (2.0 + DIFFICULTY),
            I: 0.45,
            D: 0.1
        }
    }

    static get VEL_MAX() {
        return 1000
    }

    static get I_MAX() {
        return 5
    }

    static get H() {
        return PLATFORM_HEIGHT
    }

    static get W() {
        return PLATFORL_WIDTH
    }

    constructor(pos, ballRef) {
        this.position = pos
        this.velocity = new Vector2()
        this.ballRef = ballRef

        this.iState = 0
        this.dState = 0
    }

    keepTarget() {
        const e = this.ballRef.position.y -
            (this.position.y + Platform.H / 2)

        const pTerm = Platform.PID.P * e
        this.iState += e
        this.iState = Math.max(
            -Platform.I_MAX,
            Math.min(
                Platform.I_MAX,
                this.iState
            )
        )
        const iTerm = this.iState * Platform.PID.I

        const dTerm = Platform.PID.D * this.dState
        this.dState = e

        let acc = pTerm + iTerm - dTerm
        acc = Math.max(
            -Platform.VEL_MAX,
            Math.min(
                Platform.VEL_MAX,
                acc
            )
        )
        this.velocity.y = acc
    }

    update(dt) {

        this.position = this.position.add(
            this.velocity.mul(dt)
        )

        if (this.position.y <= 0) {
            this.position.y = 0
        }
        if (this.position.y + Platform.H >= innerHeight) {
            this.position.y = innerHeight - Platform.H
        }
    }

    render(ctx) {
        ctx.fillStyle = '#fdfdfd'
        ctx.fillRect(
            this.position.x,
            this.position.y,
            Platform.W,
            Platform.H
        )
    }
}

class Ball {

    static get R() {
        return 12
    }

    constructor(pos) {
        this.position = pos
        this.velocity = new Vector2(100, 100)
    }

    update(dt) {
        this.position = this.position.add(
            this.velocity.mul(dt)
        )
    }

    render(ctx) {
        ctx.save()
        ctx.fillStyle = '#e79878'
        ctx.arc(
            this.position.x,
            this.position.y,
            Ball.R,
            0,
            2 * Math.PI
        )
        ctx.fillStyle = '#fdfdfd'
        ctx.fill()
        ctx.restore()
    }
}

class Game {

    static get MaxFPS() {
        return 60
    }

    static get TickLength() {
        return (1 / Game.MaxFPS) * 1000
    }

    static get States() {
        return {
            WELCOME: 1,
            GAME_PROCESS: 2,
            GAME_PLAYER_RESPAWN: 3,
            GAME_OVER: 4
        }
    }

    constructor() {
        this.lastTick = 0
    }


    _play_sound(sound_path){
        var audio = new Audio(sound_path);
        audio.play();
    }

    onCreate() {

        this.isBotLeft = false

        this.gameState = Game.States.WELCOME

        const OFFSET_H = 40

        this.ball = new Ball(new Vector2(
            innerWidth / 2,
            innerHeight / 2
        ))

        this.leftPlatform = new Platform(
            new Vector2(
                OFFSET_H,
                innerHeight / 2 - (Platform.H / 2)
            ),
            this.ball
        )
        this.rightPlatform = new Platform(
            new Vector2(
                innerWidth - OFFSET_H - Platform.W,
                innerHeight / 2 - (Platform.H / 2)
            ),
            this.ball
        )

        document.addEventListener('keydown',
            (e) => this.onInput(e))
    }

    onInput(e) {
        const target = this.isBotLeft ?
            this.rightPlatform : this.leftPlatform
        const targetL = this.isBotLeft ?
            this.leftPlatform : this.rightPlatform
        // console.log(e, this);
        switch (e.keyCode) {
            case 32: // SPACE
                if (this.gameState === Game.States.WELCOME) {
                    this.gameState = Game.States.GAME_PROCESS
                    this._play_sound(START_SOUND)
                }

                if (this.gameState === Game.States.GAME_PLAYER_RESPAWN) {
                    if (this.isBotLeft || (!GAME_MODE && this.ball.position.x > innerWidth / 2)) {
                        this.ball.velocity = Vector2.random(-200, -100, -200, 200)
                    } else {
                        this.ball.velocity = Vector2.random(100, 200, -200, 200)
                    }
                    this.gameState = Game.States.GAME_PROCESS
                    this._play_sound(START_SOUND)
                }
                break
            case 38: // UP
                if (this.gameState === Game.States.GAME_PROCESS)
                    target.velocity.y = -120
                break
            case 40: // DOWN
                if (this.isPlaying)
                    target.velocity.y = 120
                break
            case 87: // W
                if (this.gameState === Game.States.GAME_PROCESS)
                    targetL.velocity.y = -120
                GAME_MODE = false
                break
            case 83: // S
                if (this.isPlaying)
                    targetL.velocity.y = 120
                GAME_MODE = false
                break


        }
    }

    get isPlaying() {
        return this.gameState === Game.States.GAME_PROCESS
    }

    onUpdate(tFrame) {
        const dt = (tFrame - this.lastTick) / 1000
        this.lastTick = tFrame
        // console.log('onUpdate', dt);

        if (this.gameState === Game.States.GAME_PROCESS ||
            this.gameState === Game.States.GAME_PLAYER_RESPAWN) {
            this.checkCollisions()
            this.checkBorders()
            this.leftPlatform.update(dt)
            this.rightPlatform.update(dt)
            this.ball.update(dt)
            if (GAME_MODE) {
                if (this.isBotLeft) {
                    this.leftPlatform.keepTarget()
                } else {
                    this.rightPlatform.keepTarget()
                }
            }
        }
    }




    _update_score_context(ctx) {
        ctx.save()
        ctx.font = '180px Pong-Score'
        ctx.fillStyle = '#fdfdfd'
        ctx.fillText(LP_GOALS + '   ' + RP_GOALS, innerWidth / 2 - 155, innerHeight / 4 + 28)
        ctx.restore()
    }

    _set_startgame_context(ctx, phrase) {
        ctx.font = '96px Galaxus'
        ctx.fillStyle = '#fdfdfd'
        ctx.fillText(`Press  SPACE  to ${phrase} !`, innerWidth / 2 - 350, innerHeight / 2 + 24)
    }


    onRender(ctx) {
        ctx.clearRect(0, 0, innerWidth, innerHeight)
        ctx.beginPath()
        ctx.fillStyle = "black";
        if (this.gameState === Game.States.GAME_PROCESS) this._update_score_context(ctx)



        if (this.gameState === Game.States.GAME_PLAYER_RESPAWN) this._set_startgame_context(ctx, 'restart')



        this.leftPlatform.render(ctx)
        this.rightPlatform.render(ctx)
        this.ball.render(ctx)

        if (this.gameState === Game.States.WELCOME) this._set_startgame_context(ctx, 'start')

    }

    checkCollisions() {
        const isRightField = this.ball.position.x > innerWidth / 2
        let pX // Platform X
        let pY // Platform Y
        let bXo // Ball x offset
        if (isRightField) {
            pX = this.rightPlatform.position.x
            pY = this.rightPlatform.position.y
            bXo = Ball.R
        } else {
            pX = this.leftPlatform.position.x + Platform.W
            pY = this.leftPlatform.position.y
            bXo = -Ball.R
        }
        const triggerWidth = 13

        let isInTrigger

        const bX = this.ball.position.x + bXo
        const bY = this.ball.position.y
        if (isRightField) {
            isInTrigger = bX >= pX && bX <= pX + triggerWidth
        } else {
            isInTrigger = bX <= pX && bX >= pX - triggerWidth
        }
        if (isInTrigger && bY >= pY && bY <= pY + Platform.H) {
            this._play_sound(HIT_SOUND)
            this.ball.velocity.x *= -1
            if (this.ball.velocity.x < 0) {
                this.ball.velocity.x -= VELOCITY
                if (this.ball.velocity.x < -700) this.ball.velocity.x = -700
            } else {
                this.ball.velocity.x += VELOCITY
                if (this.ball.velocity.x > 700) this.ball.velocity.x = 700
            }
            if (this.ball.velocity.x > -700 && this.ball.velocity.x < 700)
                VELOCITY += 2
            
        }
    }

    checkBorders() {
        const p = this.ball.position
        const topY = p.y - Ball.R
        const bottomY = p.y + Ball.R
        const rightX = p.x + Ball.R
        const leftX = p.x - Ball.R
        if (topY <= 0 || bottomY >= innerHeight) {
            this._play_sound(HIT_SOUND)
            this.ball.velocity.y *= -1

        } else if (rightX <= 0 || leftX >= innerWidth) {
            this.onGoal(rightX <= 0)
        }
    }

    onGoal(isLeft) {
        const target = isLeft ? this.leftPlatform : this.rightPlatform

        let x = target.position.x
        if (isLeft) {
            x += Platform.W + Ball.R + 5
        } else {
            x -= Ball.R + 5
        }
        const y = target.position.y + Platform.H / 2
        this.ball.position = new Vector2(x, y)


        /**If player wins */
        if ((isLeft && this.isBotLeft) || (!isLeft && !this.isBotLeft)) {
            LP_GOALS++ //добавляем бал левому игрок
            if (GAME_MODE == PLAYER_VS_BOT) {
                this._play_sound(WIN_SOUND)
                DIFFICULTY += 0.2
                if (isLeft) {
                    this.ball.velocity = Vector2.random(100, 200, -200, 200)
                } else {
                    this.ball.velocity = Vector2.random(-200, -100, -200, 200)
                }
            } else {
                this._play_sound(WIN_SOUND)
                this.ball.velocity = new Vector2()
                target.velocity = new Vector2()
                this.gameState = Game.States.GAME_PLAYER_RESPAWN
            }
        } else {
            RP_GOALS++ //добавляем бал правому игроку
            if (GAME_MODE == PLAYER_VS_BOT) {
                DIFFICULTY -= 0.1
                this._play_sound(LOOSE_SOUND)
            }  else this._play_sound(WIN_SOUND)
            this.ball.velocity = new Vector2()
            target.velocity = new Vector2()
            this.gameState = Game.States.GAME_PLAYER_RESPAWN
        }
        VELOCITY = 0
    }
}
