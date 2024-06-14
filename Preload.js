class Preload extends Phaser.Scene {

    constructor() {
        super("bootGame")
    }

    preload(){
//Slike
        for(let i = 1; i<8; i++) 
            this.load.image('background'+ i +'', 'Assets/Backgrounds/background_00' + i + '.png')
        
        this.load.image("tiles", "Assets/Tileset/Tilesetground.png")
        this.load.image('background', 'Assets/Backgrounds/cool2.png')
        this.load.image('bobsign', 'Assets/Backgrounds/boblogo.png')
        this.load.audio('bgMusic', 'Assets/Sounds/musik.mp3')
        this.load.image("heart", "Assets/Tileset/heart.png")
        this.load.image("key", "Assets/Tileset/Key.png")
        this.load.image("cave", "Assets/Backgrounds/cave.png")

//Spritesheeti
        this.load.spritesheet("player", "Assets/Entities/Mage/Mage Idle.png",{
            frameWidth: 32,
            frameHeight: 38
        })

        this.load.spritesheet("Enemy1", "Assets/Entities/Enemy1/VomfyGreen_Idle.png",{
            frameWidth: 40,
            frameHeight: 38
        })

        this.load.spritesheet("Enemy2", "Assets/Entities/Enemy2/VomfyPurple_Idle.png",{
            frameWidth: 40,
            frameHeight: 38
        })

        this.load.spritesheet("Enemy1_walk", "Assets/Entities/Enemy1/VomfyGreen_Walk.png",{
            frameWidth: 40,
            frameHeight: 48
        })

        this.load.spritesheet("Enemy2_walk", "Assets/Entities/Enemy2/VomfyPurple_Walk.png",{
            frameWidth: 40,
            frameHeight: 48
        })

        this.load.spritesheet("Enemy1_Attack2", "Assets/Entities/Enemy1/VomfyGreen_Attack2.png",{
            frameWidth: 112,
            frameHeight: 50
        })

        this.load.spritesheet("Enemy2_Attack2", "Assets/Entities/Enemy2/VomfyPurple_Attack2.png",{
            frameWidth: 112,
            frameHeight: 50
        })

        this.load.spritesheet("Mageattack", "Assets/Entities/Mage/attack.png",{
            frameWidth: 115,
            frameHeight: 24
        })

        this.load.spritesheet("Mageattackred", "Assets/Entities/Magered/Mageattack2.png",{
            frameWidth: 54,
            frameHeight: 54
        })

        this.load.spritesheet("Attackred", "Assets/Entities/Magered/Attack2.png",{
            frameWidth: 34,
            frameHeight: 14
        })

        this.load.spritesheet("Attackgray", "Assets/Entities/Magegray/Mageattack_gray.png",{
            frameWidth: 40,
            frameHeight: 50
        })

        this.load.spritesheet("portal", "/PurplePortal.png",{
            frameWidth: 64,
            frameHeight: 63
        })

        this.load.spritesheet("portalopen", "/PurplePortalOpen.png",{
            frameWidth: 64,
            frameHeight: 63
        })

        this.load.spritesheet("playerwalk", "Assets/Entities/Mage/Mage Walk.png",{
            frameWidth: 38,
            frameHeight: 44
        })

        this.load.spritesheet("playerred", "Assets/Entities/Magered/Magered Idle.png",{
            frameWidth: 32,
            frameHeight: 38
        })

        this.load.spritesheet("playergray", "Assets/Entities/Magegray/Magegrayidle.png",{
            frameWidth: 32,
            frameHeight: 38
        })

        this.load.spritesheet("playerwalkred", "Assets/Entities/Magered/Magered Walk.png",{
            frameWidth: 38,
            frameHeight: 42
        })

        this.load.spritesheet("playerwalkgray", "Assets/Entities/Magegray/Magegraywalk.png",{
            frameWidth: 38,
            frameHeight: 42
        })

        this.load.spritesheet('startButton', 'Assets/Buttons/Start.png',{
            frameHeight: 64,
            frameWidth: 256
        })
        this.load.spritesheet('editButton', 'Assets/Buttons/Edit.png',{
            frameHeight: 64,
            frameWidth: 256
        })
        this.load.spritesheet('settingsButton', 'Assets/Buttons/Settings.png',{
            frameHeight: 64,
            frameWidth: 256
        })

        this.load.spritesheet('backButton', 'Assets/Buttons/Back.png',{
            frameHeight: 64,
            frameWidth: 256
        })

        this.load.spritesheet('enemy3idle', 'Assets/Entities/Enemy3/enemy3idle.png',{
            frameHeight: 48,
            frameWidth: 64
        })

        this.load.spritesheet('enemy3atk', 'Assets/Entities/Enemy3/enemy3atk.png',{
            frameHeight: 50,
            frameWidth: 64
        })
//Zvoki
        this.load.audio('CollectCoin', 'Assets/Sounds/collectcoin.mp3')
        this.load.audio('PowerupPickUp', 'Assets/Sounds/powerup.mp3')
        this.load.audio('BarrelBreak', 'Assets/Sounds/Barrelbreak.mp3')
        this.load.audio('HeartPickUp', 'Assets/Sounds/HeartPickup.mp3')
        this.load.audio('KeyPickUp', 'Assets/Sounds/KeyPickup.mp3')
        this.load.audio('ButtonClick', 'Assets/Sounds/ButtonClick.mp3')
    }

    create(){
        this.scene.start("MainMenu")
        

//naredimo animacije ki se prenesejo

        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "Enemy1_idle",
            frames: this.anims.generateFrameNumbers("Enemy1"),
            frameRate: 4,
            repeat: -1
        })

        this.anims.create({
            key: "Enemy2_idle",
            frames: this.anims.generateFrameNumbers("Enemy2"),
            frameRate: 4,
            repeat: -1
        })

        this.anims.create({
            key: "Enemy1_Walk",
            frames: this.anims.generateFrameNumbers("Enemy1_walk"),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "Enemy2_Walk",
            frames: this.anims.generateFrameNumbers("Enemy2_walk"),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "Enemy1_Attack2",
            frames: this.anims.generateFrameNumbers("Enemy1_Attack2"),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "Enemy2_Attack2",
            frames: this.anims.generateFrameNumbers("Enemy2_Attack2"),
            frameRate: 5,
            repeat: 0
        })

        this.anims.create({
            key: "Mage_Attack",
            frames: this.anims.generateFrameNumbers("Mageattack"),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: "Mage_attackred",
            frames: this.anims.generateFrameNumbers("Mageattackred"),
            frameRate: 15,
            repeat: 0
        })

        this.anims.create({
            key: "Attack_red",
            frames: this.anims.generateFrameNumbers("Attackred"),
            frameRate: 2,
            repeat: 0
        })

        this.anims.create({
            key: "Attack_gray",
            frames: this.anims.generateFrameNumbers("Attackgray"),
            frameRate: 8,
            repeat: 0
        })

        this.anims.create({
            key: "player_walk",
            frames: this.anims.generateFrameNumbers("playerwalk"),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "player_idlered",
            frames: this.anims.generateFrameNumbers("playerred"),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "player_idlegray",
            frames: this.anims.generateFrameNumbers("playergray"),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: "player_walkred",
            frames: this.anims.generateFrameNumbers("playerwalkred"),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "player_walkgray",
            frames: this.anims.generateFrameNumbers("playerwalkgray"),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "portal",
            frames: this.anims.generateFrameNumbers("portal"),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: "portalopen",
            frames: this.anims.generateFrameNumbers("portalopen"),
            frameRate: 6,
            repeat: 0
        })

        this.anims.create({
            key: "startbuttonclick",
            frames: this.anims.generateFrameNumbers("startButton"),
            frameRate: 20,
            repeat: 0
        })

        this.anims.create({
            key: "editbuttonclick",
            frames: this.anims.generateFrameNumbers("editButton"),
            frameRate: 20,
            repeat: 0
        })

        this.anims.create({
            key: "settingsbuttonclick",
            frames: this.anims.generateFrameNumbers("settingsButton"),
            frameRate: 20,
            repeat: 0
        })
                
        this.anims.create({
            key: "backbuttonclick",
            frames: this.anims.generateFrameNumbers("backButton"),
            frameRate: 20,
            repeat: 0
        })

        this.anims.create({
            key: "enemy3idle",
            frames: this.anims.generateFrameNumbers("enemy3idle"),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: "enemy3atk",
            frames: this.anims.generateFrameNumbers("enemy3atk"),
            frameRate: 10,
            repeat: -1
        })

        
    }

}