var gl, canvas
var shadowFBO, reflectFBO, refractFBO;
var program, shadowProgram, envCubeProgram, reflectProgram, refractProgram
var offScreenWidth = 1024, offScreenHeight = 1024;
function initProgram() {
    program = compileShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
    program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
    program.u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix');
    program.u_normalMatrix = gl.getUniformLocation(program, 'u_normalMatrix');
    program.u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition');
    program.u_ViewPosition = gl.getUniformLocation(program, 'u_ViewPosition');
    program.u_MvpMatrixOfLight = gl.getUniformLocation(program, 'u_MvpMatrixOfLight');
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    program.u_Ka = gl.getUniformLocation(program, 'u_Ka');
    program.u_Kd = gl.getUniformLocation(program, 'u_Kd');
    program.u_Ks = gl.getUniformLocation(program, 'u_Ks');
    program.u_shininess = gl.getUniformLocation(program, 'u_shininess');
    program.u_ShadowMap = gl.getUniformLocation(program, "u_ShadowMap");
    program.u_Color = gl.getUniformLocation(program, 'u_Color');
    program.u_Sampler = gl.getUniformLocation(program, "u_Sampler")

    shadowProgram = compileShader(gl, VSHADER_SHADOW_SOURCE, FSHADER_SHADOW_SOURCE);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');

    programEnvCube = compileShader(gl, VSHADER_SOURCE_ENVCUBE, FSHADER_SOURCE_ENVCUBE);
    programEnvCube.a_Position = gl.getAttribLocation(programEnvCube, 'a_Position');
    programEnvCube.u_envCubeMap = gl.getUniformLocation(programEnvCube, 'u_envCubeMap');
    programEnvCube.u_viewDirectionProjectionInverse =
        gl.getUniformLocation(programEnvCube, 'u_viewDirectionProjectionInverse');

    reflectProgram = compileShader(gl, VSHADER_SOURCE_REFLECT, FSHADER_SOURCE_REFLECT);
    reflectProgram.a_Position = gl.getAttribLocation(reflectProgram, 'a_Position');
    reflectProgram.a_Normal = gl.getAttribLocation(reflectProgram, 'a_Normal');
    reflectProgram.u_MvpMatrix = gl.getUniformLocation(reflectProgram, 'u_MvpMatrix');
    reflectProgram.u_modelMatrix = gl.getUniformLocation(reflectProgram, 'u_modelMatrix');
    reflectProgram.u_normalMatrix = gl.getUniformLocation(reflectProgram, 'u_normalMatrix');
    reflectProgram.u_ViewPosition = gl.getUniformLocation(reflectProgram, 'u_ViewPosition');
    reflectProgram.u_envCubeMap = gl.getUniformLocation(reflectProgram, 'u_envCubeMap');
    reflectProgram.u_Color = gl.getUniformLocation(reflectProgram, 'u_Color');
    reflectProgram.u_LightPosition = gl.getUniformLocation(reflectProgram, 'u_LightPosition');
    reflectProgram.u_MvpMatrixOfLight = gl.getUniformLocation(reflectProgram, 'u_MvpMatrixOfLight');
    reflectProgram.a_TexCoord = gl.getAttribLocation(reflectProgram, 'a_TexCoord');
    reflectProgram.u_Ka = gl.getUniformLocation(reflectProgram, 'u_Ka');
    reflectProgram.u_Kd = gl.getUniformLocation(reflectProgram, 'u_Kd');
    reflectProgram.u_Ks = gl.getUniformLocation(reflectProgram, 'u_Ks');
    reflectProgram.u_shininess = gl.getUniformLocation(reflectProgram, 'u_shininess');
    reflectProgram.u_ShadowMap = gl.getUniformLocation(reflectProgram, "u_ShadowMap");
    reflectProgram.u_Sampler = gl.getUniformLocation(reflectProgram, "u_Sampler")

    refractProgram = compileShader(gl, VSHADER_SOURCE_REFRACT, FSHADER_SOURCE_REFRACT);
    refractProgram.a_Position = gl.getAttribLocation(refractProgram, 'a_Position');
    refractProgram.a_Normal = gl.getAttribLocation(refractProgram, 'a_Normal');
    refractProgram.u_MvpMatrix = gl.getUniformLocation(refractProgram, 'u_MvpMatrix');
    refractProgram.u_modelMatrix = gl.getUniformLocation(refractProgram, 'u_modelMatrix');
    refractProgram.u_normalMatrix = gl.getUniformLocation(refractProgram, 'u_normalMatrix');
    refractProgram.u_ViewPosition = gl.getUniformLocation(refractProgram, 'u_ViewPosition');
    refractProgram.u_envCubeMap = gl.getUniformLocation(refractProgram, 'u_envCubeMap');
    refractProgram.u_Color = gl.getUniformLocation(refractProgram, 'u_Color');
    refractProgram.u_Ratio = gl.getUniformLocation(refractProgram, 'ratio');

}
var nowTick = 0;
var lightLocate = { 'x': 0, 'y': 100, 'z': -75 }
// moonAngle = { 'locate': 0, 'facing': 0 };
async function main() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    initProgram();
    initGame();
    player.locate = { 'x': 0, 'y': 0, 'z': 0 }
    player.height = 10
    angleX = 0
    angleY = 45
    facing = 0

    quadObj = initVertexBufferForLaterUse(gl, quad);//use for env cube
    cubeMapTex = initCubeTexture("./texture/skybox/sky/px.png", "./texture/skybox/sky/nx.png", "./texture/skybox/sky/py.png", "./texture/skybox/sky/ny.png",
        "./texture/skybox/sky/pz.png", "./texture/skybox/sky/nz.png", 900, 900);
    cubeObj = await parseModel('object/cube.obj');
    sphereObj = await parseModel('object/sphere.obj');
    creeperObj = await parseModel('object/creeper.obj');

    onloadTexture("brick", "texture/brick.jpg")
    onloadTexture("quartz", "texture/quartz.jpg")
    onloadTexture("stone", "texture/stone wall 10.png")
    onloadTexture("wood", 'texture/wood floor 2.png')
    onloadTexture("planks", 'texture/planks.png')
    onloadTexture("dirt", 'texture/ground.jpg')
    onloadTexture("sand", 'texture/sand 1.png')
    onloadTexture("log", 'texture/log.jpg')
    onloadTexture("snow", 'texture/snow 1.png')
    onloadTexture("grass", 'texture/grass2.png')
    onloadTexture("creeper", 'texture/creeper.png')
    onloadTexture("concrete", 'texture/concrete.jpg')
    onloadTexture("back", 'texture/puyotetris.jpg')
    onloadTexture("front", 'texture/heart.jpg')
    onloadTexture("nextblock", 'texture/stone-wall.jpg')
    onloadTexture("obsidien", 'texture/obsidien.jpg')
    shadowFBO = initFrameBuffer(gl);
    reflectFBO = initFrameBufferForCubemapRendering(gl);
    refractFBO = initFrameBufferForCubemapRendering(gl);

    canvas.onmousedown = function (ev) { mouseDown(ev) };
    canvas.onmousemove = function (ev) { mouseMove(ev) };
    canvas.onmouseup = function (ev) { mouseUp(ev) };
    canvas.onwheel = function (ev) { scroll(ev) };
    document.addEventListener('keydown', function (ev) { keyDown(ev) });
    document.addEventListener('keyup', function (ev) { keyUp(ev) });

    let prev = Date.now();

    var tick = function () {
        const now = Date.now();
        console.log(1000 / (now - prev));
        prev = now;
        // if (now < prev + (1000 / 30)) {
        //     requestAnimationFrame(tick);
        //     return;
        // }
        // prev = now;
        // if (!pause) {

        //     moonAngle.locate += Math.random() * 0.1 + 0.1
        //     if (moonAngle.locate > 360) moonAngle.locate -= 360
        //     moonAngle.facing += Math.random() * 0.1 + 0.1
        //     if (moonAngle.facing > 360) moonAngle.facing -= 360
        // }
        // newoffScreenWidth = document.getElementById('offscreenwidth').value
        // newoffScreenHeight = document.getElementById('offscreenheight').value
        // if (!isNaN(parseInt(newoffScreenWidth))) {
        //     offScreenWidth = parseInt(newoffScreenWidth);
        //     shadowFBO = initFrameBuffer(gl);
        //     reflectFBO = initFrameBufferForCubemapRendering(gl);
        //     refractFBO = initFrameBufferForCubemapRendering(gl);
        // }
        // if (!isNaN(parseInt(newoffScreenHeight))) {
        //     offScreenHeight = parseInt(newoffScreenHeight);

        // }
        if (!pause) {
            ++nowTick;
        }
        if (nowTick % Math.floor((FPS / 30)) == 0) {// down speed to 30FPS
            if (!pause) {
                gameLogic(nowTick / Math.floor((FPS / 30)))
            }
        }
        var rotate = new Matrix4()
        // var view = new Vector4([0, 0, 1, 0])
        rotate.setIdentity()
        rotate.rotate(90, 0, -1, 0);
        // rotate.rotate(angleY, 1, 0, 0);
        var coord = cameraDirFirst.elements
        let dis = Math.sqrt(coord[0] * coord[0] + coord[1] * coord[1] + coord[2] * coord[2])
        let tmpdis = Math.sqrt(coord[0] * coord[0] + coord[2] * coord[2])
        let scaleDis = dis / tmpdis
        facing = Math.atan2(coord[2], coord[0]) * (180.0 / Math.PI) - 90
        // console.log(facing)
        if (press.w) {
            player.locate.x += cameraDirFirst.elements[0] * scaleDis * (press.shift ? 0.5 : 1) * (press.ctrl ? 2 : 1)
            player.locate.z += cameraDirFirst.elements[2] * scaleDis * (press.shift ? 0.5 : 1) * (press.ctrl ? 2 : 1)
        }
        if (press.s) {
            player.locate.x -= cameraDirFirst.elements[0] * scaleDis * (press.shift ? 0.5 : 1) * (press.ctrl ? 2 : 1)
            player.locate.z -= cameraDirFirst.elements[2] * scaleDis * (press.shift ? 0.5 : 1) * (press.ctrl ? 2 : 1)
        }
        var vec = rotate.multiplyVector4(cameraDirFirst);
        if (press.a) {
            player.locate.x -= vec.elements[0] * scaleDis * (press.shift ? 0.5 : 1)
            player.locate.z -= vec.elements[2] * scaleDis * (press.shift ? 0.5 : 1)
        }
        if (press.d) {
            player.locate.x += vec.elements[0] * scaleDis * (press.shift ? 0.5 : 1)
            player.locate.z += vec.elements[2] * scaleDis * (press.shift ? 0.5 : 1)
        }
        if (press.flyup) {
            player.height++;
        }
        if (press.flydown) {
            if (player.height > 0)
                player.height--;
        }
        draw(Math.floor(nowTick / Math.floor((FPS / 30))));
        requestAnimationFrame(tick);
    }
    tick();
    // draw();

}