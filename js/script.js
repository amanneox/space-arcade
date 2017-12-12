var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload () {

    game.load.image('player', './assets/PNG/playerShip2_red.png');
    game.load.image('enemy1', './assets/PNG/Enemies/enemyBlack1.png');
    game.load.image('enemy2', './assets/PNG/Enemies/enemyBlack2.png');
      game.load.image('enemy3', './assets/PNG/Enemies/enemyBlack3.png');
  game.load.image('enemy4', './assets/PNG/Enemies/enemyBlue2.png');
  game.load.image('enemy5', './assets/PNG/Enemies/enemyRed5.png');
    game.load.image('enemy6', './assets/PNG/Enemies/enemyGreen4.png');
      game.load.image('weapon1', './assets/PNG/Lasers/laserBlue01.png');
        game.load.image('weapon2', './assets/PNG/Lasers/laserRed12.png');
          game.load.image('bluebolt', './assets/PNG/Power-ups/powerupBlue_bolt.png');
            game.load.image('redbolt', './assets/PNG/Power-ups/powerupRed_bolt.png');
                game.load.image('goldstar', './assets/PNG/Power-ups/star_gold.png');
              game.load.image('goldshield', './assets/PNG/Power-ups/shield_gold.png');

                game.load.image('silvershield', './assets/PNG/Power-ups/shield_silver.png');
                  game.load.image('bronzeshield', './assets/PNG/Power-ups/shield_bronze.png');
  game.load.image('boss', './assets/boss.png');
    game.load.image('star', './assets/star2.png');
      game.load.image('bluebullet', './assets/bluebullet.png');
    game.load.image('starfield', './assets/starfield.png');
        game.load.image('bullet', './assets/PNG/Lasers/laserBlue02.png');
    game.load.image('baddie', './assets/space-baddie.png');
      game.load.image('damage', './assets/PNG/Damage/playerShip3_damage3.png');
  game.load.image('deathRay', './assets/PNG/Lasers/laserRed03.png');
        game.load.image('trail', './assets/PNG/Effects/fire08.png');
                game.load.image('explosion', './assets/PNG/Explosion/explosion00.png');
                  game.load.image('blow', './assets/PNG/Explosion/explosion00.png');
    game.load.atlas('lazer', './assets/laser.png', './assets/laser.json');
  game.load.audio('sfx', './assets/fx_mixdown.ogg');
    game.load.bitmapFont('spacefont', './assets/spacefont.png', './assets/spacefont.xml');
    game.load.audio('fxexplode', './assets/Sounds/explosion.mp3');
        game.load.audio('fxshot1', './assets/Sounds/shot1.ogg');
            game.load.audio('fxshot2', './assets/Sounds/shot2.wav');
            game.load.audio('fxlazer', './assets/Sounds/lazerup.wav');
}

var stars;
var baddies;
var lazers;
var player;
var bullets;
var cursors;
var fireButton;
var shields;
var bulletTime = 0;
var frameTime = 0;
var frames;
var rbutton;
var bulletTimer = 0;
var tapRestart;
var spaceRestart;
var animation;
var prevCamX = 0;
var blueEnemyLaunchTimer;
var redEnemyLaunchTimer;
var blackEnemyLaunchTimer;
var blueEnemyLaunched = false;
var blueEnemySpacing = 2500;
var RedEnemySpacing = 2000;
var enemyBullets;
var MAXSPEED = 400;
var bossSpacing = 20000;
var bossBulletTimer = 0;
var bossYdirection = -1;
var blackEnemySpacing=1000;
var score = 0;
var greenEnemySpacing = 1000;
var playerDeath;
var ray;
var scoreText;
var DRAG = 400;
function create () {

    game.world.setBounds(0, 0, 800*2, 600);
      starfield = game.add.tileSprite(0, 0, 800*4, 700, 'starfield');
 game.physics.startSystem(Phaser.Physics.ARCADE);
    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');
    fx = game.add.audio('sfx');
      fx.allowMultiple = true;

      	fx.addMarker('alien death', 1, 1.0);
      	fx.addMarker('boss hit', 3, 0.5);
      	fx.addMarker('escape', 4, 3.2);
      	fx.addMarker('meow', 8, 0.5);
      	fx.addMarker('numkey', 9, 0.1);
      	fx.addMarker('ping', 10, 1.0);
      	fx.addMarker('death', 12, 4.2);
      	fx.addMarker('shot', 17, 1.0);
      	fx.addMarker('squit', 19, 0.3);
          fxexplode = game.add.audio('fxexplode');
            fxshot1 = game.add.audio('fxshot1');
              fxshot2 = game.add.audio('fxshot2');
                    fxlazer = game.add.audio('fxlazer');
    stars = game.add.group();

    for (var i = 0; i < 128; i++)
    {
        stars.create(game.world.randomX, game.world.randomY, 'star');
    }

    baddies = game.add.group();

    for (var i = 0; i < 16; i++)
    {
        baddies.create(game.world.randomX, game.world.randomY, 'baddie');
    }

    lazers = game.add.group();

    player = game.add.sprite(game.world.centerX, game.world.centerY,'player');
     game.physics.setBoundsToWorld();
    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    game.physics.arcade.enable(player);
    player.enableBody = true;
    player.health = 100;
    game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.drag.setTo(DRAG, DRAG);
 player.weaponLevel = 1
 player.events.onKilled.add(function(){
     shipTrail.kill();
 });
 player.events.onRevived.add(function(){
     shipTrail.start(false, 5000, 10);
 });
  //player.body.velocity.y =-200;
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
tab = game.input.keyboard.addKey(Phaser.Keyboard.TAB);
    prevCamX = game.camera.x;
    //  Our bullet group
   bullets = game.add.group();
   bullets.enableBody = true;
   bullets.physicsBodyType = Phaser.Physics.ARCADE;
   bullets.createMultiple(30, 'bullet');
   bullets.setAll('anchor.x', 0.5);
   bullets.setAll('anchor.y', 1);
   bullets.setAll('outOfBoundsKill', true);
   bullets.setAll('checkWorldBounds', true);

   weapon1 = game.add.group();
   weapon1.enableBody = true;
   weapon1.physicsBodyType = Phaser.Physics.ARCADE;
   weapon1.createMultiple(30, 'weapon1');
   weapon1.setAll('anchor.x', 0.5);
   weapon1.setAll('anchor.y', 1);
   weapon1.setAll('outOfBoundsKill', true);
   weapon1.setAll('checkWorldBounds', true);

   weapon2 = game.add.group();
   weapon2.enableBody = true;
   weapon2.physicsBodyType = Phaser.Physics.ARCADE;
   weapon2.createMultiple(30, 'weapon2');
   weapon2.setAll('anchor.x', 0.5);
   weapon2.setAll('anchor.y', 1);
   weapon2.setAll('outOfBoundsKill', true);
   weapon2.setAll('checkWorldBounds', true);

   bluebolt = game.add.group();
   bluebolt.enableBody = true;
   bluebolt.physicsBodyType = Phaser.Physics.ARCADE;
   bluebolt.createMultiple(30, 'bluebolt');
   bluebolt.setAll('anchor.x', 0.5);
   bluebolt.setAll('anchor.y', 1);
   bluebolt.setAll('outOfBoundsKill', true);
   bluebolt.setAll('checkWorldBounds', true);

   redbolt = game.add.group();
   redbolt.enableBody = true;
   redbolt.physicsBodyType = Phaser.Physics.ARCADE;
   redbolt.createMultiple(30, 'redbolt');
   redbolt.setAll('anchor.x', 0.5);
   redbolt.setAll('anchor.y', 1);
   redbolt.setAll('outOfBoundsKill', true);
   redbolt.setAll('checkWorldBounds', true);

   goldstar = game.add.group();
   goldstar.enableBody = true;
   goldstar.physicsBodyType = Phaser.Physics.ARCADE;
   goldstar.createMultiple(30, 'goldstar');
   goldstar.setAll('anchor.x', 0.5);
   goldstar.setAll('anchor.y', 1);
   goldstar.setAll('outOfBoundsKill', true);
   goldstar.setAll('checkWorldBounds', true);

      goldshield = game.add.group();
      goldshield.enableBody = true;
      goldshield.physicsBodyType = Phaser.Physics.ARCADE;
      goldshield.createMultiple(30, 'goldshield');
      goldshield.setAll('anchor.x', 0.5);
      goldshield.setAll('anchor.y', 1);
      goldshield.setAll('outOfBoundsKill', true);
      goldshield.setAll('checkWorldBounds', true);

      bronzeshield = game.add.group();
      bronzeshield.enableBody = true;
      bronzeshield.physicsBodyType = Phaser.Physics.ARCADE;
      bronzeshield.createMultiple(30, 'bronzeshield');
      bronzeshield.setAll('anchor.x', 0.5);
      bronzeshield.setAll('anchor.y', 1);
      bronzeshield.setAll('outOfBoundsKill', true);
      bronzeshield.setAll('checkWorldBounds', true);

      silvershield = game.add.group();
      silvershield.enableBody = true;
      silvershield.physicsBodyType = Phaser.Physics.ARCADE;
      silvershield.createMultiple(30, 'silvershield');
      silvershield.setAll('anchor.x', 0.5);
      silvershield.setAll('anchor.y', 1);
      silvershield.setAll('outOfBoundsKill', true);
      silvershield.setAll('checkWorldBounds', true);

      boss = game.add.sprite(0, 0, 'boss');
      boss.exists = false;
      boss.alive = false;
      boss.anchor.setTo(0.5, 0.5);
      boss.damageAmount = 50;
      boss.angle = 180;
      boss.scale.x = 0.6;
      boss.scale.y = 0.6;
      game.physics.enable(boss, Phaser.Physics.ARCADE);
      boss.body.maxVelocity.setTo(100, 80);
      boss.dying = false;
      boss.finishOff = function() {
          if (!boss.dying) {
              boss.dying = true;
              bossDeath.x = boss.x;
              bossDeath.y = boss.y;
              bossDeath.start(false, 1000, 50, 20);
              //  kill boss after explotions
              game.time.events.add(1000, function(){
                  var explosion = explosions.getFirstExists(false);
                  var beforeScaleX = explosions.scale.x;
                  var beforeScaleY = explosions.scale.y;
                  var beforeAlpha = explosions.alpha;
                  explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
                  explosion.alpha = 0.4;
                  explosion.scale.x = 3;
                  explosion.scale.y = 3;
                   animation = explosion.play('explosion', 30, false, true);
                   explosion.scale.x = beforeScaleX;
                   explosion.scale.y = beforeScaleY;
                   explosion.alpha = beforeAlpha;
/*
                  animation.onComplete.addOnce(function(){
                      explosion.scale.x = beforeScaleX;
                      explosion.scale.y = beforeScaleY;
                      explosion.alpha = beforeAlpha;
                  });
                  */
                  boss.kill();
                  booster.kill();
                  boss.dying = false;
                  bossDeath.on = false;
                  explosion.kill();
                  //  queue next boss
                  bossLaunchTimer = game.time.events.add(game.rnd.integerInRange(bossSpacing, bossSpacing + 5000), launchBoss);
              });

              //  reset pacing for other enemies
              blueEnemySpacing = 2500;
              greenEnemySpacing = 1000;

              //  give some bonus health
              player.health = Math.min(100, player.health + 40);
              shields.render();
          }
      };
      function addRay(leftRight) {
           ray = game.add.sprite(leftRight * boss.width * 0.75, 0, 'deathRay');
          ray.alive = false;
          ray.visible = false;
          boss.addChild(ray);
          ray.crop({x: 0, y: 0, width: 40, height: 40});
          ray.anchor.x = 0.5;
          ray.anchor.y = 0.5;
          ray.scale.x = 2.5;
          ray.damageAmount = 10;
          game.physics.enable(ray, Phaser.Physics.ARCADE);
          ray.body.setSize(ray.width / 5, ray.height / 4);
          ray.update = function() {
              this.alpha = game.rnd.realInRange(0.6, 1);
          };
          boss['ray' + (leftRight > 0 ? 'Right' : 'Left')] = ray;
      }
      addRay(1);
      addRay(-1);

      var ship = game.add.sprite(0, 0, 'boss');
      ship.anchor = {x: 0.5, y: 0.5};
      boss.addChild(ship);
      boss.fire = function() {

          if (game.time.now > bossBulletTimer) {
              var raySpacing = 100;
              var chargeTime = 100;
              var rayTime = 1500;

              function chargeAndShoot(side) {
                  ray = boss['ray' + side];
                  ray.name = side
                  ray.revive();
                  ray.y = 80;
                  ray.alpha = 0;
                  ray.scale.y = 13;
                  game.add.tween(ray).to({alpha: 1}, chargeTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                      ray.scale.y = 150;
                      game.add.tween(ray).to({y: -1500}, rayTime, Phaser.Easing.Linear.In, true).onComplete.add(function(ray){
                          ray.kill();
                      });
                  });
              }
              chargeAndShoot('Right');
              chargeAndShoot('Left');

              bossBulletTimer = game.time.now + raySpacing;
          }
      };
      boss.update = function() {
        if (!boss.alive) return;

        boss.rayLeft.update();
        boss.rayRight.update();

        if (boss.y > 140) {
          boss.body.acceleration.y = -50;
        }
        if (boss.y < 140) {
          boss.body.acceleration.y = 50;
        }
        if (boss.x > player.x + 50) {
          boss.body.acceleration.x = -50;
        } else if (boss.x < player.x - 50) {
          boss.body.acceleration.x = 50;
        } else {
          boss.body.acceleration.x = 0;
        }

        //  Squish and rotate boss for illusion of "banking"
        var bank = boss.body.velocity.x / MAXSPEED;
        boss.scale.x = 0.6 - Math.abs(bank) / 3;
        boss.angle = 180 - bank * 20;

        booster.x = boss.x + -5 * bank;
        booster.y = boss.y + 10 * Math.abs(bank) - boss.height / 2;

        //  fire if player is in target
        var angleToPlayer = game.math.radToDeg(game.physics.arcade.angleBetween(boss, player)) - 90;
        var anglePointing = 180 - Math.abs(boss.angle);
        if (anglePointing - angleToPlayer < 18) {
            boss.fire();
                fxlazer.play();
        }
      }

        booster = game.add.emitter(boss.body.x, boss.body.y - boss.height / 2);
        booster.width = 0;
        booster.makeParticles('bluebullet');
        booster.forEach(function(p){
          p.crop({x: 120, y: 0, width: 45, height: 50});
          //  clever way of making 2 exhaust trails by shifing particles randomly left or right
          p.anchor.x = game.rnd.pick([1,-1]) * 0.95 + 0.5;
          p.anchor.y = 0.75;
        });
        booster.setXSpeed(0, 0);
        booster.setRotation(0,0);
        booster.setYSpeed(-30, -50);
        booster.gravity = 0;
        booster.setAlpha(1, 0.1, 400);
        booster.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
        boss.bringToTop();

        bossDeath = game.add.emitter(boss.x, boss.y);
        bossDeath.width = boss.width / 2;
        bossDeath.height = boss.height / 2;
          bossDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 20);
        bossDeath.setAlpha(0.9, 0, 900);
        bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);

    blackEnemies = game.add.group();
      blackEnemies.enableBody = true;
      blackEnemies.physicsBodyType = Phaser.Physics.ARCADE;
      blackEnemies.createMultiple(5, 'enemy3');
      blackEnemies.setAll('anchor.x', 0.5);
      blackEnemies.setAll('anchor.y', 0.5);
      blackEnemies.setAll('scale.x', 0.5);
      blackEnemies.setAll('scale.y', 0.5);
      blackEnemies.setAll('angle', 180);
      blackEnemies.forEach(function(enemy){
         addEnemyEmitterTrail(enemy);
             enemy.damageAmount = 10;
         enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
         enemy.events.onKilled.add(function(){
             enemy.trail.kill();
         });
     });
     greenEnemies = game.add.group();
       greenEnemies.enableBody = true;
       greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
       greenEnemies.createMultiple(8, 'enemy6');
       greenEnemies.setAll('anchor.x', 0.5);
       greenEnemies.setAll('anchor.y', 0.5);
       greenEnemies.setAll('scale.x', 0.5);
       greenEnemies.setAll('scale.y', 0.5);
       greenEnemies.setAll('angle', 180);
       greenEnemies.forEach(function(enemy){
          addEnemyEmitterTrail(enemy);
              enemy.damageAmount = 20;
          enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
          enemy.events.onKilled.add(function(){
              enemy.trail.kill();
          });
      });
      redEnemies = game.add.group();
        redEnemies.enableBody = true;
        redEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        redEnemies.createMultiple(8, 'enemy5');
        redEnemies.setAll('anchor.x', 0.5);
        redEnemies.setAll('anchor.y', 0.5);
        redEnemies.setAll('scale.x', 0.5);
        redEnemies.setAll('scale.y', 0.5);
        redEnemies.setAll('angle', 180);
        redEnemies.forEach(function(enemy){
           addEnemyEmitterTrail(enemy);
               enemy.damageAmount = 30;
           enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
           enemy.events.onKilled.add(function(){
               enemy.trail.kill();
           });
       });
       blueEnemies = game.add.group();
         blueEnemies.enableBody = true;
         blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
         blueEnemies.createMultiple(12, 'enemy4');
         blueEnemies.setAll('anchor.x', 0.5);
         blueEnemies.setAll('anchor.y', 0.5);
         blueEnemies.setAll('scale.x', 0.5);
         blueEnemies.setAll('scale.y', 0.5);
         blueEnemies.setAll('angle', 180);
         blueEnemies.forEach(function(enemy){
             enemy.damageAmount = 40;
            addEnemyEmitterTrail(enemy);
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.events.onKilled.add(function(){
                enemy.trail.kill();
            });
        });
        blueEnemyBullets = game.add.group();
        blueEnemyBullets.enableBody = true;
        blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemyBullets.createMultiple(30, 'bluebullet');
        blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        blueEnemyBullets.setAll('alpha', 0.9);
        blueEnemyBullets.setAll('anchor.x', 0.5);
        blueEnemyBullets.setAll('anchor.y', 0.5);
        blueEnemyBullets.setAll('outOfBoundsKill', true);
        blueEnemyBullets.setAll('checkWorldBounds', true);
        blueEnemyBullets.forEach(function(enemy){
            enemy.body.setSize(20, 20);
        });
    shipTrail = game.add.emitter(player.x, player.y + 10, 400);
   shipTrail.width = 10;
   shipTrail.makeParticles('trail');
   shipTrail.setXSpeed(30, -30);
   shipTrail.setYSpeed(200, 180);
   shipTrail.setRotation(50,-50);
   shipTrail.setAlpha(1, 0.01, 800);
   shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
   shipTrail.start(false, 5000, 10);
   explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'blow');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('blow');
    });
    shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 50);
    shields.render = function () {
        shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
    };
    shields.render();
    playerDeath = game.add.emitter(player.x, player.y);
    playerDeath.width = 50;
    playerDeath.height = 50;
    playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
    playerDeath.setAlpha(0.9, 0, 800);
    playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
    scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
    scoreText.render = function () {
        scoreText.text = 'Score: ' + score;
    };
    scoreText.render();
    gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
    gameOver.x = gameOver.x - gameOver.textWidth / 2;
    gameOver.y = gameOver.y - gameOver.textHeight / 3;
    gameOver.visible = false;
   game.time.events.add(Phaser.Timer.SECOND * 0+game.rnd.frac()*10, launchBlackEnemy, this);
  game.time.events.add(Phaser.Timer.SECOND * 40+game.rnd.frac()*10, launchGreenEnemy, this);
  game.time.events.add(Phaser.Timer.SECOND * 60+game.rnd.frac()*10, launchRedEnemy, this);
  game.time.events.add(Phaser.Timer.SECOND * 120+game.rnd.frac()*10, launchBlueEnemy, this);
  game.time.events.loop(Phaser.Timer.SECOND*60+game.rnd.frac()*10, launchRedbolt, this);
    game.time.events.loop(Phaser.Timer.SECOND*40+game.rnd.frac()*10, launchBluebolt, this);
    game.time.events.loop(Phaser.Timer.SECOND*45+game.rnd.frac()*10, launchGoldshield, this);
        game.time.events.loop(Phaser.Timer.SECOND*30+game.rnd.frac()*10, launchBronzeshield, this);
            game.time.events.loop(Phaser.Timer.SECOND*35+game.rnd.frac()*10, launchSilvershield, this);
            game.time.events.loop(Phaser.Timer.SECOND*20+game.rnd.frac()*10, launchGoldstar, this);
              game.time.events.add(Phaser.Timer.SECOND*140+game.rnd.frac()*10, launchBoss, this);

}
function launchBoss() {
    boss.reset(game.width / 2, -boss.height);
    booster.start(false, 1000, 10);
    boss.health = 5001;
    bossBulletTimer = game.time.now + 5000;
}

function shipCollide(player, enemy) {
  fxexplode.play();
  enemy.kill();

  player.damage(enemy.damageAmount);
  shields.render();

  if (player.alive) {
      var explosion = explosions.getFirstExists(false);
      explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
      explosion.alpha = 0.9;
      explosion.play('blow', 30, false, true);
  } else {
      playerDeath.x = player.x;
      playerDeath.y = player.y;
      playerDeath.start(false, 1000, 10, 10);
  }
}
function launchGoldstar() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var star = goldstar.getFirstExists(false);
    if (star) {
        star.reset(game.rnd.integerInRange(0, game.width), -20);
        star.body.velocity.x = game.rnd.integerInRange(-300, 300);
        star.body.velocity.y = ENEMY_SPEED;
        star.body.drag.x = 100;

        star.update = function(){
          star.angle = 180 - game.math.radToDeg(Math.atan2(star.body.velocity.x, star.body.velocity.y));

          if (star.y > game.height + 200) {
            star.kill();
          }
        }
    }

}

function launchSilvershield() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var shield = silvershield.getFirstExists(false);
    if (shield) {
        shield.reset(game.rnd.integerInRange(0, game.width), -20);
        shield.body.velocity.x = game.rnd.integerInRange(-300, 300);
        shield.body.velocity.y = ENEMY_SPEED;
        shield.body.drag.x = 100;

        shield.update = function(){
          shield.angle = 180 - game.math.radToDeg(Math.atan2(shield.body.velocity.x, shield.body.velocity.y));

          if (shield.y > game.height + 200) {
            shield.kill();
          }
        }
    }

}
function launchBronzeshield() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var shield = bronzeshield.getFirstExists(false);
    if (shield) {
        shield.reset(game.rnd.integerInRange(0, game.width), -20);
        shield.body.velocity.x = game.rnd.integerInRange(-300, 300);
        shield.body.velocity.y = ENEMY_SPEED;
        shield.body.drag.x = 100;

        shield.update = function(){
          shield.angle = 180 - game.math.radToDeg(Math.atan2(shield.body.velocity.x, shield.body.velocity.y));

          if (shield.y > game.height + 200) {
            shield.kill();
          }
        }
    }

}

function launchGoldshield() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var shield = goldshield.getFirstExists(false);
    if (shield) {
        shield.reset(game.rnd.integerInRange(0, game.width), -20);
        shield.body.velocity.x = game.rnd.integerInRange(-300, 300);
        shield.body.velocity.y = ENEMY_SPEED;
        shield.body.drag.x = 100;

        shield.update = function(){
          shield.angle = 180 - game.math.radToDeg(Math.atan2(shield.body.velocity.x, shield.body.velocity.y));

          if (shield.y > game.height + 200) {
            shield.kill();
          }
        }
    }

}

function launchBluebolt() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var bolt = bluebolt.getFirstExists(false);
    if (bolt) {
        bolt.reset(game.rnd.integerInRange(0, game.width), -20);
        bolt.body.velocity.x = game.rnd.integerInRange(-300, 300);
        bolt.body.velocity.y = ENEMY_SPEED;
        bolt.body.drag.x = 100;

        bolt.update = function(){
          bolt.angle = 180 - game.math.radToDeg(Math.atan2(bolt.body.velocity.x, bolt.body.velocity.y));

          if (bolt.y > game.height + 200) {
            bolt.kill();
          }
        }
    }

}

function launchRedbolt() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var bolt = redbolt.getFirstExists(false);
    if (bolt) {
        bolt.reset(game.rnd.integerInRange(0, game.width), -20);
        bolt.body.velocity.x = game.rnd.integerInRange(-300, 300);
        bolt.body.velocity.y = ENEMY_SPEED;
        bolt.body.drag.x = 100;

        bolt.update = function(){
          bolt.angle = 180 - game.math.radToDeg(Math.atan2(bolt.body.velocity.x, bolt.body.velocity.y));

          if (bolt.y > game.height + 200) {
            bolt.kill();
          }
        }
    }

}

function launchRedEnemy() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var enemy = redEnemies.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //  Update function for each enemy ship to update rotation etc
        enemy.update = function(){
          enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

          enemy.trail.x = enemy.x;
          enemy.trail.y = enemy.y -10;

          //  Kill enemies once they go off screen
          if (enemy.y > game.height + 200) {
            enemy.kill();
          }
        }
    }


      redEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(RedEnemySpacing, RedEnemySpacing + 1000), launchRedEnemy);
}
function launchBlueEnemy() {
  var startingX = game.rnd.integerInRange(100, game.width - 100);
   var verticalSpeed = 180;
   var spread = 60;
   var frequency = 70;
   var verticalSpacing = 70;
   var numEnemiesInWave = 5;

   //  Launch wave
   for (var i =0; i < numEnemiesInWave; i++) {
       var enemy = blueEnemies.getFirstExists(false);
       if (enemy) {
           enemy.startingX = startingX;
           enemy.reset(game.width / 2, -verticalSpacing * i);
           enemy.body.velocity.y = verticalSpeed;

           //  Set up firing
           var bulletSpeed = 400;
           var firingDelay = 2000;
           enemy.bullets = 1;
           enemy.lastShot = 0;

           //  Update function for each enemy
           enemy.update = function(){
             //  Wave movement
             this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;

             //  Squish and rotate ship for illusion of "banking"
             bank = Math.cos((this.y + 60) / frequency)
             this.scale.x = 0.5 - Math.abs(bank) / 8;
             this.angle = 180 - bank * 2;

             //  Fire
             enemyBullet = blueEnemyBullets.getFirstExists(false);
             if (enemyBullet &&
                 this.alive &&
                 this.bullets &&
                 this.y > game.width / 8 &&
                 game.time.now > firingDelay + this.lastShot) {
                   this.lastShot = game.time.now;
                   this.bullets--;
                   enemyBullet.reset(this.x, this.y + this.height / 2);
                   enemyBullet.damageAmount = this.damageAmount;
                   var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                   enemyBullet.angle = game.math.radToDeg(angle);
               }

             //  Kill enemies once they go off screen
             if (this.y > game.height + 200) {
               this.kill();
               this.y = -20;
             }
           };
       }
   }

   blueEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(blueEnemySpacing, blueEnemySpacing + 4000), launchBlueEnemy);}
function launchGreenEnemy() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var enemy = greenEnemies.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //  Update function for each enemy ship to update rotation etc
        enemy.update = function(){
          enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

          enemy.trail.x = enemy.x;
          enemy.trail.y = enemy.y -10;

          //  Kill enemies once they go off screen
          if (enemy.y > game.height + 200) {
            enemy.kill();
          }
        }
    }


      greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(greenEnemySpacing, greenEnemySpacing + 1000), launchGreenEnemy);

}
function launchBlackEnemy() {
  var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var enemy = blackEnemies.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        enemy.trail.start(false, 800, 1);

        //  Update function for each enemy ship to update rotation etc
        enemy.update = function(){
          enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

          enemy.trail.x = enemy.x;
          enemy.trail.y = enemy.y -10;

          //  Kill enemies once they go off screen
          if (enemy.y > game.height + 200) {
            enemy.kill();
          }
        }
    }

    //  Send another enemy soon
    blackEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(blackEnemySpacing, blackEnemySpacing + 1000), launchBlackEnemy);
}
function render() {



}
function fireBullet() {

  switch (player.weaponLevel) {
      case 1:
      fx.play('shot');
      //  To avoid them being allowed to fire too fast we set a time limit
      if (game.time.now > bulletTimer)
      {
          var BULLET_SPEED = 400;
          var BULLET_SPACING = 250;
          //  Grab the first bullet we can from the pool
          var bullet = bullets.getFirstExists(false);

          if (bullet)
          {
              //  And fire it
              //  Make bullet come out of tip of ship with right angle
              var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
              bullet.reset(player.x + bulletOffset, player.y);
              bullet.angle = player.angle;
              game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
              bullet.body.velocity.x += player.body.velocity.x;

              bulletTimer = game.time.now + BULLET_SPACING;
          }
      }
      break;

      case 2:
      fxshot1.play();
      if (game.time.now > bulletTimer) {
          var BULLET_SPEED = 400;
          var BULLET_SPACING = 550;


          for (var i = 0; i < 3; i++) {
              var bullet = weapon1.getFirstExists(false);
              if (bullet) {
                  //  Make bullet come out of tip of ship with right angle
                  var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                  bullet.reset(player.x + bulletOffset, player.y);
                  //  "Spread" angle of 1st and 3rd bullets
                  var spreadAngle;
                  if (i === 0) spreadAngle = -20;
                  if (i === 1) spreadAngle = 0;
                  if (i === 2) spreadAngle = 20;
                  bullet.angle = player.angle + spreadAngle;
                  game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                  bullet.body.velocity.x += player.body.velocity.x;
              }
              bulletTimer = game.time.now + BULLET_SPACING;
          }
      }
      break;
      case 3:
      fxshot2.play();
      if (game.time.now > bulletTimer) {
          var BULLET_SPEED = 400;
          var BULLET_SPACING = 550;


          for (var i = 0; i < 5; i++) {
              var bullet = weapon2.getFirstExists(false);
              if (bullet) {
                  //  Make bullet come out of tip of ship with right angle
                  var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                  bullet.reset(player.x + bulletOffset, player.y);
                  //  "Spread" angle of 1st and 3rd bullets
                  var spreadAngle;
                  if (i === 0) spreadAngle = -20;
                  if (i === 1) spreadAngle = 0;
                  if (i === 2) spreadAngle = 20;
                    if (i === 3) spreadAngle = -40;
                      if (i === 4) spreadAngle = 40;
                  bullet.angle = player.angle + spreadAngle;
                  game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                  bullet.body.velocity.x += player.body.velocity.x;
              }
              bulletTimer = game.time.now + BULLET_SPACING;
          }
      }

  }
}
function addEnemyEmitterTrail(enemy) {
    var enemyTrail = game.add.emitter(enemy.x, player.y - 10, 100);
    enemyTrail.width = 5;
    enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
    enemyTrail.setXSpeed(20, -20);
    enemyTrail.setRotation(50,-50);
    enemyTrail.setAlpha(0.4, 0, 800);
    enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
    enemy.trail = enemyTrail;
}
function test(bullet,player) {

}
function update () {
   starfield.tilePosition.y += 2;
player.checkWorldBounds = true;
game.physics.arcade.overlap(blackEnemies, bullets, hitEnemy, null, this);
game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);
game.physics.arcade.overlap(redEnemies, bullets, hitEnemy, null, this);
game.physics.arcade.overlap(blueEnemies, bullets, hitEnemy, null, this);

game.physics.arcade.overlap(boss, weapon1, hitEnemy, bossHitTest, this);
game.physics.arcade.overlap(boss, weapon2, hitEnemy, bossHitTest, this);
game.physics.arcade.overlap(boss, bullets, hitEnemy, bossHitTest, this);
game.physics.arcade.overlap(player, boss.rayLeft, enemyHitsPlayer, null, this);
game.physics.arcade.overlap(player, boss.rayRight, enemyHitsPlayer, null, this);


game.physics.arcade.overlap(blackEnemies, weapon1, hitEnemy, null, this);
game.physics.arcade.overlap(greenEnemies, weapon1, hitEnemy, null, this);
game.physics.arcade.overlap(redEnemies, weapon1, hitEnemy, null, this);
game.physics.arcade.overlap(blueEnemies, weapon1, hitEnemy, null, this);

game.physics.arcade.overlap(blackEnemies, weapon2, hitEnemy, null, this);
game.physics.arcade.overlap(greenEnemies, weapon2, hitEnemy, null, this);
game.physics.arcade.overlap(redEnemies, weapon2, hitEnemy, null, this);
game.physics.arcade.overlap(blueEnemies, weapon2, hitEnemy, null, this);

    game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        player.body.acceleration.x = 0;
    }
    if (player.y > game.height - 50) {
        player.y = game.height - 50;
        player.body.acceleration.y = 0;
    }
    if (player.y < 50) {
        player.y = 50;
        player.body.acceleration.x = 0;
    }
    if (player.x < 50) {
        player.x = 50;
        player.body.acceleration.x = 0;
    }
    if (cursors.left.isDown)
    {
        player.x -= 8;
        player.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        player.x += 8;
        player.scale.x = 1;
    }

    if (cursors.up.isDown)
    {
        player.y -= 8;
    }
    else if (cursors.down.isDown)
    {
        player.y += 8;
    }

    if (fireButton.isDown)
    {
        fireBullet();
    }

    lazers.forEachAlive(updateBullets, this);

    prevCamX = game.camera.x;
  shipTrail.x = player.x;
    shipTrail.y = player.y;

    game.physics.arcade.overlap(player, bluebolt, powerUpBlue, null, this);
    game.physics.arcade.overlap(player, redbolt, powerUpRed, null, this);

game.physics.arcade.overlap(player, goldstar, scoreUpStar, null, this);

game.physics.arcade.overlap(player, goldshield, shieldUpGold, null, this);
game.physics.arcade.overlap(player, silvershield, shieldUpSilver, null, this);
game.physics.arcade.overlap(player, bronzeshield, shieldUpBronze, null, this);

    game.physics.arcade.overlap(player, blueEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(player, blackEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(player, redEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(player, greenEnemies, shipCollide, null, this);
        if (! player.alive && gameOver.visible === false) {
            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = game.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();

            function setResetHandlers() {
              tapRestart = game.input.onTap.addOnce(_restart,this);
            //    spaceRestart = fireButton.OnDown.addOnce(_restart,this);
                function _restart() {
                  tapRestart.detach();
              //    spaceRestart.detach();
                  restart();
                }
            }
        }

}
function powerUpBlue(player,bolt) {
    fx.play('ping');
  player.weaponLevel=2;
  bolt.kill();
}
function scoreUpStar(player,star) {
  fx.play('ping');
  score+=1000;
  star.kill();
  scoreText.render()
}

function shieldUpGold(player,shield) {
  fx.play('ping');
  player.health+=50;
  shield.kill();
  shields.render()
}

function shieldUpSilver(player,shield) {
    fx.play('ping');
  player.health+=20;
  shield.kill();
  shields.render()
}
function shieldUpBronze(player,shield) {
    fx.play('ping');
  player.health+=10;
  shield.kill();
  shields.render()
}
function powerUpRed(player,bolt) {
    fx.play('ping');
  player.weaponLevel=3;
  bolt.kill();
}
function bossHitTest(boss, bullet) {

boss.health-=100;
  return true;
}
function hitEnemy(enemy, bullet) {
  fxexplode.play();
    var explosion = explosions.getFirstExists(false);
 explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);

    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.9;
    explosion.play('blow', 30, false, true);
    explosion.setScale= Phaser.Easing.Quintic.Out;
    if (enemy.finishOff && enemy.health < 5) {
      enemy.finishOff();
    } else {
        enemy.damage(enemy.damageAmount);
    }
   bullet.kill();
   score += enemy.damageAmount * 10;
   scoreText.render();


}
function makeButton(name, x, y) {

    var button = game.add.button(x, y, 'button', click, this, 0, 1, 2);
    button.name = name;
    button.scale.set(2, 1.5);
    button.smoothed = false;

    var text = game.add.bitmapText(x, y + 7, 'nokia', name, 16);
    text.x += (button.width / 2) - (text.textWidth / 2);

}

function updateBullets (lazer) {

    // if (game.time.now > frameTime)
    // {
    //     frameTime = game.time.now + 500;
    // }
    // else
    // {
    //     return;
    // }

    //  Adjust for camera scrolling
    var camDelta = game.camera.x - prevCamX;
    lazer.x += camDelta;

    if (lazer.animations.frameName !== 'frame30')
    {
        lazer.animations.next();
    }
    else
    {


            lazer.y -= 16;

            if (lazer.y > (game.camera.view.right - 224))
            {
                lazer.kill();
            }


    }

}



function enemyHitsPlayer (player, bullet) {
    bullet.kill();
fxexplode.play();
    player.damage(bullet.damageAmount);
    shields.render()

    if (player.alive) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
        explosion.alpha = 0.7;
        explosion.play('blow', 30, false, true);
    } else {
        playerDeath.x = player.x;
        playerDeath.y = player.y;
        playerDeath.start(false, 1000, 10, 10);
    }
}
function restart () {
  player.health = 100;
  score = 0;
  player.weaponLevel = 1;
  game.state.start(game.state.current);
  /*
  blackEnemies.callAll('kill');
    game.time.events.remove(blackEnemyLaunchTimer);
    greenEnemies.callAll('kill');
    blueEnemies.callAll('kill');
    blueEnemyBullets.callAll('kill');
    game.time.events.remove(blueEnemyLaunchTimer);
    game.time.events.remove(greenEnemyLaunchTimer);
    redEnemies.callAll('kill');
    game.time.events.remove(redEnemyLaunchTimer);
    player.weaponLevel = 1;
    player.revive();
    player.health = 100;
    shields.render();
    score = 0;
    scoreText.render();
    gameOver.visible = false;
    greenEnemySpacing = 1000;
    blueEnemyLaunched = false;
    */

}
