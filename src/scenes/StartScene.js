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
    this.progressBar = new ProgressBar(this);
  }

  preload () {

    this.load.path = '../../assets/';

    for (let [key, val] of Object.entries(this.playerSprites)) {
      for (let i = 1; i <= val; i++) {
        let keyCopy = key;
        this.load.image(`${ keyCopy.replace('/', '') }${ i }`, `${ key } (${ i }).png`);
      }
    }

    this.load.on('progress', function (value) {
      this.progressBar.getProgress(value);
    }, this);
                
    this.load.on('fileprogress', function (file) {
      this.progressBar.getFileProgress(file);
    }, this);
     
    this.load.on('complete', function () {
      this.destroyProgressBar();
    }, this);
  }

  create () {
    this.destroyProgressBar();

    this.add.text(220, 100, 'Choose your character and play!', { fontSize: '20px', fill: '#ffffff'});

    this.createPlayerBoxes();

    this.setPlayerMouseActions();    

    this.createPlayerAnimations();
  }

  update () {
    this.cuteGirl.anims.play( `girl${ this.girlHovered ? 'Jump' : 'Idle' }`, true);

    this.cuteBoy.anims.play( `boy${ this.boyHovered ? 'Jump' : 'Idle' }`, true);
  }

  createPlayerBoxes () {
    this.girlRect = this.add.rectangle(280, 360, 200, 300, 0x000000, 1);
    this.cuteGirl = this.add.sprite(280, 370, 'cuteGirl').setScale(0.4);
    this.add.text(260, 520, 'sarah', { fontSize: '18px', fill: '#ffffff'});
    this.girlRect.setInteractive();

    this.boyRect = this.add.rectangle(520, 360, 200, 300, 0x000000, 1);
    this.cuteBoy = this.add.sprite(580, 370, 'cuteBoy').setScale(0.4);
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
    for (let [key, val] of Object.entries(this.playerSprites)) {
      let keyCopy = key;
      this.anims.create({
        key: `${ keyCopy.replace('/', '') }`,
        frames: this.getFrames(keyCopy, val),
        frameRate: 20,
        repeat: key.includes('Dead') ? 0 : -1
      });
    }
  }

  getFrames (key, val) {
    let frames = [];
    for (let i = 1; i <= val; i++) {
      frames.push({ key: `${ key.replace('/','') }${ i }` });
    }

    return frames;
  }

  destroyProgressBar () {
    this.progressBar.bar.destroy();
    this.progressBar.box.destroy();
    this.progressBar.loadingText.destroy();
    this.progressBar.percentText.destroy();
    this.progressBar.assetText.destroy();
  }
}
