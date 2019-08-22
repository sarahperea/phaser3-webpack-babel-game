import ProgressBar from '../classes/ProgressBar.js';
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {

  constructor ()
  {
    super('GameScene');
  }

  init (data)
  {
    this.player = data.player;
    this.gender = data.gender;
  }

  preload ()
  {
    let progressBar = new ProgressBar(this);

    this.load.path = '../../assets/';

    this.load.multiatlas('assets', 'assets.json', 'assets');

    this.load.audio('theme', [
        '../../assets/audio/jackinthebox.mp3'
    ],{
        instances: 2
    });

    this.load.image('ground1', '13.png'); //soil
    this.load.image('star', 'star.png');
    this.load.image('bomb', 'bomb.png');

    this.load.on('progress', function (value) {
      progressBar.getProgress(value);
    });
                
    this.load.on('fileprogress', function (file) {
      progressBar.getFileProgress(file);
    });
     
    this.load.on('complete', function () {
      progressBar.bar.destroy();
      progressBar.box.destroy();
      progressBar.loadingText.destroy();
      progressBar.percentText.destroy();
      progressBar.assetText.destroy();
    });
  }

  create ()
  {
    this.score = 0;

    this.bgMusic = this.sound.add('theme', {loop: true});
    this.bgMusic.play();

    // background
    this.add.image(0, 0, 'assets', 'BG.png')
      .setOrigin(0,0)
      .setTint('0x555555');

    this.setupPlatforms();
    this.setupPlayer();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11, //creates 12 stars
      setXY: { x: 12, y: 0, stepX: 70 } //stepX is distance
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.setupCollidersAndOverlaps();

    this.createFullScreenBtn();
  }

  update ()
  {
    if (this.gameOver) {
      this.physics.pause()
      return;
    }

    const cursors = this.cursors;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-360);
      if (this.gender === 'boy' && this.right) {
       this.player.x -= 40;
       this.right = false;
       this.left = true; 
      }
      this.player.anims.play(`${this.gender}Run`, true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.right = true;
      if (this.gender === 'boy' && this.left) {
         this.player.x += 40;
         this.left = false;
         this.right = true; 
      }
      this.player.setVelocityX(360);
      this.player.anims.play(`${this.gender}Run`, true);
      this.player.flipX = false;        
    } else  {
      this.player.setVelocityX(0);
      this.player.anims.play(`${this.gender}Idle`, true);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

  }

  createFullScreenBtn () {
    const fullscreenBtn = this.add.image(800-60, 20, 'girlIdle1', 0).setScale(0.09).setOrigin(1, 0).setInteractive();
    const mainMenuBtn = this.add.image(810, 11, 'boyIdle1', 0).setScale(0.1).setOrigin(1, 0).setInteractive();

    fullscreenBtn.on('pointerup', () => {
      if (this.scale.isFullscreen)
      {
        fullscreenBtn.setFrame(0);
        this.scale.stopFullscreen();
      }
      else
      {
        fullscreenBtn.setFrame(1);
        this.scale.startFullscreen();
      }
    }, this);

    mainMenuBtn.on('pointerup', () => {
      this.scene.stop('GameScene');
      this.scene.start('StartScene');
    });

    const FKey = this.input.keyboard.addKey('F');

    FKey.on('down', () => {
      if (this.scale.isFullscreen)
      {
        fullscreenBtn.setFrame(0);
        this.scale.stopFullscreen();
      }
      else
      {
        fullscreenBtn.setFrame(1);
        this.scale.startFullscreen();
      }
    }, this);
  }

  setupPlatforms () {
    this.platforms = this.physics.add.staticGroup({
      key: 'ground1',
      repeat: 11, //creates 12 stars
      setXY: { x: 0, y: 600, stepX: 70 } //stepX is distance
    });

    // this.platforms.create(400, 580, 'ground').setScale(2).refreshBody();
    this.platforms.create(500, 410, 'assets', '14.png');
    this.platforms.create(628, 410, 'assets', '15.png');
    this.platforms.create(756, 410, 'assets', '16.png');
  }

  setupPlayer () {
    this.player = this.physics.add.sprite(100, 450, 'girlRun1');
    this.player.setScale(0.17);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    // this.player = new Player(this).player;
  }

  collectStar (player, star)
  {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // creates new batch of stars when no. of stars = 0
    if (this.stars.countActive(true) === 0)
    {
      this.stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
      });
    }

    // creates bomb whenever player collides with star
    let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    let bomb = this.bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }

  hitBomb (player, bomb)
  {
    player.anims.play(`${this.gender}Dead`);
    this.gameOver = true;
    
    this.add.rectangle(400, 310, 280, 130, 0x000000, 1);
    this.add.text(320, 260, `Score: ${this.score}`, { fontSize: '28px', fill: '#ffffff' });
    this.add.text(330, 320, 'Game Over :(', { fontSize: '20px', fill: '#ffffff' });
    this.add.text(286, 346, 'Click the screen to restart', { fontSize: '14px', fill: '#ffffff' })

    this.input.on('pointerdown', () => {
      this.resetGame();
    });

    this.spaceKey = this.input.keyboard.addKey('space');
    this.spaceKey.on('down', () => {
      this.resetGame();
    })
  }

  resetGame () {
    if (this.gameOver) {
      this.score = 0;
      this.gameOver = false;
      this.bgMusic.stop();
      this.scene.restart();      
    }
  }

  setupCollidersAndOverlaps () {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }

}

