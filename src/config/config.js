import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  backgroundColor: '#4B0082',
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
  antialias: false, //prevent sprites from looking blurry,
}