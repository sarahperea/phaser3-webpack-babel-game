import GameScene from '../scenes/gameScene/index.js'

export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  audio: {
    disableWebAudio: true
  },
  scene: GameScene,
  antialias: false, //prevent sprites from looking blurry,
}