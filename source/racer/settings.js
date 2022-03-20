class Settings
{
    constructor (scene) {
        this.scene = scene;
		
		var font = {font: '32px Arial', fill: '#ff1100', stroke: '#000', strokeThickness: 4};
		this.timetxt = scene.add.text(0 , 0 , '', font);
		this.show();
	}
	
	/**
	* Shows all settings.
	*/	
	show(time){
		var gameRuntime = time;
		this.timetxt.setText(Math.round(gameRuntime));
	}
}