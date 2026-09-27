const PIECE_TYPE = {
    LINE: 0,
    SQUARE: 1,
    TBLOCK: 2,
    SBLOCK: 3,
    ZBLOCK: 4,
    JBLOCK: 5,
    LBLOCK: 6,
}

// LAYOUT:
// Pieces follow order of PIECE_TYPE

// HSV
const PIECE_COLORS = [
    [185, 100, 90],
    [55, 100, 90],
    [290, 100, 90],
    [137, 100, 90],
    [0, 100, 90],
    [206, 100, 90],
    [41, 100, 90]
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
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.SQUARE],
        cells: [
            [[1, 1], [2, 1], [2, 2], [1, 2]],
            [[1, 1], [2, 1], [2, 2], [1, 2]],
            [[1, 1], [2, 1], [2, 2], [1, 2]],
            [[1, 1], [2, 1], [2, 2], [1, 2]],
        ]
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.TBLOCK],
        cells: [
            [[1, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [1, 1], [2, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [1, 2]],
            [[1, 0], [0, 1], [1, 1], [1, 2]],
        ]
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.SBLOCK],
        cells: [
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[1, 0], [1, 1], [2, 1], [2, 2]],
            [[1, 1], [2, 1], [0, 2], [1, 2]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ]
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.ZBLOCK],
        cells: [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[2, 0], [2, 1], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [1, 2], [2, 2]],
            [[1, 0], [1, 1], [0, 1], [0, 2]],
        ]
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.JBLOCK],
        cells: [
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [2, 0], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 1], [2, 2]],
            [[1, 0], [1, 1], [1, 2], [0, 2]],
        ]
    },
    {
        col: PIECE_COLORS[PIECE_TYPE.LBLOCK],
        cells: [
            [[2, 0], [2, 1], [1, 1], [0, 1]],
            [[1, 0], [1, 1], [1, 2], [2, 2]],
            [[0, 1], [0, 2], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
        ]
    },
]

// In the PIECES array, pieces are offset a bit per rotation. This corrects that.
const PIECE_OFFSETS = [
    [
        [0, 1],
        [2, 0],
        [0, 2],
        [1, 0]
    ],
    [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1]
    ],
    [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 0]
    ],
    [
        [0, 0],
        [0, 0],
        [0, 1],
        [0, 0]
    ],
    [
        [0, 0],
        [0, 0],
        [0, 1],
        [0, 0]
    ],
    [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 0]
    ],
    [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 0]
    ],
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