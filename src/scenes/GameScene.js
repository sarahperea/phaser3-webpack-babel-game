import sky from "../../assets/BG.png";
import ground1 from "../../assets/13.png";
import ground2 from "../../assets/14.png";
import ground3 from "../../assets/15.png";
import ground4 from "../../assets/16.png";
import star from "../../assets/star.png";
import bomb from "../../assets/bomb.png";
import dude from "../../assets/dude.png";
import StartScene from "./StartScene.js"

export default class GameScene extends Phaser.Scene {

  constructor ()
  {
    super('GameScene');

    this.player = null;
    this.platforms = null;
    this.stars = null;
    this.bombs = null;
    this.cursors = null;
    this.score = 0;
    this.gameOver = false;
    this.scoreText = "";
    this.sound = null;
  }

  preload ()
  {
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
          font: '20px monospace',
          fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    let percentText = this.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: '0%',
    style: {
      font: '18px monospace',
      fill: '#ffffff'
    }
    });
    percentText.setOrigin(0.5, 0.5);

    let assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
          font: '18px monospace',
          fill: '#ffffff'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.audio('theme', [
        '../../assets/audio/jackinthebox.mp3'
    ],{
        instances: 2
    });
    this.load.image('sky', sky);
    this.load.image('ground1', ground1); //soil
    this.load.image('ground2', ground2);
    this.load.image('ground3', ground3);
    this.load.image('ground4', ground4);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('fullscreen', dude, { frameWidth: 32, frameHeight: 48 });

    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });
                
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.src);
    });
     
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  create ()
  {
    let music = this.sound.add('theme', {loop: true});

    music.play({
        seek: 2.550
    });

    this.add.image(400, 300, 'sky');

    this.setupPlatforms();
    this.setupPlayer();
    this.createPlayerAnimations();

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

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.setupCollidersAndOverlaps();

    // this.createFullScreenBtn();
  }

  update ()
  {
    if (this.gameOver)
      return

    const cursors = this.cursors;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else  {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

/*  createFullScreenBtn () {
    const button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

    button.on('pointerup', function () {
      if (this.scale.isFullscreen)
      {
        button.setFrame(0);
        this.scale.stopFullscreen();
      }
      else
      {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    }, this);

    const FKey = this.input.keyboard.addKey('F');

    FKey.on('down', function () {
      if (this.scale.isFullscreen)
      {
        button.setFrame(0);
        this.scale.stopFullscreen();
      }
      else
      {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    }, this);
  }*/

  setupPlatforms () {
    this.platforms = this.physics.add.staticGroup({
      key: 'ground1',
      repeat: 11, //creates 12 stars
      setXY: { x: 0, y: 560, stepX: 70 } //stepX is distance
    });

    // this.platforms.create(400, 580, 'ground').setScale(2).refreshBody();
    this.platforms.create(500, 400, 'ground2');
    this.platforms.create(628, 400, 'ground3');
    this.platforms.create(756, 400, 'ground4');
/*    this.platforms.create(50, 250, 'ground3');
    this.platforms.create(750, 220, 'ground');*/
  }

  setupPlayer () {
    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
  }

  createPlayerAnimations () {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });    
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
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
    
    this.add.rectangle(400, 300, 280, 140, 0x000000, 1);
    this.add.text(320, 280, 'Game Over :(', { fontSize: '24px', fill: '#ffffff' });
    this.add.text(286, 310, 'Click the screen to restart', { fontSize: '14px', fill: '#ffffff' })

    this.input.on('pointerdown', () => {
      this.score = 0;
      this.gameOver = false;
      this.scene.restart();
    });
  }

  setupCollidersAndOverlaps () {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  }

}

