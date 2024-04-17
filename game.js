let gameSettings = {
    playerSpeed: 300,
    playerVelocity: -640,
    enemySpeed: 100,
}

let config = {
    width: 1920,
    height: 1080,
    backgroundColor: 0x000000,
    scene: [Preload, MainMenu, LevelEditor, LevelMenu, MainGame, SettingsOverlay],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            setAlpha: 0.75,
            gravity: {
                y: 2200
            }       
        }
    },
    fps: {
        forceSetTimeOut: true,
        target: 60
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

var game = new Phaser.Game(config)