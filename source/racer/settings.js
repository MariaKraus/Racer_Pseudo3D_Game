class Settings
{
    constructor (scene) {
        this.scene = scene;
		
		var font = {font: '32px Arial', fill: '#000000'};
		this.txtPause= scene.add.text(423,423 , '', font);
		this.show();
	}
	
	/**
	* Shows all settings.
	*/	
	show(){
		this.txtPause.text = "SPACE Pause";
	}
}