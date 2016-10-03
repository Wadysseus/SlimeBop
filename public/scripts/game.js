var game = new Phaser.Game(1080, 720, Phaser.AUTO, '', {    
        preload: preload, 
        create: create, 
        update: update 
});

var cursors;
var facing = "left";
var currentGoo = 4;
var maxGoo = 4; 


function preload() {
    //Loading player sprite
    game.load.spritesheet('player', 'assets/slimeSheet.png', 32, 32);
    game.load.image('gooHeart', 'assets/gooHeart.gif');

    //Loading music and sfx
    game.load.audio('jump', ['assets/jump.mp3', 'assets/jump.ogg']);
    game.load.audio('music', ['assets/music.wav', 'assets/music.mp3', 'assets/music.ogg']);
    
    //Loading other sprites, tiles, bgs
    game.load.image('brick', 'assets/brick.png');
    game.load.spritesheet('grundle', 'assets/grundle.png');
}

function create() {
    game.stage.backgroundColor = "#4488AA";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //music
    music = game.add.audio('music');
    music.play('', 0, .69, true);

    //player
    players = game.add.group();
    players.enableBody = true;
    createPlayer(10, 10, -180, 115);

    //floor
    platforms = game.add.group();
    platforms.enableBody = true;
    createPlatform();
    
    //mobs
    mobs = game.add.group();
    mobs.enableBody = true;
    createMob(400, 10, 'grundle');

    cursors = game.input.keyboard.createCursorKeys();
    game.input.onDown.add(go_fullscreen, this);

    //Life
    gooHearts = game.add.group();
    trackGoo();    
}

function update() {
    playerUpdate();
    // mobWander();
}

function createPlayer(x,y,j,v){
    var player = players.create(x,y, 'player');
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 102;
    player.body.collideWorldBounds = true;

    player.jump = j;
    player.v = v;
}

function playerUpdate(){
    game.physics.arcade.collide(players, players);
    game.physics.arcade.collide(players, platforms);
    game.physics.arcade.collide(players, mobs);
    game.physics.arcade.collide(platforms, mobs);
    //Keep it as 'players' for multiplayer functionality
    players.forEach(function(p){
        p.body.velocity.x = 0;
        if(cursors.left.isDown){
            p.body.velocity.x = -p.v;

            // Check if 'facing' is not "left"
            if (facing !== "left")
            {
                // Set 'facing' to "left"
                facing = "left";
            }
        } else if(cursors.right.isDown){
            p.body.velocity.x = p.v;

            // Check if 'facing' is not "right"
            if (facing !== "right")
            {
                // Set 'facing' to "right"
                facing = "right";
            }
        }

        //jump controls
        if(cursors.up.isDown && p.body.touching.down){
            var snd = game.add.audio('jump');
            snd.play();
            p.body.velocity.y = p.jump;
        }
    });
}

function createPlatform(x,y){
    for (var i = 0;i < game.world.width;i+=64){
        var ground = platforms.create(i, game.world.height - 64, 'brick');
        ground.body.immovable = true;
    }
    
}

function createMob(x, y, mob){
    var mob = mobs.create(x,y, mob);
    mob.body.bounce.y = 0.1;
    mob.body.gravity.y = 102;
    mob.body.collideWorldBounds = true;
    mob.j = -88;
    mob.v = 95;    
    // if (mob === 'grundle'){
    //     j = -88;
    //     v = 95;
    // }
}

function go_fullscreen(){
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.startFullScreen();
}

function trackGoo(x,y){
    var heartWidth = 44;
    for (var i = 5;i < 5 + (heartWidth * currentGoo);i+=heartWidth){
        var life = gooHearts.create(i, 5, 'gooHeart');
    }
}

// function mobWander(){
//     var i = 0;

//     mobs.forEach(mobMove());
// };

// function mobMove(){
//     setInterval(function(mob){
//         mob.body.velocity.x = 0;
//         i++;
//         if (i % 2 == 0){
//             mob.body.velocity.x = -mob.v;
//         } else if (i % 3 == 0){
//             mob.body.velocity.x = mob.v;
//         } else if (i % 5 == 0){
//             mob.body.velocity.y = mob.j;
//         }
//     }, 2000)
// }