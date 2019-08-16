export default class Player {

	constructor (scene) {
		this.scene = scene;

		this.init();
	}

	init () {
		this.player = this.scene.physics.add.sprite(100, 450, 'girlRun1')
			.setScale(0.17)
			.setBounce(0.2)
			.setCollideWorldBounds(true);
	}

}