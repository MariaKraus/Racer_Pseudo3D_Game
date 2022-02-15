//for tests:
//localhost:80/virus_racer/source/

//----------------------------------------------------------------------
// Global Constants 
//----------------------------------------------------------------------
//game states
const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;
//----------------------------------------------------------------------
//Global Variables
//---------------------------------------------------------------------
// screen size
var SCREEN_W = (screen.availWidth > screen.availHeight)?screen.availWidth: screen.availHeight;
var SCREEN_H = (screen.availWidth > screen.availHeight)?screen.availHeight: screen.availWidth;

var SPRITES = {
    yellow_house:   {x: 5, y: 5, w:450, h:500}
}

// coordinates of the screen center
var SCREEN_CX = SCREEN_W/2;
var SCREEN_CY = SCREEN_H/2;

// current state
var state = STATE_INIT;

var IS_TOUCH = false;

var keys;


class MainScene extends Phaser.Scene
{
    constructor() {
        super({key: 'SceneMain'});
        //canvas = document.getElementById('canvas');       // our canvas...      
     
    }

    /**
     * Loads all assets.
     */
    preload() {

        this.load.image('imgBack', 'source/assets/img_back.png');
        
        //this.load.setPath('assets/sprites');
        /*this.load.spritesheet([
            { key: 'explosion', frameConfig: { frameWidth: 3500, frameHeight: 3508, endFrame: 23 } },
        ]);

                this.images = [];
        this.images[0] = new Image();
        this.images[0].onload = function(){
            console.log('loaded')
            this.ctx.drawImage(background, 100 ,100);
        }
        this.images[0].onerror=function(){alert(img1.src+' failed to load.');};
        this.images[0].scr = '../assets/img_back.png';
        */
        this.load.image('virus', 'source/assets/virus0.png');


        this.load.image('housesLeft', 'source/assets/house1_L1.png');
        //this.load.spritesheet('housesLeft', '../assets/houses_left.png', {frameWidth: 3500, frameHeight: 3500});
    }
    /*onResize() {
        this.scale.displaySize.setAspectRatio( SCREEN_W/SCREEN_H );
        this.scale.refresh();
        this.create();
    }*/
    /**
     * Creates all objects
     */
    create() {
    
        //this.scale.lockOrientation('landscape');

        		// backgrounds
		// backgrounds
		this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');
       //ctx.drawImage('imgBack', SCREEN_CX, SCREEN_CY);

        // array of sprites that will be "manually" drawn on a rendering texture 
		// => they must be invisible after creation
		/*
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d'); // ...and its drawing context
        this.ctx.canvas.width  = SCREEN_W;
        this.ctx.canvas.height = SCREEN_H;  
        */

        this.sprites = [
            this.add.image(0, 0, 'virus').setVisible(false)
        ];

        //settings instance
        this.circuit = new Circuit(this);
        this.settings = new Settings(this);
        this.camera = new Camera(this);
        this.player = new Player(this);
            // Check touch input
	window.addEventListener('touchstart', function()
	{			
		IS_TOUCH	= true;
	});

    
/*
        window.addEventListener('resize', function (event) {
            SCREEN_W = screen.availWidth;
            SCREEN_H = screen.availHeight;
            SCREEN_CX = SCREEN_W/2;
            SCREEN_CY = SCREEN_H/2;
           // this.scene.restart('SceneMain');
            }, this);*/
    

        

        //listener to pause the game
        this.input.keyboard.on('keydown-SPACE', function() {
            this.settings.txtPause.text = "SPACE Resume"
            this.scene.pause();
            this.scene.launch('ScenePause');
        }, this);

        keys = this.input.keyboard.addKeys({
            left: 'left',
            right: 'right'
        });

        this.events.on('resume', function() {
            this.settings.show();
        }, this);
    }

    /**
     * Main Game Loop
     */
    update(time, delta) {
        switch(state) {
            case STATE_INIT:
                console.log("Init game.");
                state = STATE_RESTART;
                this.camera.init();
                this.player.init();
                break;
            case STATE_RESTART:
                console.log("Restart game.");
                state = STATE_PLAY;
                this.circuit.create();
                this.player.restart();
                break;
            case STATE_PLAY:
                //duration of the time period (min 1 s)
                var dt = Math.min(1, delta/1000);
                this.player.update(dt, keys);
                this.circuit.render3D();
                this.camera.update();

                break;
            case STATE_GAMEOVER:
                console.log("Play game.");
                break;
        }
    }

}

class PauseScene extends Phaser.Scene
{
    constructor() {
        super({key: 'ScenePause'});  
    }

    create(){ 
        this.input.keyboard.on('keydown-SPACE', function() {
            this.scene.resume('SceneMain');
            this.scene.stop();
        }, this);
    }
}

//game configuration
var config = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,
    /*physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },*/

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [MainScene, PauseScene]
};


// game instance
var game = new Phaser.Game(config);