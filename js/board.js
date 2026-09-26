class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.locked_cells = Array.from({ length: BOARD_GRID_H }, () => Array(BOARD_GRID_W).fill({filled: false, col: null}));
        this.pieces = [new Piece(PIECE_TYPE.LINE, 3, 0, 0)];

        for (var piece of this.pieces) {
            const offset = piece.offset();
            piece.x -= offset[0];
            piece.y -= offset[1];
        }
    }

    draw() {
        colorMode(HSB);
        noFill();
        strokeWeight(2);
        stroke(0, 0, 100);
        for (var [y, row] of this.locked_cells.entries()) {
            for (var [x, v] of row.entries()) {
                if (v.filled) {
                    rect(x * BOARD_TILE_W, y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
                }
            }
        }

        strokeWeight(3);
        for (var piece of this.pieces) {
            const col = piece.col();
            const cells = piece.cells();
            
            fill(col[0], col[1], col[2]);
            stroke(col[0], col[1], col[2] - 35);
            for (var cell of cells) {
                rect(cell[0] * BOARD_TILE_W, cell[1] * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
            }
        }
    }
}