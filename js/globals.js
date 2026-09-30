const BOARD_SIZE_W = 400;
const BOARD_SIZE_H = 800;

const SIDEBAR_PIXELS = 250;

const BOARD_GRID_W = 10;
const BOARD_GRID_H = 20;

const BOARD_TILE_W = BOARD_SIZE_W / BOARD_GRID_W;
const BOARD_TILE_H = BOARD_SIZE_H / BOARD_GRID_H;

const BOARD_X = (SIDEBAR_PIXELS + BOARD_SIZE_W / 2) - (BOARD_GRID_W / 2 * BOARD_TILE_W);

var board;

// Amount of frames before a piece should drop 1 row
function gravity_timer(level) {
    return Math.floor(Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 60);
}

// -1 means neither left/right is pressed
// -2 means left/right is pressed and the delay completed
// [0,16) means we're currently delaying
// Is this stupid? yes
var move_delay = -1;

var move_timer = -1;

var drop_timer = -1;

var nav_elements_img;

function random_piece_type() {
    return Math.floor(Math.random()*7);
}

function cloneInstance(instance) {
    return Object.assign(
        Object.create(Object.getPrototypeOf(instance)), 
        instance
    );
}

const RESTART_BUTTON_L = 334;
const RESTART_BUTTON_T = 480;
const RESTART_BUTTON_W = 228;
const RESTART_BUTTON_H = 70;