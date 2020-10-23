// number of boids
var boidsNum = 50
// array containing all boids
var boids = [];

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('boid', 'boid.png');
};

function create() {
  for(var i = 0; i < boidsNum; i++){
    var randomX = Phaser.Math.Between(0, window.innerWidth - 1);
    var randomY = Phaser.Math.Between(0, window.innerHeight - 1);
    boids[i] = this.physics.add.sprite(randomX, randomY, 'boid');
    boids[i].setVelocity(1, 1);
    boids[i].speed = Phaser.Math.Between(1, 2);
  }
};

function update() {
  for (var boid of boids) {
    bound(boid);

    // apply movement
    boid.x += boid.body.velocity.x * boid.speed;
    boid.y += boid.body.velocity.y * boid.speed;

    //turn in the right direction
    boid.setAngle(computeAngle(boid.body.velocity));
  }
};

function bound(boid) {
  var limit = 10;
  if (boid.x < limit) {
    boid.body.velocity.x = Math.abs(boid.body.velocity.x);
  }
  else if (boid.x > window.innerWidth - limit) {
    boid.body.velocity.x = -1 * Math.abs(boid.body.velocity.x);
  }
  if (boid.y < limit) {
    boid.body.velocity.y = Math.abs(boid.body.velocity.y);
  }
  else if (boid.y > window.innerHeight- limit) {
    boid.body.velocity.y = -1 *Math.abs(boid.body.velocity.y);
  }
};

function computeAngle(velocity) {
  var zeroPoint = new Phaser.Geom.Point(0, 0);
  var angleRad = Phaser.Math.Angle.BetweenPoints(zeroPoint, velocity);
  return Phaser.Math.RadToDeg(angleRad);
};

