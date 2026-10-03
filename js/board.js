STATE = {
    PLAY: 0,
    GAMEOVER: 1,
}

class Board {
    constructor() {
        this.restart();
    }

    update() {
        if (this.state === STATE.PLAY && this.should_flip === true) {
            this.should_flip = false;

            for (var cell of this.locked_cells) {
                cell.y = 19 - cell.y;
            }

            this.direction *= -1;
        }

        strokeWeight(3);
        for (var cell of this.locked_cells) {
            fill(cell.col[0], cell.col[1], cell.col[2]);
            stroke(0, 0, 0);
            rect(cell.x * BOARD_TILE_W + SIDEBAR_PIXELS, cell.y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
        }

        const piece_col = this.dropping_piece.col();
        const piece_cells = this.dropping_piece.cells();
        
        const ghost = this.get_ghost_cells();

        stroke(0, 0, 0);
        if (ghost) {
            fill(piece_col[0], 50, 100);
            for (var cell of ghost) {
                rect(cell[0] * BOARD_TILE_W + SIDEBAR_PIXELS, cell[1] * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
            }
        }

        fill(piece_col[0], piece_col[1], piece_col[2]);
        for (var cell of piece_cells) {
            rect(cell[0] * BOARD_TILE_W + SIDEBAR_PIXELS, cell[1] * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H);
        }

        if (this.state === STATE.PLAY) {
            if (this.gravity_timer >= gravity_timer(this.level)) {
                this.gravity_timer = -1;
                this.move_down();
            }
            this.gravity_timer ++;
        }

        image(nav_elements_img, 0, 0);

        if (this.held) {
            const held_col = this.held.col();
            var held_cells = PIECES[this.held.type].cells[this.held.rotation];
            const held_offset = this.held.offset();

            held_cells = held_cells.map((c) => [(c[0] - held_offset[0]) * BOARD_TILE_W + 60, (c[1] - held_offset[1]) * BOARD_TILE_H + 130]);

            fill(held_col[0], held_col[1], held_col[2]);
            stroke(0, 0, 0);
            for (var cell of held_cells) {
                rect(cell[0], cell[1], BOARD_TILE_W, BOARD_TILE_H);
            }
        }

        for (var [i, piece] of this.piece_sequence.entries()) {
            const next_piece_col = piece.col();
            var next_piece_cells = PIECES[piece.type].cells[piece.rotation];
            const next_piece_offset = piece.offset();

            next_piece_cells = next_piece_cells.map((c) => [(c[0] - next_piece_offset[0]) * BOARD_TILE_W + 60 + SIDEBAR_PIXELS + BOARD_SIZE_W, (c[1] - next_piece_offset[1]) * BOARD_TILE_H + 115 + i * 115])
        
            fill(next_piece_col[0], next_piece_col[1], next_piece_col[2]);
            stroke(0, 0, 0);
            for (var cell of next_piece_cells) {
                rect(cell[0], cell[1], BOARD_TILE_W, BOARD_TILE_H);
            }
        }

        textSize(64);
        textFont('Arial Black');
        fill(0, 0, 0);
        noStroke();
        text(this.lines, 125, 725);
        text(this.level, 125, 575);
        text(this.score, 125, 420);
    }

    // TODO: implement srs system
    rotate_left() {
        if (!this.state === STATE.PLAY) return;
        var old_rot = this.dropping_piece.rotation;
        this.dropping_piece.rotation --;
        if (this.dropping_piece.rotation < 0) {
            this.dropping_piece.rotation += 4;
        }

        if (this.check_collisions()) this.dropping_piece.rotation = old_rot;
    }

    rotate_right() {
        if (!this.state === STATE.PLAY) return;
        var old_rot = this.dropping_piece.rotation;
        this.dropping_piece.rotation ++;
        if (this.dropping_piece.rotation >= 4) {
            this.dropping_piece.rotation -= 4;
        }

        if (this.check_collisions()) this.dropping_piece.rotation = old_rot;
    }

    move_left() {
        if (!this.state === STATE.PLAY) return;
        if (this.check_collisions()) return;
        if (this.dropping_piece.x <= -4) return;
        this.dropping_piece.x --;

        if (this.check_collisions()) {
            this.dropping_piece.x ++;
        }
    }

    move_right() {
        if (!this.state === STATE.PLAY) return;
        if (this.check_collisions()) return;
        if (this.dropping_piece.x >= BOARD_GRID_W) return;
        this.dropping_piece.x ++;

        if (this.check_collisions()) {
            this.dropping_piece.x --;
        }
    }

    // TODO: determine if dropped piece counts as t-spin, add points accordingly

    move_down(soft_drop) {
        if (!this.state === STATE.PLAY) return;
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;
        this.dropping_piece.y += this.direction;

        if (this.check_collisions()) {
            this.dropping_piece.y -= this.direction;
            this.has_swapped = false;
            this.lock_piece();
            this.clear_lines();
            this.spawn_new_piece();
        } else if (soft_drop) {
            this.score += this.level;
        }
    }

    hard_drop() {
        if (!this.state === STATE.PLAY) return;
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;

        var orig_y = this.dropping_piece.y;

        while (!this.check_collisions()) this.dropping_piece.y += this.direction;
        this.dropping_piece.y -= this.direction;
        this.score += Math.abs(this.dropping_piece.y - orig_y) * this.level;
        this.has_swapped = false;
        this.lock_piece();
        this.clear_lines();
        this.spawn_new_piece();
    }

    check_collisions() {
        for (var piece_cell of this.dropping_piece.cells()) {
            if (piece_cell[0] <= -1 || piece_cell[0] >= 10) return true;
            if (piece_cell[1] <= -1 || piece_cell[1] >= 20) return true;

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

    respawn_piece() {
        this.dropping_piece.x = 3;

        if (this.should_flip) {
            if (this.direction === 1) this.dropping_piece.y = 17;
            else this.dropping_piece.y = 0;
        } else {
            if (this.direction === 1) this.dropping_piece.y = 0;
            else this.dropping_piece.y = 17;
        }

        this.dropping_piece.rotation = 0;
        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];
    }

    spawn_new_piece() {
        this.dropping_piece = this.piece_sequence.splice(0, 1)[0];
        this.piece_sequence.push(new Piece(random_piece_type(), 3, 0, 0));
        this.respawn_piece();

        if (!this.should_flip && this.check_collisions()) {
            this.state = STATE.GAMEOVER;
        }
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
                this.lines++;
                if (this.lines % 10 === 0) this.level ++;
                if (this.lines % 5 === 0) this.should_flip = true;

                lines_cleared.push(line);
                for (var i = this.locked_cells.length - 1; i >= 0; i --) {
                    if (this.locked_cells[i].y === line) {
                        this.locked_cells.splice(i, 1);
                    }
                }
            }
        }

        if (!lines_cleared.length) return;

        if (lines_cleared.length === 1) { this.score += 100 * this.level; this.last_was_tetris = false; }
        else if (lines_cleared.length === 2) { this.score += 300 * this.level; this.last_was_tetris = false; }
        else if (lines_cleared.length === 3) { this.score += 500 * this.level; this.last_was_tetris = false; }
        else {
            if (this.last_was_tetris) this.score += 400 * this.level;
            else this.score += 800 * this.level;
            this.last_was_tetris = true;
        }

        if (this.direction === 1) {
            lines_cleared.sort((a, b) => a - b);
            this.locked_cells.sort((a, b) => a.y - b.y);
        } else {
            lines_cleared.sort((a, b) => b - a);
            this.locked_cells.sort((a, b) => b.y - a.y);
        }

        for (var line of lines_cleared) {
            for (var cell of this.locked_cells) {
                if (this.direction == 1) {
                    if (cell.y < line) cell.y ++;
                } else {
                    if (cell.y > line) cell.y --;
                }
            }
        }
    }

    get_ghost_cells() {
        if (this.check_collisions()) return;
        if (this.dropping_piece.y >= BOARD_GRID_H) return;

        var saved_y = this.dropping_piece.y;
        while (!this.check_collisions()) this.dropping_piece.y += this.direction;
        this.dropping_piece.y -= this.direction;;
        
        var cells = this.dropping_piece.cells();
        this.dropping_piece.y = saved_y;
        return cells;
    }

    hold() {
        if (!this.state === STATE.PLAY) return;
        if (this.has_swapped) return;
        this.has_swapped = true;

        var swapped_out = null;
        if (this.held) swapped_out = cloneInstance(this.held);

        this.held = cloneInstance(this.dropping_piece);
        this.held.rotation = 0;

        if (swapped_out) {
            this.dropping_piece = swapped_out;
            this.respawn_piece();
        } else {
            this.spawn_new_piece();
        }

    }

    restart() {
        this.state = STATE.PLAY;
        
        this.locked_cells = [];
        this.dropping_piece = new Piece(random_piece_type(), 3, 0, 0);

        const offset = this.dropping_piece.offset();
        this.dropping_piece.x -= offset[0];
        this.dropping_piece.y -= offset[1];

        this.gravity_timer = 0;

        this.level = 1;

        this.held = null;
        this.has_swapped = false;

        this.lines = 0;

        this.score = 0;

        this.last_was_tetris = false;

        this.should_flip = false;

        this.direction = 1;

        this.piece_sequence = [];
        for (var i = 0; i < 6; i++) {
            this.piece_sequence.push(new Piece(random_piece_type(), 3, 0, 0));
        }
    }
}