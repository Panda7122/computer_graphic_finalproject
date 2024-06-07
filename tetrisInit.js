const boardSize = [10, 24]
var board = Array.from({ length: boardSize[0] }, () => Array(boardSize[1]).fill('-'));
const blockData = {
    'O': {
        0: [[1, 0], [2, 0], [1, 1], [2, 1]],
        1: [[1, 0], [2, 0], [1, 1], [2, 1]],
        2: [[1, 0], [2, 0], [1, 1], [2, 1]],
        3: [[1, 0], [2, 0], [1, 1], [2, 1]],
        'texture': 'sand',
        'reflect': false,
        'refract': false
    },
    'I': {
        0: [[0, 1], [1, 1], [2, 1], [3, 1]],
        1: [[2, 0], [2, 1], [2, 2], [2, 3]],
        2: [[0, 2], [1, 2], [2, 2], [3, 2]],
        3: [[1, 0], [1, 1], [1, 2], [1, 3]],
        'texture': 'snow',
        'reflect': true,
        'refract': false
    },
    'J': {
        0: [[0, 0], [0, 1], [1, 1], [2, 1]],
        1: [[1, 0], [1, 1], [1, 2], [2, 0]],
        2: [[2, 2], [0, 1], [1, 1], [2, 1]],
        3: [[1, 0], [1, 1], [1, 2], [0, 2]],
        'texture': 'planks',
        'reflect': false,
        'refract': false
    },
    'L': {
        0: [[2, 0], [0, 1], [1, 1], [2, 1]],
        1: [[1, 0], [1, 1], [1, 2], [2, 2]],
        2: [[0, 2], [0, 1], [1, 1], [2, 1]],
        3: [[1, 0], [1, 1], [1, 2], [0, 0]],
        'texture': 'planks',
        'reflect': false,
        'refract': false
    },
    'S': {
        0: [[1, 0], [2, 0], [0, 1], [1, 1]],
        1: [[1, 0], [1, 1], [2, 1], [2, 2]],
        2: [[1, 1], [2, 1], [0, 2], [1, 2]],
        3: [[0, 0], [0, 1], [1, 1], [1, 2]],
        'texture': 'brick',
        'reflect': false,
        'refract': false
    },
    'Z': {
        0: [[0, 0], [1, 0], [1, 1], [2, 1]],
        1: [[2, 0], [1, 1], [2, 1], [1, 2]],
        2: [[0, 1], [1, 1], [1, 2], [2, 2]],
        3: [[1, 0], [0, 1], [1, 1], [0, 2]],
        'texture': 'log',
        'reflect': false,
        'refract': false
    },
    'T': {
        0: [[1, 0], [0, 1], [1, 1], [2, 1]],
        1: [[1, 0], [1, 1], [1, 2], [2, 1]],
        2: [[0, 1], [1, 1], [2, 1], [1, 2]],
        3: [[1, 0], [0, 1], [1, 1], [1, 2]],
        'texture': 'dirt',
        'reflect': false,
        'refract': true
    },
}
const srsMoveTest = {
    0: {
        1: {
            'JLSTZ': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
            'I': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]

        },
        3: {
            'JLSTZ': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            'I': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
        }
    },
    1: {
        0: {
            'JLSTZ': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
            'I': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
        },
        2: {
            'JLSTZ': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
            'I': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
        }
    },
    2: {
        1: {
            'JLSTZ': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
            'I': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]

        },
        3: {
            'JLSTZ': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            'I': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
        }
    },
    3: {
        0: {
            'JLSTZ': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            'I': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]

        },
        2: {
            'JLSTZ': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            'I': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]
        }
    }
}
const startLocate = [3, 2]
var nowPiece = { 'locate': [3, 2], 'type': '-', 'rotate': 0 }
var holdBlock = '-'
var hold = false
var queueBlock = []
const LEVELSPEED = [
    48, 43, 38, 33, 28, 23, 18, 13, 8, 6,
    5, 5, 5, 4, 4, 4, 3, 3, 3, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 1
];
const LEVELUP = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    100, 100, 100, 100, 100, 100, 110, 120, 130, 10];
const SCORE_LINE = [0, 40, 100, 300, 1200]
const FPS = 60;
function randomChoiceBlock() {
    var weight = {
        'O': 1.0 / appearTime.O,
        'I': 1.0 / appearTime.I,
        'J': 1.0 / appearTime.J,
        'L': 1.0 / appearTime.L,
        'S': 1.0 / appearTime.S,
        'Z': 1.0 / appearTime.Z,
        'T': 1.0 / appearTime.T
    }
    var totalWeight = Object.values(weight).reduce((sum, value) => sum + value, 0);
    probability = {
        'O': weight.O / totalWeight,
        'I': weight.I / totalWeight,
        'J': weight.J / totalWeight,
        'L': weight.L / totalWeight,
        'S': weight.S / totalWeight,
        'Z': weight.Z / totalWeight,
        'T': weight.T / totalWeight
    }
    probability.I += probability.O
    probability.J += probability.I
    probability.L += probability.J
    probability.S += probability.L
    probability.Z += probability.S
    probability.T = 1.0
    // console.log(appearTime)
    // console.log(probability)
    var c = Math.random()
    if (c < probability.O) {
        return 'O';
    } else if (c <= probability.I) {
        return 'I';
    } else if (c <= probability.J) {
        return 'J';
    } else if (c <= probability.L) {
        return 'L';
    } else if (c <= probability.S) {
        return 'S';
    } else if (c <= probability.Z) {
        return 'Z';
    } else if (c <= probability.T) {
        return 'T';
    }

    switch (c) {
        case 0:
            return 'O';
        case 1:
            return 'I';
        case 2:
            return 'J';
        case 3:
            return 'L';
        case 4:
            return 'S';
        case 5:
            return 'Z';
        case 6:
            return 'T';
    }
}
var softDrop = false
var b2b = 0
var combo = 0
var atk = 0;
var nowLevel = 0;
var score = 0;
var gameover = 0;
var lastRotateType = 0;
var totalLine = 0, levelLine = 0;
var appearTime = {
    'O': 2,
    'I': 2,
    'J': 2,
    'L': 2,
    'S': 2,
    'Z': 2,
    'T': 2
}
function getNewBlockFromQueue() {
    newBlock = randomChoiceBlock();
    appearTime[newBlock]++;
    queueBlock.push(newBlock);
    nowPiece.locate[0] = startLocate[0];
    nowPiece.locate[1] = startLocate[1];
    nowPiece.type = queueBlock.shift();
    // nowPiece.type = 'I';
    nowPiece.rotate = 0;
    lastRotateType = 0;
}
var pressHD = false
var pressUP = false
var pressZ = false
var pause = false
function initGame() {
    board = Array.from({ length: boardSize[0] }, () => Array(boardSize[1]).fill('-'));
    nowPiece = { 'locate': [3, 0], 'type': '-', 'rotate': 0 }
    holdBlock = '-';
    nowLevel = 0;
    score = 0;
    hold = 0;
    b2b = 0;
    atk = 0;
    lastRotateType = 0;
    combo = 0;
    gameover = 0;
    totalLine = 0
    levelLine = 0;
    pressHD = false
    pressUP = false
    pressZ = false
    softDrop = false
    pause = false
    queueBlock = []
    appearTime = {
        'O': 2,
        'I': 2,
        'J': 2,
        'L': 2,
        'S': 2,
        'Z': 2,
        'T': 2
    }
    for (var i = 0; i < 7; ++i) {
        queueBlock.push(['O', 'I', 'J', 'L', 'S', 'Z', 'T'][i % 7]);
    }
    // RandomShuffle
    //0~6
    for (let i = queueBlock.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i - 0 + 1));
        [queueBlock[i], queueBlock[j]] = [queueBlock[j], queueBlock[i]];
    }
    for (var i = 0; i < 7; ++i) {
        queueBlock.push(['O', 'I', 'J', 'L', 'S', 'Z', 'T'][i % 7]);
    }
    // RandomShuffle
    //13~7
    for (let i = queueBlock.length - 1; i >= 7 + 1; i--) {
        //random(0,1)*(max-min+1)+min
        const j = Math.floor(Math.random() * (i - 7 + 1) + 7);
        [queueBlock[i], queueBlock[j]] = [queueBlock[j], queueBlock[i]];
    }
    getNewBlockFromQueue()
}