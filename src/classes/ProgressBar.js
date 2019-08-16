export default class ProgressBar {

	constructor(scene) {
		this.scene = scene;

		this.init();
	}

	init () {
		this.progressBar = this.scene.add.graphics();
		this.progressBox = this.scene.add.graphics();
		this.styleProgressBox();

	    const halfWidth = this.scene.cameras.main.width / 2;
	    const halfHeight = this.scene.cameras.main.height / 2;

		this.addLoadingText(halfWidth, halfHeight - 50);
		this.addPercentText(halfWidth, halfHeight - 5);
		this.addAssetText(halfWidth, halfHeight + 50);
	}

	styleProgressBox () {
	    this.progressBox.fillStyle(0x222222, 0.8);
	    this.progressBox.fillRect(240, 270, 320, 50);
	}

	addLoadingText (x, y) {
	    this.loadingText = this.makeText('Loading.....', x, y);
	    this.loadingText.setOrigin(0.5, 0.5);
	}

	addPercentText (x, y) {
	    this.percentText = this.makeText('0%', x, y);
	    this.percentText.setOrigin(0.5, 0.5);
	}

	addAssetText (x, y) {
		this.assetText = this.makeText('', x, y);
	    this.assetText.setOrigin(0.5, 0.5);
	}

	makeText (text, x, y) {
		return this.scene.make.text({
	      x: x,
	      y: y,
	      text: text,
	      style: {
	          font: '18px monospace',
	          fill: '#ffffff'
	      }
	    });
	};

	getProgress (value) {
		this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(250, 280, 300 * value, 30);
        this.percentText.setText(parseInt(value * 100) + '%');
	}

	getFileProgress (file) {
		this.assetText.setText('Loading asset: ' + file.src);
	}

}