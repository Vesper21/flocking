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
  for (var i = 0; i < boidsNum; i++) {
    bound(i);

    // apply movement
    boids[i].x += boids[i].body.velocity.x * boids[i].speed;
    boids[i].y += boids[i].body.velocity.y * boids[i].speed;

    //turn in the right direction
    var angleRad = Phaser.Math.Angle.Between(0, 0, boids[i].body.velocity.x, boids[i].body.velocity.y);
    boids[i].setAngle(Phaser.Math.RadToDeg(angleRad));
  }
};

function bound(i) {
  var limit = 10;
  if (boids[i].x < limit) {
    boids[i].body.velocity.x = Math.abs(boids[i].body.velocity.x);
  }
  else if (boids[i].x > window.innerWidth - limit) {
    boids[i].body.velocity.x = -1 * Math.abs(boids[i].body.velocity.x);
  }
  if (boids[i].y < limit) {
    boids[i].body.velocity.y = Math.abs(boids[i].body.velocity.y);
  }
  else if (boids[i].y > window.innerHeight- limit) {
    boids[i].body.velocity.y = -1 *Math.abs(boids[i].body.velocity.y);
  }
};
