const levels = [
    { id: 1, unlocked: true, completed: false },
    { id: 2, unlocked: false, completed: false },
    { id: 3, unlocked: false, completed: false },
]

class LevelMenu extends Phaser.Scene {
    constructor() {
        super('LevelMenu')
        this.scores = { 1: 0, 2: 0, 3: 0 }
        this.curscore = 0
        this.score = 0
        this.scoreTexts = []
    }

    init(data) {
        this.levelId = data.levelId
        this.curscore = data.score
        this.score = 0
    }

    preload() {
        levels.forEach((level) => {
            this.load.spritesheet(level.id.toString(), `Assets/Buttons/${level.id}.png`, {
                frameWidth: 32,
                frameHeight: 32
            })
        })
        this.load.image('bg', 'Assets/Backgrounds/aaa.jpeg')
    }

    create() {
        this.add.image(this.scale.width * 0.5, this.scale.height * 0.5, 'bg').setScale(0.8)
        this.backButton = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.9, 'backButton')
        .setInteractive()
        .setScale(2)
        levels.forEach((level, index) => {
            if (level.completed && index < levels.length - 1) {
                levels[index + 1].unlocked = true
            }
            const buttonRadius = 32
            const buttonX = this.scale.width * 0.2 + index * (buttonRadius * 18)
            const buttonBg = this.add.sprite(buttonX, this.scale.height * 0.5, level.id.toString())
            buttonBg.setFrame(level.unlocked ? (level.completed ? 2 : 0) : 1)
            buttonBg.setScale(6)
            buttonBg.setInteractive()
            const scoreText = this.add.text(this.scale.width * 0.15 + index * (buttonRadius * 18), this.scale.height * 0.6, `Score: ${this.scores[index + 1]}`, { fontSize: '32px', fill: '#fff' , backgroundColor: 'black'})
            this.scoreTexts[index] = scoreText
            buttonBg.on('pointerdown', () => {
                if (level.unlocked) {
                    this.scene.start('playGame', { levelId: level.id })
                } else {
                    console.log(`Level ${level.id} is locked.`)
                }
            })
        })

        this.events.on('levelCompleted', (completedLevelId) => {
            const completedLevelIndex = levels.findIndex(l => l.id === completedLevelId)
            levels[completedLevelIndex].completed = true
            const nextLevel = levels[completedLevelIndex + 1]
            if (nextLevel) {
                nextLevel.unlocked = true
                this.score = 0
            }
            this.scene.restart()
        })

        this.backButton.on('pointerdown', () => {
            this.backButton.play('backbuttonclick')
            this.backButton.once('animationcomplete', () => {
            this.scene.start('MainMenu')
            })
        })

        if(this.score < this.curscore){
            this.score = this.curscore
            this.updateScores(this.levelId, this.score)
        }
    }

    updateScores(levelId, newScore) {
        console.log(`Updating score for level ${levelId} to ${newScore}`)
        this.scores[levelId] = newScore
        this.updateScoreTexts()
    }
    updateScoreTexts() {
        this.scoreTexts.forEach((text, index) => {
            if(index + 1 == this.levelId){
                const levelId = levels[index].id
                text.setText(`Score: ${this.scores[levelId]}`)
            } 
        })
    }

}
