
class Player
{
    constructor(scene) {
        this.scene = scene;

        this.sprite = this.scene.sprites[0];
        //player world coordinates
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = this.sprite.width;

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
        this.screen.w = this.sprite.width;
        this.screen.h = this.sprite.height;
        this.screen.x = SCREEN_CX;
        this.screen.y = SCREEN_H - this.screen.h;     
        if (this.scene.IS_TOUCH) {
            gyro.frequency = 10;
        }
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

        this.speedPercent  = this.speed/this.maxSpeed;
        this.dv = dt * 2 * this.speedPercent; 

        //Only moves in Z direction right now
        this.z += this.speed * dt;
        if (!this.scene.IS_TOUCH) {
        if (keys.left.isDown) {
            this.x -= this.dv *1.8;
        }
        if (keys.right.isDown) {
            this.x += this.dv *1.8;
        }
    }else {
		// start gyroscope detection
        gyro.startTracking(function(o) {
               // updating player velocity
            this.x += o.gamma/20;
        });	
    }
    }
}
