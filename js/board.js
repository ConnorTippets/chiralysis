class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.locked_cells = Array.from({ length: BOARD_GRID_H }, () => Array(BOARD_GRID_W).fill({filled: false, col: null}));
        this.dropping_piece = new Piece(PIECE_TYPE.LINE, 3, 0, 0);

        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];

        this.drop_timer = 0;

        this.level = 1;
    }

    update() {
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
        const piece_col = this.dropping_piece.col();
        const piece_cells = this.dropping_piece.cells();
        
        fill(piece_col[0], piece_col[1], piece_col[2]);
        stroke(piece_col[0], piece_col[1], piece_col[2] - 35);
        for (var cell of piece_cells) {
            rect(cell[0] * BOARD_TILE_W, cell[1] * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
        }

        if (this.drop_timer >= gravity_timer(this.level)) {
            this.drop_timer = -1;
            this.dropping_piece.y += 1;
        }
        this.drop_timer += 1;
    }

    rotate_left() {
        this.dropping_piece.rotation -= 1;
        if (this.dropping_piece.rotation < 0) {
            this.dropping_piece.rotation += 4;
        }
    }

    rotate_right() {
        this.dropping_piece.rotation += 1;
        if (this.dropping_piece.rotation >= 4) {
            this.dropping_piece.rotation -= 4;
        }
    }

    move_left() {
        if (this.dropping_piece.x <= 0) return;
        this.dropping_piece.x -= 1;
    }

    move_right() {
        if (this.dropping_piece.x >= BOARD_GRID_W) return;
        this.dropping_piece.x += 1;
    }
}