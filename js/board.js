class Board {
    constructor() {
        this.locked_cells = [];
        this.dropping_piece = new Piece(random_piece_type(), 3, 0, 0);

        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];

        this.gravity_timer = 0;

        this.level = 1;

        this.held = null;
        this.has_swapped = false;
    }

    update() {
        strokeWeight(2);
        for (var cell of this.locked_cells) {
            fill(cell.col[0], cell.col[1], cell.col[2]);
            stroke(cell.col[0], cell.col[1], cell.col[2] - 35);
            rect(cell.x * BOARD_TILE_W + SIDEBAR_PIXELS + 1, cell.y * BOARD_TILE_H + 1, BOARD_TILE_W - 2, BOARD_TILE_H - 2);
        }

        const piece_col = this.dropping_piece.col();
        const piece_cells = this.dropping_piece.cells();
        
        fill(piece_col[0], piece_col[1], piece_col[2]);
        stroke(piece_col[0], piece_col[1], piece_col[2] - 15);
        for (var cell of piece_cells) {
            rect(cell[0] * BOARD_TILE_W + SIDEBAR_PIXELS + 1, cell[1] * BOARD_TILE_H + 1, BOARD_TILE_W - 2, BOARD_TILE_H - 2);
        }

        noFill();
        for (var cell of this.get_ghost_cells()) {
            rect(cell[0] * BOARD_TILE_W + SIDEBAR_PIXELS + 1, cell[1] * BOARD_TILE_H + 1, BOARD_TILE_W - 2, BOARD_TILE_H - 2);
        }

        if (this.gravity_timer >= gravity_timer(this.level)) {
            this.gravity_timer = -1;
            this.move_down();
        }
        this.gravity_timer ++;

        image(nav_elements_img, 0, 0);

        if (this.held) {
            const held_col = this.held.col();
            var held_cells = PIECES[this.held.type].cells[this.held.rotation];
            const held_offset = this.held.offset();

            held_cells = held_cells.map((c) => [(c[0] - held_offset[0]) * BOARD_TILE_W + 60, (c[1] - held_offset[1]) * BOARD_TILE_H + 130]);

            fill(held_col[0], held_col[1], held_col[2]);
            stroke(held_col[0], held_col[1], held_col[2] - 15);
            for (var cell of held_cells) {
                rect(cell[0], cell[1], BOARD_TILE_W, BOARD_TILE_H);
            }
        }
    }

    // TODO: implement srs system
    rotate_left() {
        var old_rot = this.dropping_piece.rotation;
        this.dropping_piece.rotation --;
        if (this.dropping_piece.rotation < 0) {
            this.dropping_piece.rotation += 4;
        }

        if (this.check_collisions()) this.dropping_piece.rotation = old_rot;
    }

    rotate_right() {
        var old_rot = this.dropping_piece.rotation;
        this.dropping_piece.rotation ++;
        if (this.dropping_piece.rotation >= 4) {
            this.dropping_piece.rotation -= 4;
        }

        if (this.check_collisions()) this.dropping_piece.rotation = old_rot;
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
            this.has_swapped = false;
            this.lock_piece();
            this.clear_lines();
            this.spawn_new_piece();
        }
    }

    hard_drop() {
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;

        while (!this.check_collisions()) this.dropping_piece.y ++;
        this.dropping_piece.y --;
        this.has_swapped = false;
        this.lock_piece();
        this.clear_lines();
        this.spawn_new_piece();
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
        this.dropping_piece.type = random_piece_type();
        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];
    }

    clear_lines() {
        var occupied = new Set(this.locked_cells.map(c => `${c.x},${c.y}`));
        var lines_cleared = [];
        
        for (var line = 19; line >= 0; line --) {
            var line_is_complete = true;
            for (var x = 0; x < 10; x ++) {
                if (!occupied.has(`${x},${line}`)) {
                    line_is_complete = false;
                    break;
                }
            }

            if (line_is_complete) {
                lines_cleared.push(line);
                for (var i = this.locked_cells.length - 1; i >= 0; i --) {
                    if (this.locked_cells[i].y === line) {
                        this.locked_cells.splice(i, 1);
                    }
                }
            }
        }

        lines_cleared.sort((a, b) => a - b);
        this.locked_cells.sort((a, b) => a.y - b.y);

        for (var line of lines_cleared) {
            for (var cell of this.locked_cells) {
                if (cell.y < line) cell.y ++;
            }
        }
    }

    get_ghost_cells() {
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;

        var saved_y = this.dropping_piece.y;
        while (!this.check_collisions()) this.dropping_piece.y ++;
        this.dropping_piece.y --;
        
        var cells = this.dropping_piece.cells();
        this.dropping_piece.y = saved_y;
        return cells;
    }

    hold() {
        if (this.has_swapped) return;
        this.has_swapped = true;

        var swapped_out = null;
        if (this.held) swapped_out = cloneInstance(this.held);

        this.held = cloneInstance(this.dropping_piece);
        this.held.rotation = 0;

        if (swapped_out) {
            this.dropping_piece = swapped_out;
            this.dropping_piece.x = 3;
            this.dropping_piece.y = 0;
            const offset = this.dropping_piece.offset();
            this.dropping_piece.x -= offset[0];
            this.dropping_piece.y -= offset[1];
        } else {
            this.spawn_new_piece();
        }

    }
}