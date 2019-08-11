import GameScene from './GameScene.js'

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
    // Phaser.Scene.call(this, { key: 'StartScene', active: true });
  }

  create() {
    this.add.text(95, 250, 'Click to Start!', { fontSize: '30px', fill: '#00eeee' });
    this.input.on('pointerdown', () => {
      this.scene.stop('StarScene')
      this.scene.start('GameScene')
    })
  }
}
