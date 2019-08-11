import config from './config/config.js'
import GameScene from './scenes/GameScene.js'

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('Game', GameScene);
    this.scene.start('Game');
  }
}

window.onload = () => {
  window.game = new Game();
}