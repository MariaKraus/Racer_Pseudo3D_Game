
var ROAD = {
    LENGTH: { NONE: 0, SHORT:  25, MEDIUM:  50, LONG:  75 },
    CURVE:  { NONE: 0, EASY:    2, MEDIUM:   4, HARD:    6 },
    HILL:   { NONE: 0, SMALL:  20, MEDIUM: 40, HIGH: 60 },
};
var ROADSEGMENTS = [
    [ROAD.LENGTH.LONG, ROAD.LENGTH.LONG, ROAD.LENGTH.NONE, ROAD.CURVE.NONE, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.HIGH],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.SMALL],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.MEDIUM, -ROAD.HILL.SMALL],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.NONE, ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.HILL.HIGH],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, -ROAD.HILL.HIGH],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.NONE],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.SMALL],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, -ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.NONE],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, -ROAD.CURVE.EASY, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.SMALL],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.EASY, ROAD.HILL.NONE],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.NONE, ROAD.HILL.HIGH],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, -ROAD.HILL.SMALL],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.HIGH],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.SMALL],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, -ROAD.CURVE.EASY, ROAD.HILL.NONE],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.NONE],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, -ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.SMALL],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, -ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM],
    [ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.NONE, ROAD.HILL.NONE],
    [ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.NONE],
]


class Circuit
{
    constructor(scene) {

        this.scene = scene;
        //this.ctx = scene.ctx;
        //this.landscape_sprites = scene.sprites;
        //this.images = scene.images;
        this.goalSprite = scene.goalSprite;
        

        //graphics to draw the road polygons on it
        this.graphics = scene.add.graphics(0,0);

        // texture to draw the sprites on it
		this.texture = scene.add.renderTexture(0, 0, SCREEN_W, SCREEN_H);

        this.segments = [];
        this.segmentLength = 200;
        this.roadWidth = (SCREEN_W > SCREEN_H)? (0.7 * SCREEN_W) : (0.7 * SCREEN_H );

        SPRITES.SCALE = 0.3 * (1/this.roadWidth);

        //Roadlength is hardcoded, depends on number of roadsegments
        this.roadLength = 0;
        this.total_segments = 5250;
        this.visible_segments = 300;

        //number of strips that form a pavement
        this.pavement_segments = 5;

        ////////////////////////////////////////////////////////////////
        this.counter = 0;

    }
    onResize() {
        var player = this.scene.player;
        var player_segment = this.getSegment(player.z);
        var section = MATH.floor(player_segment.index / 150);
        this.createRoad(section);
    }

    /**
     * Creates the entire environment with road and roadside objects
     */
    create() {
        this.segments = [];
        this.createRoad(0);

        this.total_segments = this.segments.length;
        this.roadLength = this.total_segments * this.segmentLength;
    }

    /**
     * Creates a road
     */
    createRoad(start) {
        //Every section has the size 150
        //Road has 35 different sections
        for(var i = start; i < ROADSEGMENTS.length; i++) {
            this.createSection(ROADSEGMENTS[i][0], ROADSEGMENTS[i][1], ROADSEGMENTS[i][2], ROADSEGMENTS[i][3], ROADSEGMENTS[i][4]);
        }


       /*
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.LONG, ROAD.LENGTH.NONE, ROAD.CURVE.NONE, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.HIGH);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.MEDIUM, -ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.NONE, ROAD.LENGTH.LONG, ROAD.CURVE.NONE, ROAD.HILL.HIGH);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, -ROAD.HILL.HIGH);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, -ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, -ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, -ROAD.CURVE.EASY, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.EASY, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.NONE, ROAD.HILL.HIGH);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, -ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.HIGH);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, -ROAD.CURVE.EASY, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.LONG, ROAD.CURVE.MEDIUM, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, -ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, ROAD.HILL.NONE);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.SHORT, ROAD.LENGTH.MEDIUM, ROAD.CURVE.NONE, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.CURVE.EASY, -ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.SHORT, ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.EASY, ROAD.HILL.MEDIUM);
        this.createSection(ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.MEDIUM, -ROAD.CURVE.MEDIUM, ROAD.HILL.SMALL);
        this.createSection(ROAD.LENGTH.LONG, ROAD.LENGTH.MEDIUM, ROAD.LENGTH.SHORT, ROAD.CURVE.NONE, ROAD.HILL.NONE);
        */
    }

    /**
     * Creates a road section, Parameters:
     * nSegments = number of segments that make up this section
     */
    createSection(in_s, stay_s, out_s, curve, height) {
        var y_old = (this.segments.length == 0) ? 0 : this.segments[this.segments.length - 1].point.world.y;
        var y_new = y_old +  this.segmentLength * height;
        var total = in_s + stay_s + out_s;


        for (var i = 0; i < in_s; i++) {
            this.createSegment(this.calc_in(0, curve, i/in_s), this.calc_in_out(y_old, y_new, i/total));

        }
        for (var i = 0; i < stay_s; i++) {
            this.createSegment(curve, this.calc_in_out(y_old, y_new, (i + in_s)/total));
        }
        for (var i = 0; i < out_s; i++) {
            this.createSegment(this.calc_out(curve, 0, i/out_s), this.calc_in_out(y_old, y_new, (i + stay_s + in_s)/total));
        }
    }

    /**
     * Creates a new Segment
     */
    createSegment(curve , height) {
     //define colors
        const COLORS = {
            LIGHT: {road: '0x888888', curb: '0x595959', pavement: '0x808080', grass: '0x429352',},
            DARK: {road: '0x666666', curb: '0x595959', pavement: '0x888888', grass: '0x397d46'}};

        //current number of segments
        var n = this.segments.length;
        this.counter++;

        this.segments.push({
            index: n,
            point: {
                world: {x:0, y:height, z: n*this.segmentLength},
                screen: {x:0, y:0, w:0},
                scale: -1
            },
            color : Math.floor(n/this.pavement_segments)%2? COLORS.DARK : COLORS.LIGHT,
            curve: curve,
            sprites : []
        });

        console.log(n);
        console.log(this.total_segments - 1* this.visible_segments);
        if (n == this.total_segments - this.visible_segments) {
            //console.log(this.counter);
            this.addSegmentSprite(n, 'goal', -1);
            console.log(n);
        }
    } 

    addSegmentSprite(index, spriteKey, offset) {
        
        let sprite = this.scene.add.image(0, 0, spriteKey);

        this.segments[index].sprites.push({
          key: spriteKey,
          offset: offset,
          spriteRef: sprite,

        });
        sprite.setVisible(false);
        
    }

    /**
     * Projects a point from its world coordinates to screen coordinates (2D view).
     */
    project2D(point) {
        point.screen.x = SCREEN_CX;
        point.screen.y = SCREEN_H - point.world.z;
        point.screen.w = this.roadWidth;
        //point.screen.h = 
    }

    /**
	* Projects a point from its world coordinates to screen coordinates (pseudo 3D view).
	*/	
	project3D(point, cameraX, cameraY, cameraZ, cameraDepth){
		// translating world coordinates to camera coordinates
		var transX = point.world.x - cameraX;
		var transY = point.world.y - cameraY;
		var transZ = point.world.z - cameraZ;
		
		// scaling factor based on the law of similar triangles
		point.screen.scale = cameraDepth/transZ;
		
		// projecting camera coordinates onto a normalized projection plane
		var projectedX = point.screen.scale * transX;
		var projectedY = point.screen.scale * transY;
		var projectedW = point.screen.scale * this.roadWidth;
        //var projectedH = point.screen.scale * this.houseHeight;

		// scaling projected coordinates to the screen coordinates
		point.screen.x = Math.round((1 + projectedX) * SCREEN_CX);
		point.screen.y = Math.round((1 - projectedY) * SCREEN_CY);
		point.screen.w = Math.round(projectedW * SCREEN_CX);
        //point.screen.h = Math.round(projectedH * SCREEN_CY);
	}

    calc_in(a , b, percent) {
        var res = a + (b-a)*Math.pow(percent,2); 
        /*
        console.log("a", a);
        console.log("b" , b);
        console.log("res", res);
        */
        return res;
    }

    calc_out(a, b, percent) {
         var res= a + (b-a)*(1-Math.pow(1-percent,2));
         //console.log(res);
         return res;
    }

    calc_in_out(a, b, percent) {
        var res = a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5);   
        return res;
    }

    /**
     * Renders the road in 2D
     *
    render2D() {
        
        //this.graphics.clear();

        //get the current and the previous segments
        var currSegment = this.segments[1];
        var prevSegment = this.segments[0];

        this.project2D(currSegment.point);
        this.project2D(prevSegment.point);

        var p1 = prevSegment.point.screen;
        var p2 = currSegment.point.screen; 

        this.drawSegment(
            p1.x, p1.y, p1.w,
            p2.x, p2.y, p2.w,
            currSegment.color
        );
    }

    	/**
	* Renders the road by drawing segment by segment (pseudo 3D view).
	*/	
	render3D(){

        //define the clipping bottom line to render only segments above it.
        var clipBottomLine = SCREEN_H;
		// get the camera
		var camera = this.scene.camera;	

        this.graphics.clear();
        this.texture.clear();

        var player = this.scene.player;
        var player_segment = this.getSegment(player.z);
        //centrifugal force
        player.x = player.x + (player.speedPercent * player_segment.curve * (-0.02));
        //if the player is out of road and pavement
        if ((player.speed != player.maxSpeed/3)
            && ((player_segment.point.screen.x + player.x > SCREEN_CX + this.roadWidth/2 + SCREEN_CX/10)
            || (player_segment.point.screen.x + player.x < SCREEN_CX - this.roadWidth/2 - SCREEN_CX/10))) {
                player.speed = player.maxSpeed/3;
        } else {
                player.faster();
        }
        console.log(camera.z/this.segmentLength);
        console.log(this.total_segments);
        //stop game if the player reaches the goal
        if (Math.abs(camera.z/this.segmentLength - (this.total_segments - this.visible_segments)) < 1) {
            console.log("over");
            return false;
        }

        this.texture.draw(player.sprite, player.screen.x, player.screen.y);
        //console.log(player_segment);

        //get the base segment
        var baseSegment = this.getSegment(camera.z);
        var baseIndex = baseSegment.index;

        //the basePercent depends on the distance of the camera and the size of a segment
        var basePercent = (camera.z % this.segmentLength) / this.segmentLength;

        //x is
        var x = 0;
        //dx is
        var dx = - (basePercent * baseSegment.curve);

               
        //loop over all available segments
        for (var n = 0; n < this.visible_segments; n++) {
            
            var currIndex = (baseIndex + n) % this.total_segments;
            var currSegment = this.segments[currIndex];

            // project the segment to the screen space
	        this.project3D(currSegment.point, camera.x - x, camera.y + player_segment.point.world.y, camera.z, camera.distToPlane);

            x = x + dx;
            dx = dx + currSegment.curve;

            var currBottomLine = currSegment.point.screen.y;
            
			//skip the first since 2 points are needed
            if (n > 0 && currBottomLine < clipBottomLine) {

                var prevIndex = (currIndex > 0) ? (currIndex - 1): (this.total_segments - 1)
                var prevSegment = this.segments[prevIndex];

                var p1 = prevSegment.point.screen;
                var p2 = currSegment.point.screen;

				this.drawSegment(
					p1.x, p1.y, p1.w,
					p2.x, p2.y, p2.w,
					currSegment.color
                    
				);
                clipBottomLine = currBottomLine; 
            
        
            if (currSegment.sprites.length != 0) {
                for (let i = 0; i < currSegment.sprites.length; i++) {
                    let curr_sprite = currSegment.sprites[i].spriteRef;
                    curr_sprite.setDepth(1);
                    console.log(p1);
                    let destW = 15*(curr_sprite.width * p1.scale * SCREEN_W/2) * (SPRITES.SCALE* this.roadWidth); //currSegment.sprites[i].spriteRef.offset;
                    let destH = 15*(705* p1.scale * SCREEN_W/2) * (SPRITES.SCALE* this.roadWidth);
                    let sprite_x = p1.x - p1.w; - destW;
                    let sprite_y = p1.y;

                //this.graphics.drawImage(currSegment.sprites[i].spriteRef, spriteX, spriteY);
                
                if (p2.y <= clipBottomLine 
                    && sprite_x > curr_sprite.width * p1.scale * SCREEN_W/2) // clip by (already rendered) segment
                {
                    curr_sprite.setPosition(sprite_x, sprite_y);
                    curr_sprite.setOrigin(1, 1);

                    curr_sprite.setDisplaySize(destW, destH);
                    //currSegment.sprites[i].spriteRef.setScale(SPRITES.SCALE);
                    curr_sprite.setVisible(true);
                } else {
                    curr_sprite.setVisible(false);
                }
            }
        }
        }
    }

	}

    /**
     * Returns a segment at 
     * 
     * @param {*} positionZ  Position on the screen
     */
    getSegment(positionZ) {

        //If the camera is behind the player
        if (positionZ < 0)  {
            positionZ += this.roadLength;
        }
        var index = Math.floor(positionZ / this.segmentLength) % this.total_segments;
        return this.segments[index];
    }


    /**
     * Draws a segment.
     * 
     * @param {*} x1
     * @param {*} y1 
     * @param {*} w1 
     * @param {*} x2 
     * @param {*} y2 
     * @param {*} w2 
     * @param {*} color 
     */
     drawSegment(x1, y1, w1, x2, y2, w2, color) {

        /*
        this.ctx.fillStyle = color.grass;
        this.ctx.fillRect(0, y2, this.ctx.canvas.width, y1 - y2);
        //this.ctx.fillRect()
        */

        
        // draw grass
		this.graphics.fillStyle(color.grass, 1);
		this.graphics.fillRect(0, y2, SCREEN_W, y1 - y2);
        
        // draw road
		this.drawPolygon(x1-w1, y1,	x1+w1, y1, x2+w2, y2, x2-w2, y2, color.road);

        var curb_w1 = w1 / 10;
        var curb_w2 = w2 / 10;
        this.drawPolygon(x1-w1-curb_w1, y1, x1-w1, y1, x2-w2, y2, x2-w2-curb_w2, y2, color.curb);
		this.drawPolygon(x1+w1+curb_w1, y1, x1+w1, y1, x2+w2, y2, x2+w2+curb_w2, y2, color.curb);

        var pavement_w1 = w1 / 3;
        var pavement_w2 = w2 / 3;
        this.drawPolygon(x1-w1-curb_w1-pavement_w1, y1, x1-w1-curb_w1, y1, x2-w2-curb_w2, y2, x2-w2-curb_w2-pavement_w2, y2, color.pavement);
		this.drawPolygon(x1+w1+curb_w1+pavement_w1, y1, x1+w1+curb_w1, y1, x2+w2+ curb_w2, y2, x2+w2+curb_w2+pavement_w2, y2, color.pavement);
        
        //this.drawSprite(this.landscape_sprites, x1-w1-curb_w1-pavement_w1, y1);
        


        /*
        var house_y1 = h1;
        var house_y2 = h2;
        this.drawPolygon(x1-w1-curb_w1-pavement_w1, y1, x1-w1-curb_w1-pavement_w1, y1-house_y1, x2-w2-curb_w2-pavement_w2, y2 - house_y2, x2-w2-curb_w2-pavement_w2, y2, color.house);
		this.drawPolygon(x1+w1+curb_w1+pavement_w1, y1, x1+w1+curb_w1+pavement_w1, y1-house_y1, x2+w2+curb_w2+pavement_w2, y2 - house_y2, x2+w2+curb_w2+pavement_w2, y2, color.house);

        var roof_y1 = h1/4;
        var roof_y2 = h2/4;
        this.drawPolygon(x1-w1-curb_w1-pavement_w1, y1-house_y1, x1-w1-curb_w1-(2*pavement_w1), y1-house_y1-roof_y1, x2-w2-curb_w2-(2*pavement_w2), y2-house_y2-roof_y2, x2-w2-curb_w2-pavement_w2, y2-house_y2, color.roof);
		this.drawPolygon(x1+w1+curb_w1+pavement_w1, y1-house_y1, x1+w1+curb_w1+(2*pavement_w1), y1-house_y1-roof_y1, x2+w2+curb_w2+(2*pavement_w2), y2-house_y2-roof_y2, x2+w2+curb_w2+pavement_w2, y2-house_y2, color.roof);
        */
    }



    /**
	* Draws a polygon defined with four points and color.
	*/	
	drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color){
		/**
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
		
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.lineTo(x3, y3);
		this.ctx.lineTo(x4, y4);
		
		this.ctx.closePath();
		this.ctx.fill();
        */

        
         this.graphics.fillStyle(color, 1);
		this.graphics.beginPath();
		
		this.graphics.moveTo(x1, y1);
		this.graphics.lineTo(x2, y2);
		this.graphics.lineTo(x3, y3);
		this.graphics.lineTo(x4, y4);
		
		this.graphics.closePath();
		this.graphics.fill();
    
	}
    
    /**
     * Draws a sprite
     *
    drawSprite(im, sprite_x, sprite_y, scale){

        if (this.depth%13 == 0) {
     
        var sprite = this.scene.add.sprite(sprite_x, sprite_y, 'housesLeft').setVisible(false);
        
        sprite.scale = 0.05;

        /*
        this.landscape_sprites.x = 200;
        this.landscape_sprites.y = sprite_y;
        this.landscape_sprites.scale = 0.05;
        this.landscape_sprites.depth = this.depth;
        
        


        sprite.setVisible(true);
        }
        this.depth++;
    }
*/
    
}
/*
var COLORS = {
    SKY:  '#72D7EE',
    TREE: '#005108',
    FOG:  '#005108',
    LIGHT:  { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC'  },
    DARK:   { road: '#696969', grass: '#009A00', rumble: '#BBBBBB'                   },
    START:  { road: 'white',   grass: 'white',   rumble: 'white'                     },
    FINISH: { road: 'black',   grass: 'black',   rumble: 'black'                     }
  };
  
  var BACKGROUND = {
    HILLS: { x:   5, y:   5, w: 1280, h: 480 },
    SKY:   { x:   5, y: 495, w: 1280, h: 480 },
    TREES: { x:   5, y: 985, w: 1280, h: 480 }
  };
  */