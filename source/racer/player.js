
var gyro_x = 0;

var gyro_run = false;

class Player
{
    constructor(scene) {
        this.scene = scene;
        this.sprite = this.scene.playerSprite;
        //player world coordinates
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.screen = {x:0, y:0, w:0, h:0};

        //max_speed => player can't be faster than rendering
        this.maxSpeed = (scene.circuit.segmentLength) / (1/60);
        this.speed = 0;
        this.speedPercent = 0;
        this.dv = 0;

    }

    /**
     * 
     */
    init() {
        //this.screen.w = this.sprite.width;
        this.screen.h = this.sprite.height;
        this.screen.x = SCREEN_CX;
        console.log(SCREEN_H);
        this.screen.y = SCREEN_H;
    }

    //starts the gyro sensor
    startGyro() {
        gyro.frequency = 10;
        // start gyroscope detection
        gyro.startTracking(function(o) {
            // updating player velocity
            gyro_x += o.beta/200;
        });	
    }

    /**
     * Restarts player
     */
    restart() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.speed = this.maxSpeed;
    }

    /**
     * Updates player position
     */
    update(dt, keys) {
        if ((!gyro_run) && (IS_TOUCH)) {
            this.startGyro();
            gyro_run = true;
        }

        this.speedPercent  = this.speed/this.maxSpeed;
        this.dv = dt * 2 * this.speedPercent; 

        //Only moves in Z direction right now
        this.z += this.speed * dt;
        if (IS_TOUCH) {
            this.x += gyro_x * this.dv * 0.4;        	
        } else {
            if (keys.left.isDown) {
                this.x -= this.dv *1.8;
            }
            if (keys.right.isDown) {
                this.x += this.dv *1.8;
            }
        }   
    }


    faster() {
        if (this.speed <= this.maxSpeed) {
            this.speed += this.maxSpeed * 0.05;
        }
    }
}
