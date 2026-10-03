async function setup() {
    createCanvas(BOARD_SIZE_W + SIDEBAR_PIXELS * 2, BOARD_SIZE_H);
    colorMode(HSB);
    textAlign(CENTER, CENTER);

    nav_elements_img = await loadImage("../assets/nav_elements.png", (img) => {return img;});

    board = new Board();
}

function draw() {
    background(0, 0, 100);

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
    stroke(0, 0, 90);
    for (var y = 0; y < BOARD_GRID_H; y ++) {
        for (var x = 0; x < BOARD_GRID_W; x ++) {
            rect(x * BOARD_TILE_W + SIDEBAR_PIXELS, y * BOARD_TILE_H, BOARD_TILE_W, BOARD_TILE_H)
        }
    }

    board.update();
    if (board.state === STATE.GAMEOVER) {
        fill(0, 0, 0);
        stroke(0, 0, 100);
        rect(237, 203, 423, 394);

        fill(0, 0, 100);
        textSize(56);
        noStroke();
        text("GAME OVER!", 450, 265);

        textSize(48);
        text("SCORE:", 450, 350);
        text(board.score.toString(), 450, 430);

        fill(100, 100, 28);
        stroke(0, 0, 37);
        rect(RESTART_BUTTON_L, RESTART_BUTTON_T, RESTART_BUTTON_W, RESTART_BUTTON_H);

        fill(0, 0, 100);
        noStroke();
        textSize(32);
        text("RESTART", 450, 515);
    }

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
        board.move_down(true);
        drop_timer = 0;
    }

    if (key === "Z") board.rotate_left();
    if (key === "ArrowUp") board.rotate_right();

    if (key === " ") board.hard_drop();

    if (key === "c") board.hold();
}

function mousePressed() {
    if (board.state === STATE.GAMEOVER) {
        if (mouseX >= RESTART_BUTTON_L && mouseX <= RESTART_BUTTON_L + RESTART_BUTTON_W &&
            mouseY >= RESTART_BUTTON_T && mouseY <= RESTART_BUTTON_T + RESTART_BUTTON_H)
        {
            board.restart();
        }
    }
}