import ProgressBar from '../classes/ProgressBar.js';

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
    /*this.playerSprites = {
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
    };*/
    this.playerSprites = {
      'girl/Idle' : 16,
      'girl/Jump' : 10,
      'girl/Run'  : 20,
      'girl/Dead' : 30,
      'boy/Idle'  : 15,
      'boy/Jump'  : 10,
      'boy/Run'   : 15,
      'boy/Dead'  : 15
    };

    this.progressBar = null;
  }

  preload () {
    let progressBar = new ProgressBar(this);

    this.load.path = '../../assets/';

/*    let sprites = this.playerSprites;
    for (let [key1, value1] of Object.entries(sprites)) {
      for (let [key, value] of Object.entries(sprites[key1])) {
        for (let i=1; i<=value; i++) {
          this.load.image(`${key1}${key}${i}`, `${key1}/${key} (${i}).png`);
        }
      }      
    }*/

    this.load.multiatlas('assets', 'assets.json', 'assets');

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

    this.progressBar = progressBar;
  }

  create () {
    this.add.text(220, 100, 'Choose your character and play!', { fontSize: '20px', fill: '#ffffff'});

    this.createPlayerBoxes();

    this.setPlayerMouseActions();    

    this.createPlayerAnimations();
  }

  update () {
    if (!this.girlHovered) this.cuteGirl.anims.play('girlIdle', true);
    else this.cuteGirl.anims.play('girlJump', true);

    if (!this.boyHovered) this.cuteBoy.anims.play('boyIdle', true);
    else this.cuteBoy.anims.play('boyJump', true);
  }

  createPlayerBoxes () {
    this.girlRect = this.add.rectangle(280, 360, 200, 300, 0x000000, 1);
    this.cuteGirl = this.add.sprite(280, 370, 'assets', 'girl/Idle (1).png').setScale(0.4);
    this.add.text(260, 520, 'sarah', { fontSize: '18px', fill: '#ffffff'});
    this.girlRect.setInteractive();

    this.boyRect = this.add.rectangle(520, 360, 200, 300, 0x000000, 1);
    this.cuteBoy = this.add.sprite(580, 370, 'assets', 'boy/Idle (1).png').setScale(0.4);
    this.add.text(490, 520, 'jerico', { fontSize: '18px', fill: '#ffffff'});
    this.boyRect.setInteractive();
  }

  setPlayerMouseActions () {
    this.girlRect.on('pointerover', () => this.girlHovered = true );
    this.girlRect.on('pointerout', () => this.girlHovered = false );

    this.boyRect.on('pointerover', () => this.boyHovered = true );
    this.boyRect.on('pointerout', () => this.boyHovered = false );

    this.girlRect.on('pointerdown', () => {
      this.player = this.cuteGirl;
      this.scene.stop('StarScene');
      this.scene.start('GameScene', { player: this.player, gender: 'girl' });
    })

    this.boyRect.on('pointerdown', () => {
      this.player = this.cuteBoy;
      this.scene.stop('StarScene');
      this.scene.start('GameScene', { player: this.player, gender: 'boy' });
    })
  }

  createPlayerAnimations () {
/*    let sprites = this.playerSprites;
    for (let [key1, value1] of Object.entries(sprites)) {
      for (let [key, value] of Object.entries(sprites[key1])) {
        for (let i=1; i<=value; i++) {
          this.anims.create({
            key: `${key1}${key}`,
            frames: this.getFrames(key1, key),
            frameRate: 20,
            repeat: key === 'Dead' ? 0 : -1
          });
        }
      }      
    }*/
    for (let [key, value] of Object.entries(this.playerSprites)) {
      this.anims.create({
        key: `${key.replace('/', '')}`,
        frames: this.anims.generateFrameNames('assets', {
          start: 1,
          end: value,
          prefix: `${key} (`,
          suffix: ').png'
        }),
        frameRate: 20,
        repeat: key.includes('Dead') ? 0 : -1 
      })
    }
  }

/*  getFrames (gender, action) {
    let frames = [];
    for (let i=1; i<=this.playerSprites[gender][action]; i++) {
      frames.push({ key: `${gender}${action}${i}` });
    }
    return frames;
  }*/
}
