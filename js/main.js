function setup() {
    createCanvas(BOARD_SIZE_W, BOARD_SIZE_H);

    board = new Board(0, 0);
}

function draw() {
    background(50);

    board.update();
}

function keyPressed() {
    if (key === "Z") return board.rotate_left();
    if (key === "ArrowUp") return board.rotate_right();

    keys.push(key);
}

function keyReleased() {
    const index = keys.indexOf(key);
    if (index !== -1) {
        keys.splice(index, 1);
    }
}