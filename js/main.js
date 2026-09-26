function setup() {
    createCanvas(BOARD_SIZE_W, BOARD_SIZE_H);

    board = new Board(0, 0);
}

function draw() {
    background(50);

    board.update();
}

function keyPressed() {
    board.dropping_piece.rotate_right();
}