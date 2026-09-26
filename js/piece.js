const PIECE_TYPE = {
    LINE: 0,
    SQUARE: 1,
    TBLOCK: 2,
    JBLOCK: 3,
    LBLOCK: 4,
    SBLOCK: 5,
    ZBLOCK: 6
}

// LAYOUT:
// Pieces follow order of PIECE_TYPE

// HSV
const PIECE_COLORS = [
    [185, 100, 98]
]

// Each piece has four elements for the four rotations
// Pieces are defined around one central pivot point, and displaced from there
// First elem is pointing up, rotates right for next elems
// Is this stupid? yes
const PIECES = [
    {
        col: PIECE_COLORS[PIECE_TYPE.LINE],
        cells: [
            [[0, 1], [1, 1], [2, 1], [3, 1]],
            [[2, 0], [2, 1], [2, 2], [2, 3]],
            [[0, 2], [1, 2], [2, 2], [3, 2]],
            [[1, 0], [1, 1], [1, 2], [1, 3]],
        ]
    }
]

// In the PIECES array, pieces are offset a bit per rotation. This corrects that.
const PIECE_OFFSETS = [
    [
        [0, 1],
        [2, 0],
        [0, 2],
        [1, 0]
    ]
]

class Piece {
    constructor(type, x, y, rotation) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    col() {
        return PIECES[this.type].col;
    }

    offset() {
        return PIECE_OFFSETS[this.type][this.rotation];
    }

    cells() {
        const rot = PIECES[this.type].cells[this.rotation];
        return rot.map((pos) => [this.x + pos[0], this.y + pos[1]]);
    }
}