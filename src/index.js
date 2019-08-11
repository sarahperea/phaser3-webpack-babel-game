import config from './config/config.js'
import StartScene from './scenes/StartScene.js'
import GameScene from './scenes/GameScene.js'

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('StartScene', StartScene);
    this.scene.add('GameScene', GameScene);
    this.scene.start('StartScene');
  }
}

window.onload = () => {
  window.game = new Game();
}