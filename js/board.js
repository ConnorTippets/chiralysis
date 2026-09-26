class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.locked_pieces = Array.from({ length: BOARD_GRID_H }, () => Array(BOARD_GRID_W).fill({filled: false, col: null}));
    }

    draw() {
        noFill();
        strokeWeight(2);
        stroke(255, 255, 255);
        for (var [y, row] of this.locked_pieces.entries()) {
            for (var [x, v] of row.entries()) {
                rect(x * BOARD_TILE_W, y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
            }
        }
    }
}