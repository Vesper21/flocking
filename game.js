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
  boids[i].speed = 0.05
  }
};

function update() {
  for (var boid of boids) {
    bound(boid);
    //compute velocity
    var f1 = cohesion(boid, boids);
    var f2 = separation(boid, boids);
    var f3 = alignement(boid, boids);

    var coef1 = 1;
    var coef2 = 1;
    var coef3 = 0.05;

    var newAcc = new Phaser.Math.Vector2(coef1*f1.x + coef2*f2.x + coef3*f3.x, coef1*f1.y + coef2*f2.y + coef3*f3.y);
    newAcc.normalize();
    var newVelocity = new Phaser.Math.Vector2(boid.body.velocity.x + newAcc.x, boid.body.velocity.y + newAcc.y);
    boid.setVelocity(newVelocity.x, newVelocity.y);


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

function cohesion(boid, boids) {
  var closeBoids = [];
  var radius = 100;
  for (var otherBoid of boids) {
    var distance = Phaser.Math.Distance.BetweenPoints(otherBoid, boid);
    if (distance < radius) {
      closeBoids.push(otherBoid)
    }
  }
  if (closeBoids.length == 0) {
    return new Phaser.Math.Vector2(0, 0);
  }
  var centroid = Phaser.Geom.Point.GetCentroid(closeBoids);
  var force = new Phaser.Math.Vector2(centroid.x - boid.x, centroid.y - boid.y)
  return force.normalize()
};

function separation(boid, boids) {
  var tooCloseBoids = []
  var radius = 80;
  for (var otherBoid of boids) { // TODO helper to get close boids
    var distance = Phaser.Math.Distance.BetweenPoints(otherBoid, boid);
    if (distance < radius && distance != 0) {
      tooCloseBoids.push(otherBoid)
    }
  }
  if (tooCloseBoids.length == 0) {
    return new Phaser.Math.Vector2(0, 0);
  }
  var centroid = Phaser.Geom.Point.GetCentroid(tooCloseBoids);
  var force = new Phaser.Math.Vector2(boid.x - centroid.x, boid.y - centroid.y)
  return force.normalize()
 };

function alignement(boid, boids) {
  var closeBoids = []
  var radius = 90;
  for (var otherBoid of boids) {
    var distance = Phaser.Math.Distance.BetweenPoints(otherBoid, boid);
    if (distance < radius && distance != 0) {
      closeBoids.push(otherBoid.body.velocity)
    }
  }
  if (closeBoids.length == 0) {
    return new Phaser.Math.Vector2(0, 0);
  }
  //var closeBoidsVelocity = closeBoids.map(function(x) {return x.body.velocity});
  var centroid = Phaser.Geom.Point.GetCentroid(closeBoids);
  var force = new Phaser.Math.Vector2(centroid.x - boid.body.velocity.x, centroid.y - boid.body.velocity.y);
  return force.normalize();
};
