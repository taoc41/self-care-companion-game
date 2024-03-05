let chibi, floor, state;

const START = -1;
const IDLE = 0;
const WALKING_LEFT = 1;
const WALKING_RIGHT = 2;
const PICK_UP = 3;
const FALLING = 4;
const STAND = 5;


function setup() {
	createCanvas(750, 500);
	world.gravity.y = 5;
	
	state = START;
	chibi = new Sprite();
	floor = new Sprite(width / 2, height - 20, width, 60, 'static');
	
	loadAnimations();
	setTimeout(rngMovement(), 5000); // ???? how the fuck does this work

	chibi.w = 250;
	chibi.h = 475;
	chibi.scale = 0.5;
	chibi.rotationLock = true;
	chibi.bounciness = 0;
}

//Loads all the animations (I know this is very ineffecient)
function loadAnimations(){
	chibi.addAni('walkLeft_start', 'assets/sprites/sprite_sheets/move.png', 
	{row: 0, frameSize: [500, 500] , frames: 3, frameDelay: 10});

	chibi.addAni('walkLeft', 'assets/sprites/sprite_sheets/move.png', 
	{row: 1, frameSize: [500, 500], frames: 6, frameDelay: 10});

	chibi.addAni('walkRight_start', 'assets/sprites/sprite_sheets/move.png', 
	{row: 2, frameSize: [500, 500] , frames: 3, frameDelay: 10});

	chibi.addAni('walkRight', 'assets/sprites/sprite_sheets/move.png',
	{row: 3, frameSize: [500, 500], frames: 6, frameDelay: 10});

	chibi.addAni('pickUp', 'assets/sprites/sprite_sheets/raise.png',
	{frameSize: [500,500], frames: 22, frameDelay: 10});

	chibi.addAni('fall', 'assets/sprites/sprite_sheets/falling.png',
	{frameSize: [500,500], frames: 6, frameDelay: 10});

	chibi.addAni('stand', 'assets/sprites/sprite_sheets/stand.png', 
	{frameSize: [500, 500], frames: 23, frameDelay: 10});

	chibi.addAni('idle_happy', 'assets/sprites/sprite_sheets/idle_happy.png', 
	{frameSize: [500, 500], frames: 13, frameDelay: 8});
}

function draw() {
	background(255);

	chibiMovement();
	chibiInput();

	chibi.debug = true

}

function chibiMovement(){

	switch (state) {
		case IDLE:
			chibi.changeAni('idle_happy');
			chibi.vel.x = 0;
			break;

		case WALKING_LEFT:
			chibi.changeAni('walkLeft')
			chibi.vel.x = -2
			if (chibi.x < 70) {
				state = IDLE;
			}
			break;

		case WALKING_RIGHT:
			chibi.changeAni('walkRight');
			chibi.vel.x = 2
			if (chibi.x > width - 70) {
				state = IDLE;
			}
			break;
		
		case PICK_UP:
			chibi.changeAni('pickUp');
			chibi.x = mouse.x;
			chibi.y = mouse.y;
			break;

		case FALLING:
			chibi.changeAni('fall');
			chibi.ani.offset.y = 190
			chibi.vel.x = 0;
			chibi.vel.y = 4;
			if (chibi.colliding(floor)) {
				state = STAND;
			}
			break;

		case STAND:
			chibi.changeAni('stand')
			setTimeout(() => {
				state = IDLE;
			}, 3600);
	}
}

function chibiInput(){
	if (chibi.mouse.pressing() >= 15) {
		state = PICK_UP;
		chibi.offset.x = -20;
		chibi.offset.y = 55
	} else if (mouse.released()) {
		state = FALLING;
		chibi.offset.x = 0;
		chibi.offset.y = 0;
	}
}

function rngMovement(){
	if (state === IDLE) {
		if (chibi.x < 100) {
			state = WALKING_RIGHT;
		} else if (chibi.x > width - 100) {
			state = WALKING_LEFT;
		} else {
			state = random([WALKING_LEFT, WALKING_RIGHT]);
		}
	} else if (!mouse.pressing() && state != FALLING && state != STAND) {
		state = IDLE;
	}
	setTimeout(rngMovement, random(1000, 3000));
}
