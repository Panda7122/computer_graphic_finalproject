function isTspin() {
    var c = 0;
    var mini = 0;
    if (nowPiece.type != 'T') return 0;
    for (var dx = 0; dx <= 2; dx += 2) {
        for (var dy = 0; dy <= 2; dy += 2) {
            if (nowPiece.locate[0] + dx >= boardSize[0]
                || nowPiece.locate[0] + dx < 0) {
                ++c;
            } else if (nowPiece.locate[1] + dy >= boardSize[1]
                || nowPiece.locate[1] + dy < 0) {
                ++c;
            } else if (board[nowPiece.locate[0] + dx][nowPiece.locate[1] + dy] != '-') {
                ++c

            }
        }
    }

    var dx1, dx2, dy1, dy2, dx, dy;
    switch (nowPiece.rotate) {
        case 0:
            dx = 1;
            dy = 0;
            dx1 = -1;
            dy1 = 0;
            dx2 = 1;
            dy2 = 0;
            break;
        case 1:
            dx = 2;
            dy = 1;
            dx1 = 0;
            dy1 = -1;
            dx2 = 0;
            dy2 = 1;
            break;
        case 2:
            dx = 1;
            dy = 2;
            dx1 = -1;
            dy1 = 0;
            dx2 = 1;
            dy2 = 0;
            break;
        case 3:
            dx = 0;
            dy = 1;
            dx1 = 0;
            dy1 = -1;
            dx2 = 0;
            dy2 = 1;
            break;
    }
    if (nowPiece.locate[1] + dy + (dy1) > 24 || nowPiece.locate[1] + dy + (dy1) < 0)
        ++mini;
    else if (nowPiece.locate[0] + dx + dx1 > 9 || nowPiece.locate[0] + dx + dx1 < 0)
        ++mini;
    else if (board[nowPiece.locate[0] + dx + dx1][nowPiece.locate[1] + dy + (dy1)])
        ++mini;
    if (nowPiece.locate[1] + dy + (dy2) > 24 || nowPiece.locate[1] + dy + (dy2) < 0)
        ++mini;
    else if (nowPiece.locate[0] + dx + dx2 > 9 || nowPiece.locate[0] + dx + dx2 < 0)
        ++mini;
    else if (board[nowPiece.locate[0] + dx + dx2][nowPiece.locate[1] + dy + (dy2)])
        ++mini;
    if (mini < 2 && c >= 3 && lastRotateType != 5 && lastRotateType)
        return -1;
    return (c >= 3 && lastRotateType > 0) ? 1 : 0;
}
function updateBoard() {
    var check = 0;
    var cnt = 0;
    for (var i = 0; i < boardSize[1]; ++i) {
        check = 1;
        for (var j = 0; j < boardSize[0]; ++j) {
            if (board[j][i] == '-') {
                check = 0;
                break;
            }
        }
        if (check) {
            for (var k = i; k > 0; --k) {
                for (var j = 0; j < boardSize[0]; ++j) {
                    board[j][k] = board[j][k - 1];
                }
            }
            ++cnt;
        }
    }
    return cnt;
}
function holdB() {
    let temp = holdBlock;
    holdBlock = nowPiece.type;
    nowPiece.type = temp;
    nowPiece.locate[0] = startLocate[0];
    nowPiece.locate[1] = startLocate[1];
    if (nowPiece.type == '-') {
        getNewBlockFromQueue();
    }
    lastRotateType = 0;
    nowPiece.rotate = 0;
}
function getData() {
    var nowData = undefined;
    switch (nowPiece.type) {
        case 'O':
            nowData = blockData.O
            break;
        case 'I':
            nowData = blockData.I
            break;
        case 'J':
            nowData = blockData.J
            break;
        case 'L':
            nowData = blockData.L
            break;
        case 'S':
            nowData = blockData.S
            break;
        case 'Z':
            nowData = blockData.Z
            break;
        case 'T':
            nowData = blockData.T
            break;
    }
    return nowData
}
function getDataFromBoard(i, j) {
    var nowData = undefined;
    switch (board[i][j]) {
        case 'O':
            nowData = blockData.O
            break;
        case 'I':
            nowData = blockData.I
            break;
        case 'J':
            nowData = blockData.J
            break;
        case 'L':
            nowData = blockData.L
            break;
        case 'S':
            nowData = blockData.S
            break;
        case 'Z':
            nowData = blockData.Z
            break;
        case 'T':
            nowData = blockData.T
            break;
    }
    return nowData
}
function checkGameover() {
    var nowData = getData()[nowPiece.rotate];

    for (var i = 0; i < 4; ++i) {
        if (board[nowPiece.locate[0] + nowData[i][0]][nowPiece.locate[1] + nowData[i][1]] != '-') {
            gameover = 1;
            return;
        }

    }
}
function testMove(dx, dy) {
    var nowData = getData()[nowPiece.rotate];
    for (var i = 0; i < 4; ++i) {
        var nowx = nowPiece.locate[0] + nowData[i][0] + dx
        var nowy = nowPiece.locate[1] + nowData[i][1] + dy
        if (nowy >= boardSize[1] || nowy < 0) {
            return 0;
        }
        if (nowx >= boardSize[0] || nowx < 0) {
            return 0;
        }
        if (board[nowx][nowy] != '-') return 0;

    }
    return 1;
}
function view() {
    for (var i = nowPiece.locate[1]; i < 25; ++i) {
        if (!testMove(0, i - nowPiece.locate[1])) {
            return i - 1 - nowPiece.locate[1];
        }
    }
    return -1;
}
function putBlock() {
    var nowData = getData()[nowPiece.rotate];
    for (var i = 0; i < 4; ++i) {

        board[nowPiece.locate[0] + nowData[i][0]][nowPiece.locate[1] + nowData[i][1]] = nowPiece.type;

    }
}

function rotate(r) {
    var before = nowPiece.rotate;
    nowPiece.rotate = (nowPiece.rotate + r + 4) % 4
    var dx, dy;
    var testdata = []; // Declare the testdata variable before the switch statement
    switch (nowPiece.type) {
        case 'J':
        case 'L':
        case 'S':
        case 'T':
        case 'Z':
            testdata = srsMoveTest[before][nowPiece.rotate].JLSTZ;
            break;
        case 'I':
            testdata = srsMoveTest[before][nowPiece.rotate].I;
            break;
        case 'O':
            return;
    }
    for (var i = 0; i < 5; ++i) {
        dx = testdata[i][0]
        dy = testdata[i][1]
        if (testMove(dx, dy)) {
            nowPiece.locate[0] += dx
            nowPiece.locate[1] += dy
            lastRotateType = i + 1
            return;
        }
    }
    nowPiece.rotate = before;
    return;
}
function boardClear() {
    for (var i = 0; i < boardSize[0]; ++i) {
        for (var j = 0; j < boardSize[1]; ++j) {
            if (board[i][j] != '-') return false;
        }
    }
    return true;
}
function updateScore(cline, tspin) {
    var thisatk = 0;
    var thisB2B = b2b;
    if (cline && boardClear()) thisatk += 20;
    if (tspin == 1 && nowPiece.type == 'T') {
        thisatk += (b2b + 2) * cline;//tspin
        if (cline) b2b = 1;
    } else if (tspin == -1 && nowPiece.type == 'T') {
        thisatk += (b2b + 1) * cline;//mini tspin
        if (cline) b2b = 1;
    } else {
        if (cline == 4) {
            thisatk += (b2b * 2) + 4
            b2b = 1;
        } else if (cline) {
            thisatk += cline - 1;
            b2b = 0;
        }
    }
    if (cline) {
        if (combo > 7) {
            thisatk += 4
        } else {
            thisatk += Math.floor((combo - 1) / 2) + 1
        }
    }
    if (!cline) {
        combo = 0;
    } else {
        combo++;
    }
    atk += thisatk
    score += SCORE_LINE[cline] * (nowLevel + 1);
    totalLine += cline
    levelLine += cline
    if (levelLine >= [LEVELUP[nowLevel > 19 ? 19 : nowLevel]]) {
        ++nowLevel
        levelLine = 0;
    }
    atkdiv = document.getElementById('attack')
    atkdiv.type = "text";
    atkdiv.innerHTML = "ATK:" + atk.toString()
    scorediv = document.getElementById('score')
    scorediv.type = "text";
    scorediv.innerHTML = "SCORE:" + score.toString()
    leveldiv = document.getElementById('level')
    leveldiv.type = "text";
    leveldiv.innerHTML = "LEVEL:" + nowLevel.toString()
    infodiv = document.getElementById('info')
    infodiv.type = "text";
    var nowInfo = ""
    nowInfo += "this time attack:" + thisatk.toString() + "<br>"
    if (combo > 0)
        nowInfo += combo.toString() + "COMBO"
    if (combo > 1)
        nowInfo += "S"
    nowInfo += '<br>'
    if (thisB2B && (cline == 4 || tspin)) {
        nowInfo += "back to back<br>"
    }
    if (cline == 4)
        nowInfo += "TETRIS!<br>"
    else if (tspin) {
        if (cline == 3) {
            nowInfo += "T-Spin Triple!<br>"
        } else if (cline == 2) {
            nowInfo += "T-Spin Double!<br>"
        } else if (cline == 1) {
            if (tspin < 0) {
                nowInfo += "T-Spin mini!<br>"

            } else {
                nowInfo += "T-Spin Single!<br>"

            }
        }
    }
    if (cline && boardClear()) {
        nowInfo += "PERFECT CLEAR!<br>"
    }

    infodiv.innerHTML = nowInfo

}
function moveBlock(dx, dy) {
    if (testMove(dx, 0)) {
        if (dx) lastRotateType = 0;
        nowPiece.locate[0] += dx;
    }
    if (testMove(0, dy)) {
        if (dy) lastRotateType = 0;
        nowPiece.locate[1] += dy;
    } else {
        putBlock();
        hold = false
        var tspin = isTspin()
        var clearLine = updateBoard();
        updateScore(clearLine, tspin);
        hold = false;

        getNewBlockFromQueue()
        checkGameover()
    }
}
function hardDrop() {
    moveBlock(0, view());
    var nowData = getData()[nowPiece.rotate];
    for (var i = 0; i < 4; ++i) {

        board[nowPiece.locate[0] + nowData[i][0]][nowPiece.locate[1] + nowData[i][1]] = nowPiece.type;

    }
    var tspin = isTspin();
    var clearLine = updateBoard();
    updateScore(clearLine, tspin);
    hold = false;
    getNewBlockFromQueue()
    checkGameover()
}
function gameLogic(T) {
    if (gameover) return
    if (press.space) {
        pressHD = 1
    }
    if (press.up) {
        pressUP = 1
    }
    if (press.z) {
        pressZ = 1
    }
    if (!press.space && pressHD) {
        hardDrop()
        // console.log('HD')
        pressHD = 0;
    }
    if (press.c && !hold) {
        hold = 1;
        // console.log('HOLD')
        holdB()
    }
    if (!press.up && pressUP) {
        pressUP = 0;
        // console.log('Rotate clockwise')
        rotate(1)
    }
    if (!press.z && pressZ) {
        pressZ = 0;

        // console.log('Rotate anti-clockwise')
        rotate(-1)
    }
    if (press.down) {
        // if (softDrop == false)
        //     console.log('SD')
        softDrop = true
    } else {
        // if (softDrop == true)
        //     console.log('not SD')
        softDrop = false
    }
    if (T % 2 == 0) {
        if (press.left) {
            // console.log('LEFT')
            moveBlock(-1, 0)
        }
        if (press.right) {
            // console.log('RIGHT')
            moveBlock(1, 0)
        }
    }
    if (T % Math.max(1, Math.floor((softDrop ? 0.1 : 1) * LEVELSPEED[nowLevel > 19 ? 19 : nowLevel])) == 0) { // per LEVELSPEED[nowLevel] frame, down 1 block, if softdrop, double speed
        moveBlock(0, 1);
    }
}