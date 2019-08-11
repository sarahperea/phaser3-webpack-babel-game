import sky from "../../assets/bg.jpg";
import ground1 from "../../assets/ground1.png";
import star from "../../assets/star.png";
import bomb from "../../assets/bomb.png";
import dude from "../../assets/dude.png";

export default class GameScene extends Phaser.Scene {

  constructor ()
  {
    super('GameScene');

    this.player = null;
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
    this.load.audio('theme', [
        '../../assets/audio/jackinthebox.mp3'
    ],{
        instances: 2
    });
    this.load.image('sky', sky);
    this.load.image('ground', ground1);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('fullscreen', dude, { frameWidth: 32, frameHeight: 48 });
  }

  create ()
  {
    let music = this.sound.add('theme', {loop: true});

    music.play({
        seek: 2.550
    });

    this.add.image(400, 300, 'sky');

    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    const player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(this.bombs, platforms);

    this.physics.add.overlap(player, this.stars, this.collectStar, null, this);

    this.physics.add.collider(player, this.bombs, this.hitBomb, null, this);

    this.player = player;

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

    this.scoreText.setText('v15');

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
  }

  update ()
  {
    if (this.gameOver)
      return

    const cursors = this.cursors;
    const player = this.player;

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
  }

  collectStar (player, star)
  {
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    if (this.stars.countActive(true) === 0)
    {
      //  A new batch of stars to collect
      this.stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
      });

      let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      let bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }

  hitBomb (player, bomb)
  {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
  }

}

