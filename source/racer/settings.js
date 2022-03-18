class Settings
{
    constructor (scene) {
        this.scene = scene;
		
		var font = {font: '32px Arial', fill: '#000000'};
		this.imgPause= scene.add.image(10,10, 'pause');
		this.timetxt = scene.add.text(423,423 , 'Time', font);
		this.show();
	}
	
	/**
	* Shows all settings.
	*/	
	show(){
	}
}