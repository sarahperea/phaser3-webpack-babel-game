import ProgressBar from '../classes/ProgressBar.js';
import Player from '../classes/Player.js';

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
    this.bgMusic = null;
  }

  preload ()
  {
    let progressBar = new ProgressBar(this);

    this.load.path = '../../assets/';

    this.load.audio('theme', [
        '../../assets/audio/jackinthebox.mp3'
    ],{
        instances: 2
    });
    this.load.image('bg', 'BG.png');
    this.load.image('ground1', '13.png'); //soil
    this.load.image('ground2', '14.png');
    this.load.image('ground3', '15.png');
    this.load.image('ground4', '16.png');
    this.load.image('star', 'star.png');
    this.load.image('bomb', 'bomb.png');

    for(let i=1; i<=20; i++) {
      this.load.image(`girlRun${i}`, `girl/Run (${i}).png`);
    }

    for(let i=1; i<=16; i++) {
      this.load.image(`girlIdle${i}`, `girl/Idle (${i}).png`);
    }

    for(let i=1; i<=30; i++) {
      this.load.image(`girlDead${i}`, `girl/Dead (${i}).png`);
    }

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
    this.bgMusic = this.sound.add('theme', {loop: true});

    this.bgMusic.play();

    let background = this.add.image(0, 0, 'bg').setOrigin(0,0);
    background.setTint('0x555555');
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

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.setupCollidersAndOverlaps();

    // this.createFullScreenBtn();
  }

  update ()
  {
    if (this.gameOver) {
      // if (this.player.y > 455) {
        this.physics.pause()
      // }
      return;
    }

    const cursors = this.cursors;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-360);
      this.player.anims.play('left', true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(360);
      this.player.anims.play('right', true);
      this.player.flipX = false;
    } else  {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
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
      setXY: { x: 0, y: 600, stepX: 70 } //stepX is distance
    });

    // this.platforms.create(400, 580, 'ground').setScale(2).refreshBody();
    this.platforms.create(500, 410, 'ground2');
    this.platforms.create(628, 410, 'ground3');
    this.platforms.create(756, 410, 'ground4');
  }

  setupPlayer () {
/*    this.player = this.physics.add.sprite(100, 450, 'girlRun1');
    this.player.setScale(0.17);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);*/
    this.player = new Player(this).player;
  }

  createPlayerAnimations () {
    this.anims.create({
      key: 'left',
      frames: this.getGirlRunFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.getGirlIdleFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.getGirlRunFrames(),
      frameRate: 20,
      repeat: -1
    });   

    this.anims.create({
      key: 'die',
      frames: this.getGirlDeadFrames(),
      frameRate: 20
    });

  }

  getGirlRunFrames () {
    let frames = [];
    for (let i=1; i<=20; i++) {
      frames.push({ key: `girlRun${i}` })
    }
    return frames;
  }

  getGirlIdleFrames () {
    let frames = [];
    for (let i=1; i<=16; i++) {
      frames.push({ key: `girlIdle${i}` })
    }
    return frames;    
  }

  getGirlDeadFrames () {
    let frames = [];
    for (let i=1; i<=30; i++) {
      frames.push({ key: `girlDead${i}` })
    }
    return frames;        
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
    player.anims.play('die');
    this.gameOver = true;
    
    this.add.rectangle(400, 300, 280, 60, 0x000000, 1);
    this.add.text(320, 276, 'Game Over :(', { fontSize: '24px', fill: '#ffffff' });
    this.add.text(286, 306, 'Click the screen to restart', { fontSize: '14px', fill: '#ffffff' })

    this.input.on('pointerdown', () => {
      this.score = 0;
      this.gameOver = false;
      this.bgMusic.stop();
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

