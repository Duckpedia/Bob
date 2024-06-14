
class MainGame extends Phaser.Scene {
    constructor() {
        super("playGame")
        this.enemyState = {
            PATROLLING: 0,
            CHASING: 1
        }
        this.powerUp = false
        this.cameradown = false
        this.canShoot = true
        this.canAttack = true
        this.touch = false
        this.playerState = {
            IDLE: 0,
            WALK: 1,
            ATTACK: 2
        }
        this.currentPlayerState = this.playerState.IDLE
        this.startingPOSX = 150
        this.startingPOSY = config.height - 360
        this.totalKeys = 0
        this.keysCollected = 0
        this.buttons = 0
        this.PressedButtons = 0
        this.buttonPress = false
        this.menu = false
        this.hit = 3
        this.hitis = false
    }

    init(data) {
        this.levelId = data.levelId
        console.log("Initializing with levelId:", this.levelId)
    }
    
    preload() {
        this.load.json('mapData', `/Levels/level (${this.levelId}).json?time=${Date.now()}`)
    }
    create(data){
    //prenesemo slikce ko jih zloadamo
        this.sliderValue = parseFloat(localStorage.getItem('sliderValue')) || 0.5
        this.mapData = this.cache.json.get('mapData')

        const width = this.scale.width
        const height = this.scale.height

        this.map = this.make.tilemap({
            data: this.mapData,
            tileWidth: 64,
            tileHeight: 64
        })

        this.add.image(width * 0.5, height * 0.5, 'background1')
        .setScale(3)
        .setScrollFactor(0)
        
        this.add.image(width * 0.49, height * 0.52, 'background7')
        .setScale(3)
        .setScrollFactor(0.0)

        this.add.tileSprite(width * 0.5, height * 0.45, this.map.widthInPixels * 1.5, config.height, 'background2')
        .setScale(3)
        .setScrollFactor(0.10)

        this.add.tileSprite(width * 0.3, height * 0.8, this.map.widthInPixels * 1.5, config.height, 'background3')
        .setScale(3)
        .setScrollFactor(0.05)

        this.add.tileSprite(width * 0.5, height * 0.35, this.map.widthInPixels * 1.5, config.height, 'background4')
        .setScale(3)
        .setScrollFactor(0.20)

        this.add.tileSprite(width * 0.5, height * 0.15, this.map.widthInPixels * 1.5, config.height, 'background6')
        .setScale(3)
        .setScrollFactor(0.30)

        this.add.tileSprite(width * 0.5, height * 0.3, this.map.widthInPixels * 1.5, config.height, 'background5')
        .setScale(3)
        .setScrollFactor(0.40)

        const blackSquare = this.add.graphics()
        blackSquare.fillStyle(0x000000, 1)
        blackSquare.fillRect(0, height * 0.8, this.map.widthInPixels * 1.5, 500)
        blackSquare.setScrollFactor(0.4)
        
        const tileset = this.map.addTilesetImage('tiles')
        this.groundLayer = this.map.createLayer(0, tileset, 0, 0)
        const collidingTileIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,40,46,48]
        this.groundLayer.setCollision(collidingTileIndices)

        this.groundLayer.forEachTile(tile => {
            if (tile.index === 41) {
                this.totalKeys++
            }
            else if(tile.index == 42 || tile.index == 43 || tile.index == 44 || tile.index == 45)
            this.buttons++
        })

        this.coinScore = 0
        
//physics in player
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.player = this.physics.add.sprite( this.startingPOSX, this.startingPOSY, "player")
        this.player.setScale(2)
        this.player.play("player_idle")
        this.physics.world.enable(this.player)
        this.player.setCollideWorldBounds(true)

        this.portal = this.physics.add.sprite(this.map.widthInPixels - 60, config.height - 370, "portal")
        this.portal.body.setAllowGravity(false)
        this.portal.setScale(3)
        this.portal.setFlipX(true)
//enemies
        this.enemiesType1 = this.physics.add.group()
        this.enemiesType2 = this.physics.add.group()
        this.enemiesType3 = this.physics.add.group()
        this.spawnEnemies()
//streljanje
        this.shoot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
//physics itd
        if (this.enemiesType2 && this.enemiesType2.getChildren) this.physics.add.collider(this.enemiesType2, this.groundLayer)
        if (this.enemiesType1 && this.enemiesType1.getChildren) this.physics.add.collider(this.enemiesType1, this.groundLayer)
        if (this.enemiesType3 && this.enemiesType3.getChildren) this.physics.add.collider(this.enemiesType3, this.groundLayer)
        this.physics.add.collider(this.player, this.groundLayer)
        this.physics.add.overlap(this.player, this.groundLayer, this.wall, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.checkpoint, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.collectCoins, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.collectHeart, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.collectKey, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.Fire, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.Speed, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.Air, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.HighJump, null, this)
        this.physics.add.overlap(this.player, this.portal, this.TouchPortal, null, this)
        this.physics.add.overlap(this.player, this.groundLayer, this.button, null, this)

        this.cursor = this.input.keyboard.createCursorKeys()

//kamera stuff
        this.camera = this.cameras.main
        this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.camera.startFollow(this.player, true, 1, 0)
        this.camera.zoom += 0.2
        this.camera.scrollY = 0
//Player HP
        this.player.hp = 100
        this.hpBar = this.add.graphics()
        this.hpBar.fillStyle(0xff0000)
        this.hpBar.fillRect(this.player.x - 49, this.player.y - 50, this.player.hp, 5)
//Inventory
        this.inventoryBox = this.add.graphics()
        this.inventoryBox.fillStyle(0x000000, 0.8)
        this.boxSizeX = 5 * 64
        this.boxSizeY = 6 * 64
        this.BoxCenterX = this.cameras.main.worldView.width / 2 - this.boxSizeX / 2
        this.BoxCenterY = this.cameras.main.worldView.height / 2 - this.boxSizeY / 2
        this.inventoryBox.fillRect(this.BoxCenterX, this.BoxCenterY, this.boxSizeX, this.boxSizeY)
        this.inventoryBox.setScrollFactor(0)

        this.inventoryContainer = this.add.container()

        this.inventoryContainer.add(this.inventoryBox)
        this.inventoryContainer.setVisible(false)
        this.slots = []
        
        let miniBoxWidth = 64
        let miniBoxHeight = 64

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                let miniBoxX = this.BoxCenterX + j * miniBoxWidth
                let miniBoxY = this.BoxCenterY + i * miniBoxHeight
        
                this.miniBox = this.add.graphics()
                this.miniBox.lineStyle(1, 0xffffff, 0.8)
        
                this.miniBox.strokeRect(miniBoxX, miniBoxY, miniBoxWidth, miniBoxHeight)
                this.miniBox.setScrollFactor(0)
                this.inventoryContainer.add(this.miniBox)
                let slot = { x: miniBoxX, y: miniBoxY, item: null }
                this.slots.push(slot)
            }
        }

        this.addItemToInventory = function(item) {
            for (let i = 0; i < this.slots.length; i++) {
                if (!this.slots[i].item) {
                    item.x = this.slots[i].x
                    item.y = this.slots[i].y
                    this.slots[i].item = item
                    break
                }
            }
        }

        let keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I) 
        let keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        keyI.on('down', () => {
            if (this.inventoryContainer.visible) {
                this.inventoryContainer.setVisible(false)
                for (let slot of this.slots) {
                    if (slot.item) {
                        slot.item.setVisible(false)
                    }
                }
            } else {
                this.inventoryContainer.setVisible(true)
                for (let slot of this.slots) {
                    if (slot.item) {
                        slot.item.setVisible(true)
                    }
                }
            }
        })

        this.menuBackground = this.add.graphics()
        .fillStyle(0x000000, 0.7)
        .fillRect(0, 0, game.config.width, game.config.height)
        .setScrollFactor(0)
        .setVisible(false)

        this.settingsButton = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.4, 'settingsButton')
        .setInteractive()
        .setScale(2)
        .setScrollFactor(0)
        .setVisible(false)

        this.backButton = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.6, 'backButton')
        .setInteractive()
        .setScale(2)
        .setScrollFactor(0)
        .setVisible(false)

        keyEsc.on('down', () => {
            if (this.inventoryContainer.visible) {
                this.inventoryContainer.setVisible(false)
                for (let slot of this.slots) {
                    if (slot.item) {
                        slot.item.setVisible(false)
                    }
                }
            }
            else{
                if(this.menu == false){
                    this.menuBackground.setVisible(true)
                    this.settingsButton.setVisible(true)
                    this.backButton.setVisible(true)
                    this.settingsButton.on('pointerdown', () => {
                        this.settingsButton.play('settingsbuttonclick')
                        this.settingsButton.once('animationcomplete', () => {
                        this.scene.pause()
                        this.scene.launch('SettingsOverlay', { previousSceneKey: this.scene.key })
                        })
                    })
                    this.backButton.on('pointerdown', () => {
                        this.backButton.play('backbuttonclick')
                        this.backButton.once('animationcomplete', () => {
                        this.resetGameState()
                        this.scene.start('MainMenu')
                        })
                    })
                    this.menu = true
                }
                else{
                    this.sliderValue = parseFloat(localStorage.getItem('sliderValue'))
                    this.menuBackground.setVisible(false)
                    this.settingsButton.setVisible(false)
                    this.backButton.setVisible(false)
                    this.menu = false
                }
            }
        })

        this.ConfirmationBackground = this.add.graphics()
        .fillStyle(0xffffff, 1)
        .fillRect(this.BoxCenterX - 70, this.BoxCenterY - 30, 470, 25)
        this.ConfirmationBackground.setScrollFactor(0)
        this.ConfirmationBackground.setVisible(false)

        this.heartConfirmation = this.add.text(this.BoxCenterX - 60, this.BoxCenterY - 30, 'Do you want to use the heart?', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setVisible(false)
        .setScrollFactor(0)
        
        this.yes = this.add.text(this.BoxCenterX + 290, this.BoxCenterY - 30, 'Yes', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setInteractive()
        .setVisible(false)
        .setScrollFactor(0)
        
        this.no = this.add.text(this.BoxCenterX + 350, this.BoxCenterY - 30, 'No', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setInteractive()
        .setVisible(false)
        .setScrollFactor(0)

        this.doorConfirmation = this.add.text(this.BoxCenterX - 70, this.BoxCenterY - 30, 'Do you want to go back to checkpoint?', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setVisible(false)
        .setScrollFactor(0)

        this.yes2 = this.add.text(this.BoxCenterX + 340, this.BoxCenterY - 30, 'Yes', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setInteractive()
        .setVisible(false)
        .setScrollFactor(0)
        
        this.no2 = this.add.text(this.BoxCenterX + 400, this.BoxCenterY - 30, 'No', { fontFamily: 'Arial', fontSize: '24px', fill: '#000000' })
        .setInteractive()
        .setVisible(false)
        .setScrollFactor(0)
        
//Zvoki
        this.sound.add('CollectCoin')
        this.sound.add('PowerupPickUp')   
        this.sound.add('BarrelBreak')
        this.sound.add('KeyPickUp')
        this.sound.add('HeartPickUp')
        this.sound.add('ButtonClick')
    }
//funkcije

spawnEnemies() {
    this.map.forEachTile(tile => {
        if (tile.index === 37) {
            let { x, y } = this.map.tileToWorldXY(tile.x, tile.y)
            let enemyType = ''
            let rand = Math.floor(Math.random() * 3 + 1)
            if(rand == 1) enemyType = 'enemy1'
            else if(rand == 2) enemyType = 'enemy2'
            else if(rand == 3) enemyType = 'enemy3'
            

            let enemy = this.createEnemy(x, y, enemyType)

            if (enemyType === 'enemy1') {
                if (!this.enemiesType1) {
                    this.enemiesType1 = this.physics.add.group()
                }
                this.enemiesType1.add(enemy)
            } else if(enemyType === 'enemy2') {
                if (!this.enemiesType2) {
                    this.enemiesType2 = this.physics.add.group()
                }
                this.enemiesType2.add(enemy)
            }else if(enemyType === 'enemy3'){
                if (!this.enemiesType3) {
                    this.enemiesType3 = this.physics.add.group()
                }
                this.enemiesType3.add(enemy)
            }

            this.map.removeTileAt(tile.x, tile.y)
        }
    })
}

createEnemy(x, y, type) {
    let enemy
    if (type === 'enemy1') {
        enemy = this.physics.add.sprite(x, y, "Enemy1")
        enemy.setScale(3)
        enemy.setOrigin(0.5, 1)
        enemy.play("Enemy1_idle")
    } else if (type === 'enemy2'){
        enemy = this.physics.add.sprite(x, y, "Enemy2")
        enemy.setScale(3)
        enemy.setOrigin(0.5, 1)
        enemy.play("Enemy2_idle")
    }else if (type === 'enemy3'){
        enemy = this.physics.add.sprite(x, y, "enemy3idle")
        enemy.setScale(2)
        enemy.setOrigin(0.5, 1)
        enemy.play("enemy3idle")
    }
    enemy.setCollideWorldBounds(true)
    enemy.body.immovable = true

    return enemy
}

    movePlayer(){
        if(this.currentPlayerState != this.playerState.ATTACK){
            if(this.cursor.left.isDown){
                this.currentPlayerState = this.playerState.WALK
                if(this.powerUp == 'speed') this.player.setVelocityX(-gameSettings.playerSpeed - 200)
                else this.player.setVelocityX(-gameSettings.playerSpeed)
                if(!this.powerUp || this.powerUp == 'jump')
                    this.player.play("player_walk", true)
                else if(this.powerUp == 'fire')
                    this.player.play("player_walkred", true)
                else if(this.powerUp == 'air')
                    this.player.play("player_walkgray", true)
                this.player.setFlipX(true)
            }  
            else if(this.cursor.right.isDown){ 
                this.currentPlayerState = this.playerState.WALK
                if(this.powerUp == 'speed')this.player.setVelocityX(gameSettings.playerSpeed + 200)
                else this.player.setVelocityX(gameSettings.playerSpeed)
                if(!this.powerUp || this.powerUp == 'jump')
                    this.player.play("player_walk", true)
                else if(this.powerUp == 'fire')
                    this.player.play("player_walkred", true)
                else if(this.powerUp == 'air')
                    this.player.play("player_walkgray", true)
                this.player.setFlipX(false)
            }
            else{
                this.currentPlayerState = this.playerState.IDLE
                this.player.setVelocityX(0)
                if(!this.powerUp || this.powerUp == 'jump' || this.powerUp == 'speed')
                    this.player.play("player_idle", true)
                else if(this.powerUp == 'fire')
                    this.player.play("player_idlered", true)
                else if(this.powerUp == 'air')
                    this.player.play("player_idlegray", true)
            }
            
            if(this.cursor.up.isDown && this.player.body.onFloor()){
                if(this.powerUp == 'jump')this.player.setVelocityY(gameSettings.playerVelocity - 250)
                else this.player.setVelocityY(gameSettings.playerVelocity)
            } 
        }
        else{
            this.player.setVelocityX(0)
        }
    }

    collectCoins(player, tile){
        if (tile.index === 30) {
            this.sound.play('CollectCoin', { volume: this.sliderValue })
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.coinScore+=100
        }
        if(tile.index === 32){
            this.sound.play('CollectCoin', { volume: this.sliderValue })
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.coinScore+=500
        }
    }

    checkpoint(player, tile){     
        if (tile.index === 47) {
            this.startingPOSX = tile.x * 64
            this.startingPOSY = tile.y * 64
        }
    }

    barrel(player, tile) {
        if (tile.index === 46) {
            this.sound.play('BarrelBreak', { volume: this.sliderValue })
            this.groundLayer.removeTileAt(tile.x, tile.y)
            let randomNumber = Math.random()
            let tmp
            if (randomNumber < 0.6) {
                tmp = 32
                this.groundLayer.putTileAt(tmp, tile.x, tile.y)
            } else if(randomNumber >= 0.6 && randomNumber < 0.95){
                tmp = Math.floor(Math.random() * (36 - 33 + 1)) + 33
                this.groundLayer.putTileAt(tmp, tile.x, tile.y)
            } else{
                this.player.hp -= 30 
            }     
        }
    }
    

    button(player, tile){
        if(tile.index == 42 && this.buttonPress == false){
            this.sound.play('ButtonClick', { volume: this.sliderValue })
            this.PressedButtons++
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.groundLayer.putTileAt(49, tile.x, tile.y)
        }
        else if(tile.index == 43 && this.buttonPress == false){
            this.sound.play('ButtonClick', { volume: this.sliderValue })
            this.PressedButtons++
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.groundLayer.putTileAt(50, tile.x, tile.y)
        }
        else if(tile.index == 44 && this.buttonPress == false){
            this.sound.play('ButtonClick', { volume: this.sliderValue })
            this.PressedButtons++
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.groundLayer.putTileAt(51, tile.x, tile.y)
        }
        else if(tile.index == 45 && this.buttonPress == false){
            this.sound.play('ButtonClick', { volume: this.sliderValue })
            this.PressedButtons++
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.groundLayer.putTileAt(52, tile.x, tile.y)
        }
    }


    wall(player, tile){

        if(this.PressedButtons == this.buttons){
            this.groundLayer.forEachTile(tile => {
                if (tile.index === 48) {
                    this.groundLayer.removeTileAt(tile.x, tile.y)
                }
            })
        }
        else if(tile.index == 48 && this.PressedButtons < this.buttons){
                this.ConfirmationBackground.setVisible(true)
                this.doorConfirmation.setVisible(true)
                this.yes2.setVisible(true)
                this.no2.setVisible(true)

            this.yes2.on('pointerdown', () => {
                this.player.setPosition(this.startingPOSX, this.startingPOSY)
                this.ConfirmationBackground.setVisible(false)
                this.doorConfirmation.setVisible(false)
                this.yes2.setVisible(false)
                this.no2.setVisible(false)
            })

            this.no2.on('pointerdown', () => {
                this.ConfirmationBackground.setVisible(false)
                this.doorConfirmation.setVisible(false)
                this.yes2.setVisible(false)
                this.no2.setVisible(false)
            })
        }

    }

        Fire(player, tile){
            if (tile.index === 34) {
                this.sound.play('PowerupPickUp', { volume: this.sliderValue })
                this.powerUp = 'fire'
                if(this.timerLine) this.timerLine.clear()
                this.timerLineNeki = 500
                this.timerLine = this.add.graphics()
                this.timerLine.lineStyle(10, 0x00ff00, 1)
                this.timerLine.beginPath()
                    .moveTo(this.camera.width - this.timerLineNeki, 150)
                    .lineTo(this.camera.width - 200, 150)
                    .setScrollFactor(0)
                    .closePath()
                    .strokePath()
    
                this.groundLayer.removeTileAt(tile.x, tile.y)
                this.player.setTexture("playerred")
                this.time.delayedCall(10000, () => {
                    this.powerUp = false
                    this.timerLine.clear()
                    this.player.setTexture("player")
                    this.player.play("player_idle")
                })
            }
        }

        Speed(player, tile){
            if (tile.index === 33) {
                this.sound.play('PowerupPickUp', { volume: this.sliderValue })
                this.powerUp = 'speed'
                if(this.timerLine) this.timerLine.clear()
                this.timerLineNeki = 500
                this.timerLine = this.add.graphics()
                this.timerLine.lineStyle(10, 0x00ff00, 1)
                this.timerLine.beginPath()
                    .moveTo(this.camera.width - this.timerLineNeki, 150)
                    .lineTo(this.camera.width - 200, 150)
                    .setScrollFactor(0)
                    .closePath()
                    .strokePath()
    
                this.groundLayer.removeTileAt(tile.x, tile.y)
                this.time.delayedCall(10000, () => {
                    this.powerUp = false
                    this.timerLine.clear()
                })
            }
        }

        Air(player, tile){
            if (tile.index === 35) {
                this.sound.play('PowerupPickUp', { volume: this.sliderValue })
                this.powerUp = 'air'
                if(this.timerLine) this.timerLine.clear()
                this.timerLineNeki = 500
                this.timerLine = this.add.graphics()
                this.timerLine.lineStyle(10, 0x00ff00, 1)
                this.timerLine.beginPath()
                    .moveTo(this.camera.width - this.timerLineNeki, 150)
                    .lineTo(this.camera.width - 200, 150)
                    .setScrollFactor(0)
                    .closePath()
                    .strokePath()
    
                this.groundLayer.removeTileAt(tile.x, tile.y)
                this.player.setTexture("playerred")
                this.player.play("player_idlered")
                this.time.delayedCall(10000, () => {
                    this.powerUp = false
                    this.timerLine.clear()
                    this.player.setTexture("player")
                    this.player.play("player_idle")
                })
            }
        }

        HighJump(player, tile){
            if (tile.index === 36) {
                this.sound.play('PowerupPickUp', { volume: this.sliderValue })
                this.powerUp = "jump"
                if(this.timerLine) this.timerLine.clear()
                this.timerLineNeki = 500
                this.timerLine = this.add.graphics()
                this.timerLine.lineStyle(10, 0x00ff00, 1)
                this.timerLine.beginPath()
                    .moveTo(this.camera.width - this.timerLineNeki, 150)
                    .lineTo(this.camera.width - 200, 150)
                    .setScrollFactor(0)
                    .closePath()
                    .strokePath()
    
                this.groundLayer.removeTileAt(tile.x, tile.y)
                this.time.delayedCall(10000, () => {
                    this.powerUp = false
                    this.timerLine.clear()
                })
            }
        }
    TouchPortal(player, portal){
        if(player.x >= portal.x - 20 && this.keysCollected === this.totalKeys){
            const completedLevelId = this.levelId
            this.scene.start("LevelMenu", { levelId: completedLevelId, score: this.coinScore })
            levels[completedLevelId - 1].completed = true
            this.events.emit('levelCompleted', completedLevelId)
            this.resetGameState()
        }
    }

    attackHitEnemy(attack, enemy){
        if (this.enemiesType2 && this.enemiesType2.getChildren) {
            this.enemiesType2.getChildren().forEach((enemy) => {
            if (this.physics.overlap(attack, enemy) && this.attack.body.touching && enemy.body.touching)
                    enemy.destroy()
            })
        }
        if (this.enemiesType1 && this.enemiesType1.getChildren) {
            this.enemiesType1.getChildren().forEach((enemy) => {
            if (this.physics.overlap(attack, enemy) && this.attack.body.touching && enemy.body.touching)
                    enemy.destroy()
            })
        }
        if (this.enemiesType3 && this.enemiesType3.getChildren) {
            this.enemiesType3.getChildren().forEach((enemy) => {
            if (this.physics.overlap(attack, enemy) && this.attack.body.touching && enemy.body.touching)
                    if(this.hit > 0 && this.hitis == false){
                        this.hitis = true 
                        this.hit--
                        this.time.addEvent({
                            delay: 2000,
                            callback: () => {
                                this.hitis = false 
                            },
                        })
                    }
                    else if(this.hit <= 0){
                        this.hit = 3
                        enemy.destroy()
                    }
            })
        }
    }

    enemyTouchPlayer(player, enemy){
        if (this.physics.overlap(player, enemy) && this.player.body.touching && enemy.body.touching) {
        this.player.hp -= 0.8
        this.player.x -= 1
        }
    }

    loseHP(player){
        this.player.hp -= 50
        player.setPosition(this.startingPOSX, this.startingPOSY)
    }

    collectHeart(player, tile){
        if(tile.index === 31){
            this.sound.play('HeartPickUp', { volume: this.sliderValue })
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.ExtHeart = this.add.image(0,0,'heart').setOrigin(0,0)
            this.ExtHeart.setScrollFactor(0)
            this.ExtHeart.setVisible(false)
            this.ExtHeart.setInteractive()
            this.ExtHeart.on('pointerdown', () => {
                this.ConfirmationBackground.setVisible(true)
                this.heartConfirmation.setVisible(true)
                this.yes.setVisible(true)
                this.no.setVisible(true)
            })

            this.yes.on('pointerdown', () => {
                if(this.player.hp + 50 <= 100) this.player.hp += 50
                else this.player.hp = 100
                this.ExtHeart.destroy()
                this.ConfirmationBackground.setVisible(false)
                this.heartConfirmation.setVisible(false)
                this.yes.setVisible(false)
                this.no.setVisible(false)
                this.slots = this.slots.filter(slot => slot.item !== this.ExtHeart)
            })

            this.no.on('pointerdown', () => {
                this.ConfirmationBackground.setVisible(false)
                this.heartConfirmation.setVisible(false)
                this.yes.setVisible(false)
                this.no.setVisible(false)
            })

            this.addItemToInventory(this.ExtHeart)
        }
    }

    collectKey(player, tile){
        if(tile.index === 41){
            this.sound.play('KeyPickUp', { volume: this.sliderValue })
            this.groundLayer.removeTileAt(tile.x, tile.y)
            this.Key = this.add.image(0,0,'key').setOrigin(0,0)
            this.Key.setScrollFactor(0)
            this.Key.setVisible(false)
            this.keysCollected++
            this.addItemToInventory(this.Key)
        }
    }

    gameOver(){
        if(this.player.hp <= 0){
            this.scene.start('LevelMenu', { levelId: this.levelId, score: this.coinScore })
            this.resetGameState()
        }
    }

    attackHitWall(attack, tile){
        let { x, y } = this.map.tileToWorldXY(tile.x, tile.y)   
        if(tile.x == attack.x && tile.y == attack.y || tile.index == 48){
            attack.destroy()   
        }   
    }

    resetGameState() {
        this.cache.json.remove('mapData')
        this.startingPOSX = 150
        this.startingPOSY = config.height - 360
        this.currentPlayerState = this.playerState.IDLE
        this.powerUp = false
        this.coinScore = 0
        this.cameradown = false
        this.canShoot = true
        this.canAttack = true
        this.buttons = 0
        this.hit = 3
        this.totalKeys = 0
        this.keysCollected = 0
        this.PressedButtons = 0
        this.menu = false
        this.player.hp = 100
        this.inventoryContainer.setVisible(false)
        if (this.slots) {
            this.slots.forEach(slot => {
                if (slot.item) {
                    slot.item.destroy()
                    slot.item = null
                }
            })
        }
        this.enemiesType1.clear(true, true)
        this.enemiesType2.clear(true, true)
        this.enemiesType3.clear(true, true)
    }

    update(){
        this.hpBar.clear()
        this.hpBar.fillStyle(0xff0000)
        this.hpBar.fillRect(this.player.x -49, this.player.y - 50, this.player.hp, 5)

        if (!this.cameras.main.worldView.contains(this.portal.x, this.portal.y)) {
            this.portal.play("portalopen")
            this.portal.once('animationcomplete', () => {
                this.portal.play("portal")
            })
        }

        if(this.powerUp == 'jump' || this.powerUp == 'air' || this.powerUp == 'fire'){ 
            this.timerLineNeki -= 0.5
            this.timerLine.clear()
            this.timerLine.lineStyle(10, 0x00ff00, 1)
            this.timerLine.beginPath()
                .moveTo(this.camera.width - this.timerLineNeki, 150)
                .lineTo(this.camera.width - 200, 150)
                .setScrollFactor(0)
                .closePath()
                .strokePath()
        }

        if (this.player.y > 900) {
            this.cameradown = true
            
            this.tweens.add({
                targets: this.cameras.main,
                scrollY: this.player.y - this.cameras.main.worldView.height / 2,
                duration: 1000, 
                ease: 'Linear' 
            })
        } else if(this.cameradown == true && this.player.y < 900){
            this.cameradown = false
            this.tweens.add({
                targets: this.cameras.main,
                scrollY: 0,
                duration: 2000,
                ease: 'Linear'
            })
        }

        this.movePlayer()
        
        if (Phaser.Input.Keyboard.JustDown(this.shoot) && this.canShoot == true) {
            this.currentPlayerState = this.playerState.ATTACK
            this.canShoot = false
            if (!this.powerUp || this.powerUp == 'jump' || this.powerUp == 'speed') {
                if (this.player.flipX){
                    this.attack = this.physics.add.sprite(this.player.x -50, this.player.y, "Mageattack")
                    this.attack.setVelocityX(-600)
                    this.attack.flipX = true
                } 
                else{
                    this.attack = this.physics.add.sprite(this.player.x +50, this.player.y, "Mageattack")
                    this.attack.setVelocityX(600)
                }

                this.attack.body.setAllowGravity(false)
                this.attack.play("Mage_Attack")

                this.attack.once('animationcomplete', () => {
                    this.currentPlayerState = this.playerState.IDLE
                    this.attack.destroy()
                })
            } else if(this.powerUp == 'fire') {
                if (this.player.flipX){
                    this.attack = this.physics.add.sprite(this.player.x -50, this.player.y, "Attackred")
                    this.attack.setVelocityX(-400)
                    this.attack.flipX = true
                } 
                else{
                    this.attack = this.physics.add.sprite(this.player.x +50, this.player.y, "Attackred")
                    this.attack.setVelocityX(400)
                }
                this.attack.setScale(2)

                this.attack.body.setAllowGravity(false)
                this.attack.play("Attack_red")
                this.attack.once('animationcomplete', () => {
                    this.currentPlayerState = this.playerState.IDLE
                    this.attack.destroy()
                })
            }else if(this.powerUp == 'air') {
                if (this.player.flipX){
                    this.attack = this.physics.add.sprite(this.player.x -200, this.player.y, "Attackgray")
                }
                else{
                    this.attack = this.physics.add.sprite(this.player.x +200, this.player.y, "Attackgray")
                }
                this.attack.setScale(2)
                this.attack.setVelocityX(2)
                this.attack.body.setAllowGravity(false)
                this.attack.play("Attack_gray")
                this.attack.once('animationcomplete', () => {
                    this.currentPlayerState = this.playerState.IDLE
                    this.attack.destroy()
                })
            }
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.canShoot = true
                }
            })
        }

        if (this.attack) {
            this.physics.add.overlap(this.attack, this.groundLayer, this.barrel, null, this)
            this.physics.overlap(this.attack, this.enemiesType2, this.attackHitEnemy, null, this)
            this.physics.overlap(this.attack, this.enemiesType3, this.attackHitEnemy, null, this)
            this.physics.overlap(this.attack, this.enemiesType1, this.attackHitEnemy, null, this)
            this.physics.add.collider(this.attack, this.groundLayer, this.attackHitWall, null, this)
        }
        
    if (this.enemiesType1 && this.enemiesType1.getChildren) {
        this.enemiesType1.getChildren().forEach(enemy => {
            enemy.body.immovable = true
            enemy.body.setSize(enemy.width, enemy.anims.currentFrame.height)
            this.enemyTouchPlayer(this.player, enemy)
            if (enemy.anims.currentAnim.key !== enemy.previousAnimKey) {
                enemy.previousAnimKey = enemy.anims.currentAnim.key
            }
            let distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y)
          
            if (distance < 200 && this.canAttack) {
                this.canAttack = false
                enemy.x = (enemy.flipX ? enemy.x + 60 : enemy.x - 60)
                enemy.play('Enemy1_Attack2')
                this.time.addEvent({
                    delay: 4500,
                    callback: () => {
                        this.canAttack = true
                    },
                })
        
                enemy.once('animationcomplete', () => {
                    enemy.x = (enemy.flipX ? enemy.x - 60 : enemy.x + 60)
                    enemy.play('Enemy1_idle')
                })
            } else if(distance > 200){
                if (Math.abs(enemy.body.velocity.x) > 0.1 && enemy.anims.currentAnim.key !== 'Enemy2_Attack2') {
                    if (!this.enemyAttack || !this.enemyAttack.active) {
                        enemy.play('Enemy1_Walk', true)
                    }
                }
                if(enemy.anims.currentAnim.key != 'Enemy1_idle') enemy.setVelocityX(this.player.x < enemy.x ? -gameSettings.enemySpeed : gameSettings.enemySpeed)
                else enemy.setVelocityX(0)
                enemy.setFlipX(this.player.x > enemy.x)
            }
        })
    }  
    if (this.enemiesType2 && this.enemiesType2.getChildren) {
        this.enemiesType2.getChildren().forEach(enemy => {
            enemy.body.immovable = true
            enemy.body.setSize(enemy.width, enemy.anims.currentFrame.height)
            this.enemyTouchPlayer(this.player, enemy)
            if (enemy.anims.currentAnim.key !== enemy.previousAnimKey) {
                enemy.previousAnimKey = enemy.anims.currentAnim.key
            }
            let distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y)
          
            if (distance < 200 && this.canAttack) {
                this.canAttack = false
                enemy.x = (enemy.flipX ? enemy.x + 60 : enemy.x - 60)
                enemy.play('Enemy2_Attack2')
                this.time.addEvent({
                    delay: 4500,
                    callback: () => {
                        this.canAttack = true
                    },
                })
                enemy.once('animationcomplete', () => {
                    enemy.x = (enemy.flipX ? enemy.x - 60 : enemy.x + 60)
                    enemy.play('Enemy2_idle')
                })
            } else if(distance > 200){
                if (Math.abs(enemy.body.velocity.x) > 0.1 && enemy.anims.currentAnim.key !== 'Enemy2_Attack2') {
                    if (!this.enemyAttack || !this.enemyAttack.active) {
                        enemy.play('Enemy2_Walk', true)
                    }
                }
                if(enemy.anims.currentAnim.key != 'Enemy2_idle') enemy.setVelocityX(this.player.x < enemy.x ? -gameSettings.enemySpeed : gameSettings.enemySpeed)
                else enemy.setVelocityX(0)
                enemy.setFlipX(this.player.x > enemy.x)
            }
        })
    }if (this.enemiesType3 && this.enemiesType3.getChildren) {
        this.enemiesType3.getChildren().forEach(enemy => {
            enemy.body.immovable = true
            enemy.body.setSize(enemy.width, enemy.anims.currentFrame.height)
            this.enemyTouchPlayer(this.player, enemy)
            if (enemy.anims.currentAnim.key !== enemy.previousAnimKey) {
                enemy.previousAnimKey = enemy.anims.currentAnim.key
            }
            let distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y)
            if (distance < 400) {
                if(enemy.anims.currentAnim.key !== 'enemy3atk') enemy.play('enemy3atk')
                enemy.setVelocityX(this.player.x < enemy.x ? -gameSettings.enemySpeed : gameSettings.enemySpeed)
                enemy.setFlipX(this.player.x > enemy.x)
            } else if(distance >= 400){
                if(enemy.anims.currentAnim.key !== 'enemy3idle') enemy.play('enemy3idle')
                enemy.setVelocityX(0)
            }
        })
    }
        if(this.player.body.bottom >= this.map.heightInPixels) 
            this.loseHP(this.player)
    if (this.enemiesType2 && this.enemiesType2.getChildren) {
        this.enemiesType2.getChildren().forEach(enemy => {
            if(enemy.body.bottom >= this.map.heightInPixels)
            enemy.destroy()
        })
    }
    if (this.enemiesType1 && this.enemiesType1.getChildren) {
        this.enemiesType1.getChildren().forEach(enemy => {
            if(enemy.body.bottom >= this.map.heightInPixels)
            enemy.destroy()
        })
    }
    if (this.enemiesType3 && this.enemiesType3.getChildren) {
        this.enemiesType3.getChildren().forEach(enemy => {
            if(enemy.body.bottom >= this.map.heightInPixels)
            enemy.destroy()
        })
    }
        this.gameOver()
    }
}