let chibi, floor, state, timeoutID;

const IDLE = 0;
const WALKING_LEFT = 1;
const WALKING_RIGHT = 2;
const PICK_UP = 3;
const FALLING = 4;
const STAND = 5;

function setup() {
	createCanvas(750, 800);
	world.gravity.y = 5;
	
	state = FALLING;
	chibi = new Sprite(width/2, 0 - 100);
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
	console.log(state);
	chibiMovement();
	chibiInput();

	chibi.debug = true

}

function chibiMovement(){
	let FUCK;
	
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
			chibi.vel.y = 6;
			FUCK = null;
			if (chibi.collides(floor)) {
				state = STAND;
			}
			break;

		case STAND:
			chibi.changeAni('stand')
			chibi.ani.play(0)
			resetToIdle(1000);
			break;
	}

	// if (state === STAND) {
	// 	chibi.changeAni('stand');
	// 	chibi.ani.play(0);
	// 	resetToIdle(3650);
	// }
}

function chibiInput(){
	if (chibi.mouse.pressing() >= 12) {
		state = PICK_UP;
		resetTimeout();
		chibi.offset.x = -20;
		chibi.offset.y = 55
	} else if (chibi.mouse.released()) {
		state = FALLING;
		resetTimeout();
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

	sleep(random( 1000, 3000 )).then(() => { rngMovement(); });

}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function resetToIdle(ms) {
	if (!timeoutID) {
		timeoutID = setTimeout(() => {
			state = IDLE
		}, ms);
	}
}

function resetTimeout() {
	clearTimeout(timeoutID);
	timeoutID = null;
}


