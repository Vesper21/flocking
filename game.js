var game;

// number of boids
var boidsNum = 50
// array containing all boids
var boids = [];
// boids speed
var speed = 50;
var scale = 1;
var radius = 100;

window.onload = function() {
	game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "");
	game.state.add("Flocking", flocking);
	game.state.start("Flocking");
}

var flocking = function(game){};
flocking.prototype = {

	preload: function(){
		game.load.image("boid", "boid.png");
	},

	create: function(){
		if (window.innerWidth < 767) {
			boidsNum = 12;
		}
		for(var i = 0; i < boidsNum; i++){
			// TODO place the boids at random points outside of screen
			var randomPoint = new Phaser.Point(game.rnd.between(0, game.width - 1), game.rnd.between(0, game.height - 1));
			boids[i] = game.add.sprite(randomPoint.x, randomPoint.y, "boid")
			boids[i].anchor.set(0.5);
			boids[i].speed = game.rnd.between(50, 150);
			game.physics.enable(boids[i], Phaser.Physics.ARCADE);
			boids[i].body.allowRotation = false;
			boids[i].scale.setTo(scale, scale);
			game.stage.scaleMode = 2
		}
	},

	update: function() {
		for (var i = 0; i < boidsNum; i++) {
			var p1 = this.attraction(i);
			var p2 = this.repulsion(i);
			var p3 = this.cohesion(i);
			var p4 = this.moveToTarget(i);

			//apply velocities
				boids[i].body.velocity.add(p1.x, p1.y);
				boids[i].body.velocity.add(p2.x, p2.y);
				boids[i].body.velocity.add(p3.x, p3.y);
				if (game.input.activePointer.isDown) {
					boids[i].body.velocity.add(p4.x, p4.y);
				}
				boids[i].body.velocity.normalize();
				boids[i].body.velocity.multiply(boids[i].speed, boids[i].speed);

				//turn in the right direction
				boids[i].angle = 180 + Phaser.Math.radToDeg(Phaser.Point.angle(boids[i].position, new Phaser.Point(boids[i].x + boids[i].body.velocity.x, boids[i].y + boids[i].body.velocity.y)));

				//keep boid inside screen
				this.bound(i);
			}
		},

		bound: function(i) {
			var limit = 10;
			if (boids[i].x < limit) {
				boids[i].body.velocity.x = Math.abs(boids[i].body.velocity.x)
			}
			else if (boids[i].x > game.width - limit) {
				boids[i].body.velocity.x = -1 * Math.abs(boids[i].body.velocity.x)
			}
			if (boids[i].y < limit) {
				boids[i].body.velocity.y = Math.abs(boids[i].body.velocity.y);
			}
			else if (boids[i].y > game.height - limit) {
				boids[i].body.velocity.y = -1 *Math.abs(boids[i].body.velocity.y);
			}
		},

		moveToTarget: function(i) {
			target = new Phaser.Point(game.input.x, game.input.y);
			target.subtract(boids[i].x, boids[i].y).divide(80, 80);
			return target;
		},

		attraction: function(boidId) {
			var tmpArray = [];
			for (var j = 0; j < boidsNum; j++) {
				if (j !== boidId && boids[boidId].position.distance(boids[j].position) < radius) {
					tmpArray.push(boids[j].position);
				}
			}
			if (tmpArray.length > 0) {
				var averagePosition = Phaser.Point.centroid(tmpArray);
				return Phaser.Point.subtract(averagePosition, boids[boidId].position).divide(100, 100);
			}
			else {
				var randomPosition = new Phaser.Point(game.rnd.between(0, game.width - 1), game.rnd.between(0, game.height - 1));
				return Phaser.Point.subtract(randomPosition, boids[boidId].position).divide(100, 100);
			}
		},

		// keep boid away from closed boids
		repulsion: function(boidId) {
			var repulsion = new Phaser.Point(0, 0);
			for (var j=0; j < boidsNum; j++) {
				if (j !== boidId && boids[boidId].position.distance(boids[j].position) < 15) {
					var sub = Phaser.Point.subtract(boids[j].position, boids[boidId].position);
				 	repulsion.subtract(sub.x, sub.y);
				}
			}
			return repulsion;
		},

		// align to neighbours velocity
		cohesion: function(boidId) {
			var tmpArray = [];
			for (var j = 0; j < boidsNum; j++) {
				if (j !== boidId && boids[boidId].position.distance(boids[j].position) < radius) {
					tmpArray.push(boids[j].body.velocity);
				}
			}
			if (tmpArray.length > 0) {
				var averageVelocity = Phaser.Point.centroid(tmpArray);
				return Phaser.Point.subtract(averageVelocity, boids[boidId].body.velocity).divide(180, 180);
			}
			else {
				return new Phaser.Point(0, 0);
			}
		}
}
