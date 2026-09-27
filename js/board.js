class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.locked_cells = Array.from({ length: BOARD_GRID_H }, () => Array(BOARD_GRID_W).fill({filled: false, col: null}));
        this.dropping_piece = new Piece(PIECE_TYPE.LINE, 3, 0, 0);

        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];

        this.gravity_timer = 0;

        this.level = 1;
    }

    update() {
        if (this.dropping_piece.y === 16) {
            const col = this.dropping_piece.col();
            for (var cell of this.dropping_piece.cells()) {
                this.locked_cells[cell[1]][cell[0]] = {filled: true, col};
            }

            this.dropping_piece.x = 3;
            this.dropping_piece.y = 0;
            this.dropping_piece.rotation = 0;
            const offset = this.dropping_piece.offset();
            this.dropping_piece.x -= offset[0];
            this.dropping_piece.y -= offset[1];
        }

        strokeWeight(3);
        for (var [y, row] of this.locked_cells.entries()) {
            for (var [x, v] of row.entries()) {
                if (v.filled) {
                    fill(v.col[0], v.col[1], v.col[2]);
                    stroke(v.col[0], v.col[1], v.col[2] - 35);
                    rect(x * BOARD_TILE_W, y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
                }
            }
        }

        const piece_col = this.dropping_piece.col();
        const piece_cells = this.dropping_piece.cells();
        
        fill(piece_col[0], piece_col[1], piece_col[2]);
        stroke(piece_col[0], piece_col[1], piece_col[2] - 35);
        for (var cell of piece_cells) {
            rect(cell[0] * BOARD_TILE_W, cell[1] * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
        }

        if (this.gravity_timer >= gravity_timer(this.level)) {
            this.gravity_timer = -1;
            this.move_down();
        }
        this.gravity_timer ++;
    }

    rotate_left() {
        this.dropping_piece.rotation --;
        if (this.dropping_piece.rotation < 0) {
            this.dropping_piece.rotation += 4;
        }
    }

    rotate_right() {
        this.dropping_piece.rotation ++;
        if (this.dropping_piece.rotation >= 4) {
            this.dropping_piece.rotation -= 4;
        }
    }

    move_left() {
        if (this.dropping_piece.x <= -4) return;
        this.dropping_piece.x --;
    }

    move_right() {
        if (this.dropping_piece.x >= BOARD_GRID_W) return;
        this.dropping_piece.x ++;
    }

    move_down() {
        if (this.dropping_piece.y >= BOARD_GRID_H) return;
        this.dropping_piece.y ++;
    }
}