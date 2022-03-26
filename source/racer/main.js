//----------------------------------------------------------------------
// Global Constants 
//----------------------------------------------------------------------
//game states
const STATE_INIT = 1;
const STATE_RESTART = 2;
const STATE_PLAY = 3;
const STATE_GAMEOVER = 4;

const MAIN_SCENE = 1;
const PAUSE_SCENE = 2;
const GOAL_SCENE = 3;
//----------------------------------------------------------------------
//Global Variables
//---------------------------------------------------------------------

// current state
var state = STATE_INIT;
// screen size
var SCREEN_W = (screen.availWidth > screen.availHeight)?screen.availWidth: screen.availHeight;
var SCREEN_H = (screen.availWidth > screen.availHeight)?screen.availHeight: screen.availWidth;

// coordinates of the screen center
var SCREEN_CX = SCREEN_W/2;
var SCREEN_CY = SCREEN_H/2;

//sensory input
var IS_TOUCH = false;
//kees for steering
var keys;

var timer;
var mainScene; // = 1
var pauseScene; // = 2
var goalScene; // = 3
var currentScene = 2; //Start screen
var score = 0;

class MainScene extends Phaser.Scene
{
    constructor() {
        super({key: 'SceneMain'});   
    }

    /**
     * Loads all assets.
     */
    preload() {
        mainScene = this.scene;

        this.load.image('imgBack', 'source/assets/img_back.png');
        this.load.image('car', 'source/assets/car.png');
    }

    /**
     * Creates all objects
     */
    create() {
        //adds timer to scene
        timer = this.time.addEvent({
            delay: 999999,
            paused: true
          });
        //all the sprites
		this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');
        this.playerSprite = this.add.sprite(0, 0, 'car').setVisible(false);
        this.playerSprite.displayWidth = SCREEN_W * 0.3;
        this.playerSprite.scaleY= this.playerSprite.scaleX;
        this.playerSprite.setOrigin(0.5,1);

        //settings instance
        this.circuit = new Circuit(this);
        this.settings = new Settings(this);
        this.camera = new Camera(this);
        this.player = new Player(this);
        
        // Check touch input
	    window.addEventListener('touchstart', function()
	    {	
            //if mainscene is the currentScene
            if (currentScene == MAIN_SCENE) {
		        IS_TOUCH	= true;
                mainScene.pause();
                timer.paused = true;
                currentScene = PAUSE_SCENE;
                mainScene.launch('ScenePause');
            } else {
                //in landscape
                if(screen.availHeight < screen.availWidth) {
                    if (currentScene == PAUSE_SCENE) {
                        pauseScene.scene.titleSprite.setVisible(false);
                        pauseScene.resume('SceneMain');
                        pauseScene.stop();
                    } 
              }	
            }
	    });

        //pause game if the screen orientation changes
        window.addEventListener('resize', function (event) {
            if(event.target.screen.availHeight > event.target.screen.availWidth) {
                isInPortrait = true;
                mainScene.pause();
                timer.paused = true;
                mainScene.launch('ScenePause');
            } else {
                pauseScene.scene.titleSprite.angle = 0;
            }
        }, this);        

        //listener to pause the game
        this.input.keyboard.on('keydown-SPACE', function() {
            this.scene.pause();
            timer.paused = true;
            currentScene = pauseScene;
            this.scene.launch('ScenePause');
        }, this);

        //steering on computer
        keys = this.input.keyboard.addKeys({
            left: 'left',
            right: 'right'
        }); 

        
        this.events.on('resume', function() {
            currentScene = MAIN_SCENE;
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
                this.scene.pause();
                this.scene.launch('ScenePause');
                break;
            case STATE_RESTART:
                currentScene = MAIN_SCENE;
                state = STATE_PLAY;
                this.circuit.create();
                this.player.restart();
                break;
            case STATE_PLAY:
                currentScene = MAIN_SCENE;
                timer.paused = false;
                //duration of the time period (min 1 s)
                var dt = Math.min(1, delta/1000);
                this.player.update(dt, keys);
                this.settings.show(timer.getElapsedSeconds().toFixed(1));
                if (this.circuit.render3D() == false) {
                    state = STATE_GAMEOVER;
                }
                this.camera.update();

                break;
            case STATE_GAMEOVER:
                score = timer.getElapsedSeconds().toFixed(1);
                console.log(score)
                this.scene.pause();
                this.scene.launch('GoalScene');
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
        //title
        this.titleSprite = this.add.sprite(SCREEN_CX, SCREEN_CY, 'title').setVisible(true)
        this.titleSprite.displayWidth = SCREEN_H;

        // turn sprites, so that the landscape mode is always displayed.
        if(screen.availHeight < screen.availWidth) {
            //in landscape
            this.titleSprite.angle = 0;
        } else {
            //in portrait mode
            this.titleSprite.angle = 90;
        }
        //listener to pause the game
        this.input.keyboard.on('keydown-SPACE', function() {
            currentScene = MAIN_SCENE;
            this.scene.resume('SceneMain');
            this.scene.stop();
        }, this);
    }
}

class GoalScene extends Phaser.Scene
{
    constructor() {
        super({key: 'GoalScene'});  
    }

    preload(){
        pauseScene = this.scene;
        this.load.image('imgBack', 'source/assets/img_back.png');
        this.load.image('star', 'source/assets/star.png');
        this.load.image('title', 'source/assets/title.png');
    }

    create(){ 
        this.sprBack = this.add.image(SCREEN_CX, SCREEN_CY, 'imgBack');
        //Start button
        //this.startSprite = this.add.sprite(SCREEN_CX, SCREEN_CY, 'start').setVisible(true);

        //title
        this.titleSprite = this.add.sprite(SCREEN_CX, SCREEN_CY, 'title').setVisible(true);
        this.titleSprite.displayWidth = SCREEN_H;

        this.starSprite = this.add.sprite(SCREEN_CX, SCREEN_CY + SCREEN_CY/2, 'star').setVisible(true);
        this.starSprite.displayWidth = 100;
        this.starSprite.scaleY= this.starSprite.scaleX;


        this.settings = new Settings(this);
        this.settings.show(score, 'Your time: ');
    }
}

//game configuration
var config = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,

    scale: {
        mode: Phaser.Scale.NO_SCALE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        forceOrientation: (true,false),
        setScreenSize: true,
        pageAlignHorizontally: true,
        pageAlignHorizontally:true
    },

    scene: [MainScene, PauseScene, GoalScene]
};

// game instance
var game = new Phaser.Game(config);
