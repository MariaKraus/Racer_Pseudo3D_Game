
class Player
{
    constructor(scene) {
        this.scene = scene;

        //player world coordinates
        this.x = 0;
        this.y = 0;
        this.z = 0;

        //max_speed => player can't be faster than rendering
        this.maxSpeed = (scene.circuit.segmentLength) / (1/60);

        this.speed = 0;

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
    update(dt) {
        //Only moves in Z direction right now
        this.z += this.speed * dt;
    }

}
