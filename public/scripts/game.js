(function (Phaser) {

    var game = new Phaser.Game(1080, 720, Phaser.AUTO, 'phaser',
            {
                preload: preload, 
                create: create, 
                update: update   
            }
    ); 

    function preload() {
        //Loading player sprite
        game.load.spritesheet('character', 'assets/slimeSheet.png', 32, 32);

        //Loading background and tiles
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('level', 'assets/level.png');

        //Loading music and sounds
        game.load.audio('jump', ['./assets/jump.mp3', './assets/jump.ogg']);
        game.load.audio('music', ['./assets/music.wav', './assets/music.mp3', './assets/music.ogg']);
    }

    var player; // The player-controller sprite
    var facing = "left"; // Which direction the character is facing (default is 'left')
    var hozMove = 115; // The amount to move horizontally
    var vertMove = -170; // The amount to move vertically (when 'jumping')
    var jumpTimer = 0; // The initial value of the timer

    //Start Part 2
    var map;
    var layer;

    function create() {
        game.stage.backgroundColor = '#D3D3D3';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Music
        music = game.add.audio('music');
        music.play('',0,.69,true);        

        //Map and tiles
        map = game.add.tilemap('map'); // 'map' needs to match the Tilemap cache-key
        map.addTilesetImage('level'); // 'map' needs to match the Image cache-key
        map.setCollisionBetween(1, 5);
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        // Create and add a sprite to the game at the position (2*48 x 6 *48)
        // I think he did the multiplications by the dimensions of the sprite
        player = game.add.sprite(7 * 64, 13 * 64, 'character');

        game.physics.enable(player);

        // Set the amount of gravity to apply to the physics body of the 'player' sprite
        player.body.gravity.y = 102;
        player.body.bounce.y = 0.1;

        // Set the camera to follow the 'player'
        game.camera.follow(player);

        //Fullscreen on click
        game.input.onDown.add(go_fullscreen, this);
    }

    function update() {

    	//Collisions
    	game.physics.arcade.collide(player, layer);

        // Reset the x (horizontal) velocity
        player.body.velocity.x = 0;

        // Check if the left arrow key is being pressed
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            // Set the 'player' sprite's x velocity to a negative number:
            //  have it move left on the screen.
            player.body.velocity.x = -hozMove;

            // Check if 'facing' is not "left"
            if (facing !== "left")
            {
                // Set 'facing' to "left"
                facing = "left";
            }
        }
        // Check if the right arrow key is being pressed
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            // Set the 'player' sprite's x velocity to a positive number:
            //  have it move right on the screen.
            player.body.velocity.x = hozMove;

            // Check if 'facing' is not "right"
            if (facing !== "right")
            {
                // Set 'facing' to "right"
                facing = "right";
            }
        }

        // Check if the jumpButton (SPACEBAR) is down AND
        //  if the 'player' physics body is onFloor (touching a tile) AND
        //  if the current game.time is greater than the value of 'jumpTimer'
        //  (Here, we need to make sure the player cannot jump while alreay in the air
        //   AND that jumping takes place while the sprite is colliding with
        //   a tile in order to jump off it.)
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.body.onFloor() && game.time.now > jumpTimer)
        {
            // Set the 'player' sprite's y velocity to a negative number
            //  (vertMove is -90) and thus have it move up on the screen.
            var snd = game.add.audio('jump');
            snd.play();
            player.body.velocity.y = vertMove;
            // Add 650 and the current time together and set that value to 'jumpTimer'
            // (The 'jumpTimer' is how long in milliseconds between jumps.
            //   Here, that is 650 ms.)
            jumpTimer = game.time.now + 650;
        }

        // Check if 'facing' is "left"
        if (facing === "left") {
            // Set the 'player' to the second (1) frame
            //  ('facing' is "left")
            player.frame = 1;
        } else {
            // Set the 'player' to the first (0) frame
            //  ('facing' is "right").
            player.frame = 0;
        }

    }

function go_fullscreen(){
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.startFullScreen();
}

}(Phaser));