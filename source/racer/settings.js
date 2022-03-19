class Settings
{
    constructor (scene) {
        this.scene = scene;
		
		var font = {font: '32px Arial', fill: '#ff1100'};
		this.timetxt = scene.add.text(0 , 0 , 'Time', font);
		this.show();
	}
	
	/**
	* Shows all settings.
	*/	
	show(){
	}
}