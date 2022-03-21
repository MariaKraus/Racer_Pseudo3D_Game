class Settings
{
    constructor (scene) {
        this.scene = scene;
		
		var font = {font: '48px Arial', fill: '#ff1100', stroke: '#000', strokeThickness: 10};
		this.timetxt = scene.add.text(0 , 0 , '', font);
		this.show();
	}
	
	/**
	* Shows all settings.
	*/	
	show(time, txt=''){
		var gameRuntime = time;
		this.timetxt.setText(txt + Math.round(gameRuntime));
	}
}