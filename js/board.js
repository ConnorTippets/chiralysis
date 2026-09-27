class Board {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.locked_cells = [];
        this.dropping_piece = new Piece(PIECE_TYPE.LINE, 3, 0, 0);

        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];

        this.gravity_timer = 0;

        this.level = 1;
    }

    update() {
        strokeWeight(3);
        for (var cell of this.locked_cells) {
            fill(cell.col[0], cell.col[1], cell.col[2]);
            stroke(cell.col[0], cell.col[1], cell.col[2] - 35);
            rect(cell.x * BOARD_TILE_W, cell.y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
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
        if (this.check_collisions()) return;
        if (this.dropping_piece.x <= -4) return;
        this.dropping_piece.x --;

        if (this.check_collisions()) {
            this.dropping_piece.x ++;
        }
    }

    move_right() {
        if (this.check_collisions()) return;
        if (this.dropping_piece.x >= BOARD_GRID_W) return;
        this.dropping_piece.x ++;

        if (this.check_collisions()) {
            this.dropping_piece.x --;
        }
    }

    move_down() {
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;
        this.dropping_piece.y ++;

        if (this.check_collisions()) {
            this.dropping_piece.y --;
            this.lock_piece();
            this.spawn_new_piece();
        }
    }

    check_collisions() {
        for (var piece_cell of this.dropping_piece.cells()) {
            if (piece_cell[0] <= -1 || piece_cell[0] >= 10) return true;
            if (piece_cell[0] <= -1 || piece_cell[1] >= 20) return true;

            for (var check_cell of this.locked_cells) {
                if (check_cell.x === piece_cell[0] && check_cell.y === piece_cell[1]) {
                    return true;
                }
            }
        }
        return false;
    }

    lock_piece() {
        const col = this.dropping_piece.col();
        for (var cell of this.dropping_piece.cells()) {
            this.locked_cells.push({x: cell[0], y: cell[1], col});
        }
    }

    spawn_new_piece() {
        this.dropping_piece.x = 3;
        this.dropping_piece.y = 0;
        this.dropping_piece.rotation = 0;
        this.dropping_piece.type = Math.floor(Math.random()*7);
        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];
    }
}