class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu')
        this.musikplay = false
    }

    create() {
        
        this.add.image(0, 0, 'background').setOrigin(0)
        .setScale(2.1)

        this.add.image(this.scale.width * 0.64, this.scale.height * 0.02, 'bobsign').setOrigin(0)
        .setScale(3)

        const bgMusic = this.sound.add('bgMusic', { loop: true })
        if(!this.musikplay){
            bgMusic.play()
            this.musikplay = true
        }
        bgMusic.setVolume(0.6)

        const startButton = this.add.sprite(this.scale.width * 0.2, this.scale.height * 0.8, 'startButton')
        .setInteractive()
        .setScale(2)

        const editButton = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.8, 'editButton')
        .setInteractive()
        .setScale(2)

        const settingsButton = this.add.sprite(this.scale.width * 0.8, this.scale.height * 0.8, 'settingsButton')
            .setInteractive()
			.setScale(2)

        startButton.on('pointerdown', () => {
            startButton.play('startbuttonclick')
            startButton.once('animationcomplete', () => {
            this.scene.start('LevelMenu')
            })
        })

        editButton.on('pointerdown', () => {
            editButton.play('editbuttonclick')
            editButton.once('animationcomplete', () => {
            this.scene.start('LevelEditor')
            })
        })

        settingsButton.on('pointerdown', () => {
            settingsButton.play('settingsbuttonclick')
            settingsButton.once('animationcomplete', () => {
            this.scene.launch('SettingsOverlay', { previousSceneKey: this.scene.key })
            })
        })

        this.events.on('resume', () => {
            settingsButton.setFrame(0)
        })

    }

}