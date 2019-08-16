export default class ProgressBar {

	constructor(scene) {
		this.scene = scene;

		this.init();
	}

	init () {
		this.progressBar = this.scene.add.graphics();
		this.progressBox = this.scene.add.graphics()
			.fillStyle(0x222222, 0.8)
			.fillRect(240, 270, 320, 50);

		this.loadingText = this.makeText('Loading.......', -50);
		this.percentText = this.makeText('0%', -5);
		this.assetText = this.makeText('', 50);
	}

	makeText (text, adj) {
		return this.scene.make.text({
	      x: this.scene.cameras.main.width / 2,
	      y: this.scene.cameras.main.height / 2 + adj,
	      text: text,
	      style: {
	          font: '18px monospace',
	          fill: '#ffffff'
	      }
	    }).setOrigin(0.5, 0.5);
	};

	getProgress (value) {
		this.progressBar
			.clear()
        	.fillStyle(0xffffff, 1)
        	.fillRect(250, 280, 300 * value, 30);
        this.percentText.setText(parseInt(value * 100) + '%');
	}

	getFileProgress (file) {
		this.assetText.setText('Loading asset: ' + file.src);
	}

}