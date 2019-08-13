export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload () {

  }

  create () {
    this.add.text(95, 250, 'Click to Start!', { fontSize: '30px', fill: '#ffffff' });
    this.input.on('pointerdown', () => {
      this.scene.stop('StarScene')
      this.scene.start('GameScene')
    })
  }
}
