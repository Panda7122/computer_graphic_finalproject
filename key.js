var mouseLastX = 0, mouseLastY = 0, mouseDragging = false
var angleX = 0, angleY = 45;
var facing = 0;
var cameraDis = 10;
var cameraType = 3;
var cameraDirThird = new Vector4([0, 1, 1, 1]); //normalize vector
var cameraDirFirst = new Vector4([0, 0, 1, 1]);
player = {};

var press = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'up': false,
    'down': false,
    'left': false,
    'right': false,
    'c': false,
    'z': false,
    'space': false,
    'shift': false,
    'flyup': false,
    'flydown': false,
    'ctrl': false

};
function mouseDown(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        mouseLastX = x;
        mouseLastY = y;
        mouseDragging = true;
    }
}

function mouseUp(ev) {
    mouseDragging = false;
}

function mouseMove(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    if (mouseDragging) {
        // console.log(x, y)
        var factor = 100 / canvas.height; //100 determine the spped you rotate the object
        var dx = factor * (x - mouseLastX);
        var dy = factor * (y - mouseLastY);

        angleX += dx; //yes, x for y, y for x, this is right
        // if (angleY * 20 < 90)
        var rotate = new Matrix4()
        rotate.setIdentity()
        rotate.rotate(angleX * 5, 0, -1, 0);
        // facing += dx * 5;
        if (cameraType == 1) {
            if (angleY + dy * 5 < 90 && angleY + dy * 5 > -90)
                angleY += dy * 5;
            rotate.rotate(angleY, 1, 0, 0);
        } else {
            if (angleY + dy * 5 < 90 && angleY + dy * 5 > -90)
                angleY += dy * 5;
            rotate.rotate(angleY, 1, 0, 0);
        }
        if (angleX > 360) angleX -= 360;
        // if (angleY > 360) angleY -= 360;
        // console.log(angleY)
        cameraDirFirst = rotate.multiplyVector4(new Vector4([0, 0, 1, 1]))
        // console.log(cameraDirFirst.elements)
        cameraDirThird = rotate.multiplyVector4(new Vector4([0, 0, 1, 1]))
        // if (cameraType == 1) {
        // } else {

        // }
    }
    mouseLastX = x;
    mouseLastY = y;
    // console.log(angleX, angleY)

}

function scroll(ev) {
    // console.log(ev.wheelDelta)
    if (cameraType == 3) {
        if (ev.wheelDelta < 0) {
            cameraDis += 10
            // ++cameradis;
        } else {
            cameraDis -= 10
            // --cameradis;
        }
    }
}
function keyDown(ev) {
    switch (ev.key) {
        case 'w':
        case 'W':
            // console.log('Press W')
            press.w = true
            break;
        case 'a':
        case 'A':
        case 'a':
        case 'A':
            // console.log('Press A')
            press.a = true;
            break;
        case 's':
        case 'S':
            // console.log('Press S')
            press.s = true;
            break;
        case 'd':
        case 'D':
            // console.log('Press D')
            press.d = true;
            break;
        case 'ArrowUp':
            // console.log('Press up')
            press.up = true;
            break;
        case 'ArrowDown':
            // console.log('Press down')
            press.down = true;
            break;
        case 'ArrowLeft':
            // console.log('Press left')
            press.left = true;
            break;
        case 'ArrowRight':
            // console.log('Press right')
            press.right = true;
            break;
        case 'c':
        case 'C':
            // console.log('Press C')
            press.c = true;
            break;
        case 'z':
        case 'Z':
            // console.log('Press Z')
            press.z = true;
            break;
        case ' ':
            // console.log('Press Space')
            press.space = true;
            break;
        case 'F':
        case 'f':
            // console.log('Press F');
            cameraType = 4 - cameraType
            var person = document.getElementById("person");
            person.type = 'text'
            if (cameraType == 1) {
                person.innerHTML = 'FIRST PERSON'
                //switch to first person
                cameraDis = 100;
                angleX = 180;
                angleY = 0;
                cameraDirThird = new Vector4([0, 1, 1, 1]);
            } else {
                //switch to third person
                person.innerHTML = 'THIRD PERSON'
                cameraDirFirst = new Vector4([0, 0, 1, 1]);
                angleX = 0;
                angleY = 45;
            }
            break;
        case 'r':
        case 'R':
            if (gameover) {
                initGame()
            }
            break
        case 'Shift':
            // console.log('Press Shift')
            press.shift = true;
            break;
        case 'Ctrl':
            // console.log('Press Ctrl')
            press.ctrl = true;
            break;
        case '+':
            // console.log('add level')
            ++nowLevel
            break;
        case '-':
            if (nowLevel) {
                // console.log('add level')
                --nowLevel
            }
            break;
        case 'p':
        case 'P':
            pause = !pause
            break;
        case '/':
            press.flyup = true;
            break;
        case '*':
            press.flydown = true;
            break;
    }
}
function keyUp(ev) {
    switch (ev.key) {
        case 'w':
        case 'W':
            // console.log('Release W')
            press.w = false;
            break;
        case 'a':
        case 'A':
            press.a = false;
            // console.log('Release A')
            break;
        case 's':
        case 'S':
            press.s = false;
            // console.log('Release S')
            break;
        case 'd':
        case 'D':
            press.d = false;
            // console.log('Release D')
            break;
        case 'ArrowUp':
            press.up = false;
            // console.log('Release up')
            break;
        case 'ArrowDown':
            press.down = false;
            // console.log('Release down')
            break;
        case 'ArrowLeft':
            press.left = false;
            // console.log('Release left')
            break;
        case 'ArrowRight':
            press.right = false;
            // console.log('Release right')
            break;
        case 'c':
        case 'C':
            press.c = false;
            // console.log('Release C')
            break;
        case 'z':
        case 'Z':
            press.z = false;
            // console.log('Release Z')
            break;
        case ' ':
            press.space = false;
            // console.log('Release Space')
            break;
        case 'Shift':
            // console.log('Press Shift')
            press.shift = false;
            break;
        case 'Ctrl':
            // console.log('Press Ctrl')
            press.ctrl = false;
            break;
        case '/':
            press.flyup = false;
            break;
        case '*':
            press.flydown = false;
            break;
    }
}