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
  }

  preload () {
    this.load.path = '../../assets/';

    for(let i=1; i<=16; i++) {
      this.load.image(`girlIdle${i}`, `girl/Idle (${i}).png`);
    }

    for(let i=1; i<=10; i++) {
      this.load.image(`girlJump${i}`, `girl/Jump (${i}).png`);
    }

    for(let i=1; i<=20; i++) {
      this.load.image(`girlRun${i}`, `girl/Run (${i}).png`);
    }

    for(let i=1; i<=30; i++) {
      this.load.image(`girlDead${i}`, `girl/Dead (${i}).png`);
    }      

    for(let i=1; i<=15; i++) {
      this.load.image(`boyIdle${i}`, `boy/Idle (${i}).png`);
    }

    for(let i=1; i<=10; i++) {
      this.load.image(`boyJump${i}`, `boy/Jump (${i}).png`);
    }

    for(let i=1; i<=15; i++) {
      this.load.image(`boyRun${i}`, `boy/Run (${i}).png`);
    }

    for(let i=1; i<=15; i++) {
      this.load.image(`boyDead${i}`, `boy/Dead (${i}).png`);
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
      frames: this.getGirlIdleFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlJump',
      frames: this.getGirlJumpFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlRun',
      frames: this.getGirlRunFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'girlDie',
      frames: this.getGirlDeadFrames(),
      frameRate: 20,
    });

    this.anims.create({
      key: 'boyIdle',
      frames: this.getBoyIdleFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyJump',
      frames: this.getBoyJumpFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyRun',
      frames: this.getBoyRunFrames(),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'boyDie',
      frames: this.getBoyDeadFrames(),
      frameRate: 20,
    });
  }

  getGirlIdleFrames () {
    let frames = [];
    for (let i=1; i<=16; i++) {
      frames.push({ key: `girlIdle${i}` })
    }
    return frames;    
  }

  getGirlJumpFrames () {
    let frames = [];
    for (let i=1; i<=10; i++) {
      frames.push({ key: `girlJump${i}` })
    }
    return frames;    
  }

  getGirlRunFrames () {
    let frames = [];
    for (let i=1; i<=20; i++) {
      frames.push({ key: `girlRun${i}` })
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

  getBoyIdleFrames () {
    let frames = [];
    for (let i=1; i<=15; i++) {
      frames.push({ key: `boyIdle${i}` })
    }
    return frames;    
  }

  getBoyJumpFrames () {
    let frames = [];
    for (let i=1; i<=10; i++) {
      frames.push({ key: `boyJump${i}` })
    }
    return frames;    
  }

  getBoyRunFrames () {
    let frames = [];
    for (let i=1; i<=15; i++) {
      frames.push({ key: `boyRun${i}` })
    }
    return frames;    
  }

  getBoyDeadFrames () {
    let frames = [];
    for (let i=1; i<=15; i++) {
      frames.push({ key: `boyDead${i}` })
    }
    return frames;    
  }
}
