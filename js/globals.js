const BOARD_SIZE_W = 400;
const BOARD_SIZE_H = 800;

const BOARD_GRID_W = 10;
const BOARD_GRID_H = 20;

const BOARD_TILE_W = BOARD_SIZE_W / BOARD_GRID_W;
const BOARD_TILE_H = BOARD_SIZE_H / BOARD_GRID_H;

var board;

// Amount of frames before a piece should drop 1 row
function gravity_timer(level) {
    return Math.floor(Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 60);
}