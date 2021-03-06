class Camera
{
    constructor(scene) {
        this.scene = scene;
        //camera world coordinates
        this.x = 0;
        this.y = 1000;
        this.z = 0;

        //distance from the camera to the player (should be behind the player)
        this.distToPlayer = 800;

        //Z-distance between camera and normalizes projection plane
        this.distToPlane = 0;
    }

    /**
     * Initializes camera (must be called when initializing game or changing settings).
     */
    init(){
        this.distToPlane = 1 / (this.y / this.distToPlayer);
    }

    /**
     * Updates camera position to follow the player
     */
    update() {
        
        var player = this.scene.player;
        var circuit = this.scene.circuit;

        //player x is normalized within [-1, 1]
        this.x = player.x * circuit.roadWidth;
        
        //place the camera behind the player at the desired distance
        this.z = player.z - this.distToPlayer;
    }
}