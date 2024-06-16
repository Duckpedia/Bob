class SettingsOverlay extends Phaser.Scene {
    constructor() {
        super('SettingsOverlay')
        this.sliderValue = 0.5
    }

    preload(){
        this.load.image('bg', 'Assets/Backgrounds/aaa.jpeg')

    }

    create(data) {

        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'bg')
        .setScale(0.81)

        const volumeText = this.add.text(this.scale.width * 0.1, this.scale.height * 0.2, 'Volume:', { backgroundColor: 'black', fontFamily: 'Times New Roman', fontSize: '100px', fill: '#ffffff', fontWeight: 'bold'})

        const track = this.add.graphics()
        track.fillStyle(0x888888)
        track.fillRect(this.scale.width * 0.3, this.scale.height * 0.23, 600, 40)

        const thumb = this.add.rectangle(this.scale.width * 0.3 + this.sliderValue * 600, this.scale.height * 0.25, 40, 80, 0xffffff)
        thumb.setInteractive()
        this.input.setDraggable(thumb)

        const trackStartX = this.scale.width * 0.3 + 20
        const trackWidth = 600 - 40
        
        const leftBound = trackStartX
        const rightBound = trackStartX + trackWidth
     
        const volumeValueText = this.add.text(this.scale.width * 0.465, this.scale.height * 0.33, '', { fontSize: '40px', fill: '#ffffff' })
        volumeValueText.setOrigin(0.5)

        this.input.on('drag', (pointer, gameObject, dragX) => {
            if (gameObject === thumb) {
                const newX = Phaser.Math.Clamp(dragX, leftBound, rightBound)
                gameObject.x = newX
                this.sliderValue = (newX - leftBound) / (rightBound - leftBound)
                updateGlobalVolume()
                updateVolumeValueText()
            }
        })

        const updateGlobalVolume = () => {
            const soundManager = this.sound
            soundManager.sounds.forEach(sound => {
                sound.volume = this.sliderValue
            })
        }

        const updateVolumeValueText = () => {
            volumeValueText.setText(`${Math.round(this.sliderValue * 100)}%`)
        }

        const previousSceneKey = data.previousSceneKey

        const backButton = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.9, 'backButton')
        .setInteractive()
        .setScale(2)

        backButton.on('pointerdown', () => {
            backButton.play('backbuttonclick')
            backButton.once('animationcomplete', () => {
            localStorage.setItem('sliderValue', this.sliderValue)
            this.scene.stop()
            this.scene.resume(previousSceneKey)
            })
        })
        
    }
}