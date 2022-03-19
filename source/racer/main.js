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

//kees for steering
var keys;

var isInPortrait;
var mainScene;
var pauseScene;

var running = true;


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
        mainScene = this.scene;

        this.load.image('imgBack', 'source/assets/img_back.png');
        this.load.image('pause', 'source/assets/pause.png');
        
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
        this.load.image('car', 'source/assets/car.png');


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

        this.playerSprite = this.add.sprite(0, 0, 'car').setVisible(false);
        this.playerSprite.displayWidth = SCREEN_W * (1/8);
        //scale evenly
        this.playerSprite.scaleY = this.playerSprite.scaleX;
        this.sprites = [
            this.add.sprite(0, 0, 'car').setVisible(false),
        ];

        //settings instance
        this.circuit = new Circuit(this);
        this.settings = new Settings(this);
        this.camera = new Camera(this);
        this.player = new Player(this);
            // Check touch input
	    window.addEventListener('touchstart', function()
	    {	
            if (running) {
		        IS_TOUCH	= true;
                running = false;
                mainScene.pause();
                mainScene.launch('ScenePause');

            } else {
                if(screen.availHeight < screen.availWidth) {
                    //in landscape
                    pauseScene.scene.startSprite.setVisible(false);
                    pauseScene.scene.titleSprite.setVisible(false);
                    pauseScene.resume('SceneMain');
                    pauseScene.stop();
                    running = true;
              } else {
                    pauseScene.scene.turnMobileSprite.setVisible(true);
              }	
            }
	    });

        //pause game if the screen orientation changes
        window.addEventListener('resize', function (event) {
            if(event.target.screen.availHeight > event.target.screen.availWidth) {
                isInPortrait = true;
                mainScene.pause();
                mainScene.launch('ScenePause');
            }
        }, this);        

        //listener to pause the game
        this.input.keyboard.on('keydown-SPACE', function() {
            this.scene.pause();
            this.scene.launch('ScenePause');
        }, this);

        //steering on computer
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
                if (screen.availHeight> screen.availWidth) {
                    this.scene.pause();
                    this.scene.launch('ScenePause');
                }
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

    preload(){
        pauseScene = this.scene;
        this.load.image('imgBack', 'source/assets/img_back.png');
        this.load.image('start', 'source/assets/right.png');
        this.load.image('star', 'source/assets/star.png');
        this.load.image('title', 'source/assets/title.png');
        this.load.image('turn_mobile', 'source/assets/turn_mobile.png');
    }

    create(){ 
        this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');
        //Start button
        this.startSprite = this.add.sprite(SCREEN_CX, SCREEN_CY, 'start').setVisible(true);
        this.startSprite.setInteractive();
        //this.startSprite.on('pointerdown', () => this.start(), this);


        //title
        this.titleSprite = this.add.sprite(SCREEN_CX + SCREEN_CX*(3/4) , SCREEN_CY - SCREEN_CY*(3/4), 'title').setVisible(true)
        this.titleSprite.displayWidth = SCREEN_H;
        
        //information turn mobile
        this.turnMobileSprite = this.add.sprite(SCREEN_H, SCREEN_W, 'turn_mobile').setVisible(false);

        if(screen.availHeight < screen.availWidth) {
            //in landscape
            this.startSprite.angle = 0;
            this.titleSprite.angle = 0;
        } else {
            //in portrait mode
            this.startSprite.angle = 90;
            this.titleSprite.angle = 90;
            this.turnMobileSprite.setVisible(true);
        }
            //listener to pause the game
        this.input.keyboard.on('keydown-SPACE', function() {
            this.scene.resume('SceneMain');
            this.scene.stop();
        }, this);

        /*
	    window.addEventListener('touchstart', function()
	    {			
            if(screen.availHeight < screen.availWidth) {
                //in landscape
                  pauseScene.scene.startSprite.setVisible(false);
                  pauseScene.scene.titleSprite.setVisible(false);
                  pauseScene.resume('SceneMain');
                  pauseScene.stop();
              } else {
                 turnMobileSprite.setVisible(true);
              }
	    }, this);*/
        /*
        //change the pause scene on orientation change
        window.addEventListener('resize', function () {
            if(screen.availHeight < screen.availWidth) {
                //in landscape
                startSprite.angle = 90;
                titleSprite.angle = 90;
            } else {
                //in portrait mode
                startSprite.angle = 0;
                titleSprite.angle = 0;
                turnMobileSprite.setVisible(false);
            }
        }, this);
        */
    }
    startMain() {
        if(screen.availHeight < screen.availWidth) {
          //in landscape
            this.startSprite.setVisible(false);
            this.titleSprite.setVisible(false);
            this.scene.resume('SceneMain');
            this.scene.stop();
        } else {
           turnMobileSprite.setVisible(true);
        }
    }
}

//game configuration
var config = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,
    //fullscreenTarget: document.getElementById("wrapper"),
    /*physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },*/

    scale: {
        mode: Phaser.Scale.NO_SCALE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        forceOrientation: (true,false),
        //enterIncorrectOrientation: handleIncorrect,
        //leaveIncorrectOrientation: handleCorrect,
        setScreenSize: true,
        pageAlignHorizontally: true,
        pageAlignHorizontally:true
    },

    scene: [MainScene, PauseScene]
};


// game instance
var game = new Phaser.Game(config);

/*
function displayOnPortrait(event){
    if(event.srcElement.innerHeight > event.srcElement.innerWidth) {
        isInPortrait = true;
    } else{
        isInPortrait = false;
    }
}


function handleIncorrect(){
    if(!game.device.desktop){
        document.getElementById("turn").style.display="block";
    }
}

function handleCorrect(){
   if(!game.device.desktop){
       if(isInPortrait){
           gameRatio = window.innerWidth/window.innerHeight;		
           //game.renderer.resize(window.innerWidth, window.innerHeight);	
       }
       document.getElementById("turn").style.display="none";
   }
}*/