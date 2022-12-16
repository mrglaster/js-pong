(() => {
    const canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const context = canvas.getContext('2d')

    const game = new Game()
    game.onCreate()

    function main(tFrame) {
        requestAnimationFrame(main)
        const nextTick = 
            game.lastTick + Game.TickLength
        let numTicks = 0
        if (tFrame > nextTick) {
            const timeSinceTick = 
                tFrame - game.lastTick
            numTicks = Math.floor(
                timeSinceTick / Game.TickLength
            )
        }
        for (let i = 0; i < numTicks; i++) {
            game.onUpdate(
                game.lastTick + Game.TickLength
            )
        }
        game.onRender(context)
        
    }
    main(performance.now())

})()