export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  init () {
    this.cuteGirl = null;
    this.girlRect = null;
    this.girlHovered = false;

    this.cuteBoy = null;
    this.boyRect = null;
    this.boyHovered = false;

    this.player = null;
    this.playerSprites = {
      girl: {
        Idle: 16,
        Jump: 10,
        Run: 20,
        Dead: 30
      },
      boy: {
        Idle: 15,
        Jump: 10,
        Run: 15,
        Dead: 15
      }
    };
  }

  preload () {
    this.load.path = '../../assets/';

    let sprites = this.playerSprites;
    for (let [key1, value1] of Object.entries(sprites)) {
      for (let [key, value] of Object.entries(sprites[key1])) {
        for (let i=1; i<=value; i++) {
          this.load.image(`${key1}${key}${i}`, `${key1}/${key} (${i}).png`);
        }
      }      
    }

  }

  create () {
    this.add.text(220, 100, 'Choose your character and play!', { fontSize: '20px', fill: '#ffffff'});

    this.girlRect = this.add.rectangle(280, 360, 200, 300, 0x000000, 1);
    this.cuteGirl = this.add.sprite(280, 370, 'cuteGirl').setScale(0.4);
    this.add.text(260, 520, 'sarah', { fontSize: '18px', fill: '#ffffff'});
    this.girlRect.setInteractive();

    this.boyRect = this.add.rectangle(520, 360, 200, 300, 0x000000, 1);
    this.cuteBoy = this.add.sprite(600, 360, 'cuteBoy').setScale(0.4);
    this.add.text(490, 520, 'jerico', { fontSize: '18px', fill: '#ffffff'});
    this.boyRect.setInteractive();

    this.createPlayerAnimations();

    this.girlRect.on('pointerover', () => this.girlHovered = true );
    this.girlRect.on('pointerout', () => this.girlHovered = false );

    this.boyRect.on('pointerover', () => this.boyHovered = true );
    this.boyRect.on('pointerout', () => this.boyHovered = false );

    this.girlRect.on('pointerdown', () => {
      this.player = this.cuteGirl;
      this.scene.stop('StarScene')
      this.scene.start('GameScene', { player: this.player, gender: 'girl' })
    })

    this.boyRect.on('pointerdown', () => {
      this.player = this.cuteBoy;
      this.scene.stop('StarScene')
      this.scene.start('GameScene', { player: this.player, gender: 'boy' })
    })
  }

  update () {
    if (!this.girlHovered) this.cuteGirl.anims.play('girlIdle', true);
    else this.cuteGirl.anims.play('girlJump', true);

    if (!this.boyHovered) this.cuteBoy.anims.play('boyIdle', true);
    else this.cuteBoy.anims.play('boyJump', true);
  }

  createPlayerAnimations () {
    this.anims.create({
      key: 'girlIdle',
      frames: this.getFrames('girl', 'Idle'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlJump',
      frames: this.getFrames('girl', 'Jump'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlRun',
      frames: this.getFrames('girl', 'Run'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlDie',
      frames: this.getFrames('girl', 'Dead'),
      frameRate: 20,
    });

    this.anims.create({
      key: 'boyIdle',
      frames: this.getFrames('boy', 'Idle'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyJump',
      frames: this.getFrames('boy', 'Jump'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyRun',
      frames: this.getFrames('boy', 'Run'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyDie',
      frames: this.getFrames('boy', 'Dead'),
      frameRate: 20,
    });
  }

  getFrames (gender, action) {
    let frames = [];
    for (let i=1; i<=this.playerSprites[gender][action]; i++) {
      frames.push({ key: `${gender}${action}${i}` });
    }
    return frames;
  }
}
