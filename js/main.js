function setup() {
    createCanvas(BOARD_SIZE_W, BOARD_SIZE_H);
    colorMode(HSB);

    board = new Board(0, 0);
}

function draw() {
    background(0);

    if (move_delay === -2 && move_timer >= 3) {
        if (keyIsDown(LEFT_ARROW)) board.move_left();
        if (keyIsDown(RIGHT_ARROW)) board.move_right();
        move_timer = 0;
    }

    if (keyIsDown(DOWN_ARROW) && drop_timer >= 3) {
        board.move_down();
        drop_timer = 0;
    }

    noFill();
    strokeWeight(1);
    stroke(0, 0, 14);
    for (var y = 0; y < BOARD_GRID_H; y ++) {
        for (var x = 0; x < BOARD_GRID_W; x ++) {
            rect(x * BOARD_TILE_W, y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H)
        }
    }

    board.update();

    if (move_delay >= 0) move_delay ++;
    if (move_timer >= 0) move_timer ++;
    if (drop_timer >= 0) drop_timer ++;

    if (!(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))) {
        move_delay = -1;
    }
    else if (move_delay >= 8) {
        move_delay = -2;
        move_timer = 0;
    }

    if (!keyIsDown(DOWN_ARROW)) {
        drop_timer = -1;
    }
}

function keyPressed() {
    // When the key is first pressed, the piece instantly moves.
    // Then, after a delay, the piece continues moving.
    if (key === "ArrowLeft") {
        board.move_left();
        move_delay = 0;
    }
    if (key === "ArrowRight") {
        board.move_right();
        move_delay = 0;
    }

    if (key === "ArrowDown") {
        board.move_down();
        drop_timer = 0;
    }

    if (key === " ") board.hard_drop();

    if (key === "Z") board.rotate_left();
    if (key === "ArrowUp") board.rotate_right();
}