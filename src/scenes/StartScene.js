export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');

    this.cuteGirl = null;
    this.cuteBoy = null;
  }

  preload () {
    this.load.path = '../../assets/';

    for(let i=1; i<=16; i++) {
      this.load.image(`girlIdle${i}`, `girl/Idle (${i}).png`);
    }

    for(let i=1; i<=15; i++) {
      this.load.image(`boyIdle${i}`, `boy/Idle (${i}).png`);
    }
  }

  create () {
    // this.add.text(95, 250, 'Click to Start!', { fontSize: '30px', fill: '#ffffff' });
    this.add.text(220, 100, 'Choose your character and play!', { fontSize: '20px', fill: '#ffffff'});

    this.add.rectangle(280, 360, 200, 300, 0x000000, 1);
    this.cuteGirl = this.add.sprite(280, 370, 'cuteGirl').setScale(0.40);
    this.add.text(260, 520, 'sarah', { fontSize: '18px', fill: '#ffffff'});

    this.add.rectangle(520, 360, 200, 300, 0x000000, 1);
    this.cuteBoy = this.add.sprite(600, 360, 'cuteBoy').setScale(0.5);
    this.add.text(490, 520, 'jerico', { fontSize: '18px', fill: '#ffffff'});

    this.createPlayerAnimations();

    this.input.on('pointerdown', () => {
      this.scene.stop('StarScene')
      this.scene.start('GameScene')
    })
  }

  update () {
    this.cuteGirl.anims.play('girlIdle', true);
    this.cuteBoy.anims.play('boyIdle', true)
  }

  createPlayerAnimations () {
    this.anims.create({
      key: 'girlIdle',
      frames: this.getGirlIdleFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyIdle',
      frames: this.getBoyIdleFrames(),
      frameRate: 20,
      repeat: -1
    });

  }

  getGirlIdleFrames () {
    let frames = [];
    for (let i=1; i<=16; i++) {
      frames.push({ key: `girlIdle${i}` })
    }
    return frames;    
  }

  getBoyIdleFrames () {
    let frames = [];
    for (let i=1; i<=15; i++) {
      frames.push({ key: `boyIdle${i}` })
    }
    return frames;    
  }

}
