var boardLocate = [-25, 1, -50]
var blockSize = 2;
var TICKFORDRAW = 0;

function drawCubeOff(prog, obj, mat, scaleX, scaleY, scaleZ, tex, fbo, type, vpmatrix) {
    var modelMatrix = new Matrix4();
    modelMatrix.multiply(mat);
    modelMatrix.scale(scaleX, scaleY, scaleZ);
    var mvpMatrix = new Matrix4();
    mvpMatrix.set(vpmatrix)
    mvpMatrix.multiply(modelMatrix);
    var eyeLoc;
    if (cameraType == 1) {
        //first person
        eyeLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);

    } else {
        // third person
        eyeLoc = new Vector3([player.locate.x - cameraDirThird.elements[0] * cameraDis,
        player.locate.y + player.height - cameraDirThird.elements[1] * cameraDis,
        player.locate.z - cameraDirThird.elements[2] * cameraDis]);
        // eyeLoc = cameraDirThird * cameraDis;

    }

    var normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.useProgram(prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.uniform3f(prog.u_LightPosition, lightLocate.x, lightLocate.y, lightLocate.z);
    gl.uniform3f(prog.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
    gl.uniform1f(prog.u_Ka, 0.5);
    gl.uniform1f(prog.u_Kd, 0.6);
    gl.uniform1f(prog.u_Ks, 0.3);
    gl.uniform1f(prog.u_shininess, 15.0);//ns
    // gl.uniform1i(program.u_ShadowMap, 0);
    gl.uniform1i(prog.u_Sampler, 1);
    gl.uniformMatrix4fv(prog.u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(prog.u_modelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(prog.u_normalMatrix, false, normalMatrix.elements);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[tex]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, shadowFBO.texture);
    for (let i = 0; i < obj.length; i++) {
        initAttributeVariable(gl, prog.a_Position, obj[i].vertexBuffer);
        initAttributeVariable(gl, prog.a_TexCoord, obj[i].texCoordBuffer);
        initAttributeVariable(gl, prog.a_Normal, obj[i].normalBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    }
    // if (type == 'textureOnscreen') {
    // } else if (type == 'textureOnscreenReflect') {

    //     var normalMatrix = new Matrix4();
    //     normalMatrix.setInverseOf(modelMatrix);
    //     normalMatrix.transpose();
    //     gl.uniform3f(prog.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
    //     gl.uniform3f(prog.u_Color, 0.3, 0.3, 0.7);

    //     gl.uniformMatrix4fv(prog.u_MvpMatrix, false, mvpMatrix.elements);
    //     gl.uniformMatrix4fv(prog.u_modelMatrix, false, modelMatrix.elements);
    //     gl.uniformMatrix4fv(prog.u_normalMatrix, false, normalMatrix.elements);
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, textures[tex]);
    //     // gl.activeTexture(gl.TEXTURE0);
    //     // gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectFBO.texture);
    //     // gl.uniform1i(program.u_envCubeMap, 0);

    //     for (let i = 0; i < obj.length; i++) {
    //         initAttributeVariable(gl, prog.a_Position, obj[i].vertexBuffer);
    //         initAttributeVariable(gl, prog.a_TexCoord, obj[i].texCoordBuffer);
    //         initAttributeVariable(gl, prog.a_Normal, obj[i].normalBuffer);
    //         gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    //     }

    // } else if (type == 'textureOnscreenRefract') {

    //     var normalMatrix = new Matrix4();
    //     normalMatrix.setInverseOf(modelMatrix);
    //     normalMatrix.transpose();
    //     gl.uniform1f(prog.u_Ratio, 1.0 / 1.1);
    //     gl.uniform3f(prog.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
    //     gl.uniform3f(prog.u_Color, 0.7, 0.2, 0.5);

    //     gl.uniformMatrix4fv(prog.u_MvpMatrix, false, mvpMatrix.elements);
    //     gl.uniformMatrix4fv(prog.u_modelMatrix, false, modelMatrix.elements);
    //     gl.uniformMatrix4fv(prog.u_normalMatrix, false, normalMatrix.elements);
    //     gl.activeTexture(gl.TEXTURE0);
    //     gl.bindTexture(gl.TEXTURE_2D, textures[tex]);

    //     for (let i = 0; i < obj.length; i++) {
    //         initAttributeVariable(gl, prog.a_Position, obj[i].vertexBuffer);
    //         initAttributeVariable(gl, prog.a_TexCoord, obj[i].texCoordBuffer);
    //         initAttributeVariable(gl, prog.a_Normal, obj[i].normalBuffer);
    //         gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
    //     }

    // }

}
function drawCube(prog, obj, mat, scaleX, scaleY, scaleZ, tex, fbo, type, mvpFromLight) {
    gl.useProgram(prog);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    var modelMatrix = new Matrix4();
    modelMatrix.multiply(mat);
    modelMatrix.scale(scaleX, scaleY, scaleZ);

    if (type == 'shadow') {
        var mvpFromLight = new Matrix4();
        mvpFromLight.setPerspective(160, offScreenWidth / offScreenHeight, 1, 2000);
        mvpFromLight.lookAt(lightLocate.x, lightLocate.y, lightLocate.z, 0, 0, -1 + 0.05, 0, 1, 0);
        mvpFromLight.multiply(modelMatrix);
        gl.uniformMatrix4fv(shadowProgram.u_MvpMatrix, false, mvpFromLight.elements);
        for (let i = 0; i < obj.length; i++) {
            initAttributeVariable(gl, shadowProgram.a_Position, obj[i].vertexBuffer);
            gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
        }
        return mvpFromLight;
    } else if (type == 'textureOnscreen') {
        var mvpMatrix = new Matrix4();
        mvpMatrix.setPerspective(30, 1, 1, 1000)
        var eyeLoc, centerLoc;
        if (cameraType == 1) {
            //first person
            eyeLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
            centerLoc = new Vector3([player.locate.x + cameraDirFirst.elements[0], player.locate.y + player.height + cameraDirFirst.elements[1], player.locate.z + cameraDirFirst.elements[2]]);
        } else {
            // third person
            eyeLoc = new Vector3([player.locate.x - cameraDirThird.elements[0] * cameraDis,
            player.locate.y + player.height - cameraDirThird.elements[1] * cameraDis,
            player.locate.z - cameraDirThird.elements[2] * cameraDis]);
            // eyeLoc = cameraDirThird * cameraDis;
            centerLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
        }
        mvpMatrix.lookAt(eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2], centerLoc.elements[0], centerLoc.elements[1], centerLoc.elements[2], 0, 1, 0)
        mvpMatrix.multiply(modelMatrix);


        var normalMatrix = new Matrix4();
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniform3f(prog.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
        if (tex == 'moon') {

            gl.uniform1f(prog.u_Ka, 0.5882)
            gl.uniform1f(prog.u_Kd, 0.5882)
            gl.uniform1f(prog.u_Ks, 0.00)
            gl.uniform1f(prog.u_shininess, 10.0);//ns
        } else {
            gl.uniform1f(prog.u_Ka, 0.5);
            gl.uniform1f(prog.u_Kd, 0.6);
            gl.uniform1f(prog.u_Ks, 0.3);
            gl.uniform1f(prog.u_shininess, 15.0);//ns

        }
        // gl.uniform1i(program.u_ShadowMap, 0);
        gl.uniform1i(prog.u_Sampler, 1);
        gl.uniformMatrix4fv(prog.u_MvpMatrix, false, mvpMatrix.elements);
        gl.uniformMatrix4fv(prog.u_modelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(prog.u_normalMatrix, false, normalMatrix.elements);
        gl.uniformMatrix4fv(prog.u_MvpMatrixOfLight, false, mvpFromLight.elements);
        gl.activeTexture(gl.TEXTURE1);
        if (tex == 'moon') {
            gl.bindTexture(gl.TEXTURE_2D, textures['moon'])
        } else {
            gl.bindTexture(gl.TEXTURE_2D, textures[tex]);

        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, shadowFBO.texture);
        for (let i = 0; i < obj.length; i++) {
            initAttributeVariable(gl, prog.a_Position, obj[i].vertexBuffer);
            initAttributeVariable(gl, prog.a_TexCoord, obj[i].texCoordBuffer);
            initAttributeVariable(gl, prog.a_Normal, obj[i].normalBuffer);
            gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
        }
    } else if (type == 'textureOnscreenReflect') {
        gl.useProgram(prog);
        var mvpMatrix = new Matrix4();
        mvpMatrix.setPerspective(30, 1, 1, 1000)
        var eyeLoc, centerLoc;
        if (cameraType == 1) {
            //first person
            eyeLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
            centerLoc = new Vector3([player.locate.x + cameraDirFirst.elements[0], player.locate.y + player.height + cameraDirFirst.elements[1], player.locate.z + cameraDirFirst.elements[2]]);
        } else {
            // third person
            eyeLoc = new Vector3([player.locate.x - cameraDirThird.elements[0] * cameraDis,
            player.locate.y + player.height - cameraDirThird.elements[1] * cameraDis,
            player.locate.z - cameraDirThird.elements[2] * cameraDis]);
            // eyeLoc = cameraDirThird * cameraDis;
            centerLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
        }
        mvpMatrix.lookAt(eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2], centerLoc.elements[0], centerLoc.elements[1], centerLoc.elements[2], 0, 1, 0)
        mvpMatrix.multiply(modelMatrix);
        var normalMatrix = new Matrix4();
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniform3f(reflectProgram.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
        gl.uniform3f(reflectProgram.u_Color, 0.3, 0.3, 0.7);


        gl.uniformMatrix4fv(reflectProgram.u_MvpMatrix, false, mvpMatrix.elements);
        gl.uniformMatrix4fv(reflectProgram.u_modelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(reflectProgram.u_normalMatrix, false, normalMatrix.elements);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectFBO.texture);
        gl.uniform1i(reflectProgram.u_envCubeMap, 0);

        for (let i = 0; i < obj.length; i++) {
            initAttributeVariable(gl, reflectProgram.a_Position, obj[i].vertexBuffer);
            initAttributeVariable(gl, reflectProgram.a_Normal, obj[i].normalBuffer);
            gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
        }

    } else if (type == 'textureOnscreenRefract') {
        var mvpMatrix = new Matrix4();
        mvpMatrix.setPerspective(30, 1, 1, 1000)
        var eyeLoc, centerLoc;
        if (cameraType == 1) {
            //first person
            eyeLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
            centerLoc = new Vector3([player.locate.x + cameraDirFirst.elements[0], player.locate.y + player.height + cameraDirFirst.elements[1], player.locate.z + cameraDirFirst.elements[2]]);
        } else {
            // third person
            eyeLoc = new Vector3([player.locate.x - cameraDirThird.elements[0] * cameraDis,
            player.locate.y + player.height - cameraDirThird.elements[1] * cameraDis,
            player.locate.z - cameraDirThird.elements[2] * cameraDis]);
            // eyeLoc = cameraDirThird * cameraDis;
            centerLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
        }
        mvpMatrix.lookAt(eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2], centerLoc.elements[0], centerLoc.elements[1], centerLoc.elements[2], 0, 1, 0)
        mvpMatrix.multiply(modelMatrix);
        var normalMatrix = new Matrix4();
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();

        gl.uniform1f(prog.u_Ratio, 1.0 / 1.1);
        gl.uniform3f(prog.u_ViewPosition, eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2]);
        gl.uniform3f(prog.u_Color, 0.67, 0.90, 0.83);

        gl.uniformMatrix4fv(prog.u_MvpMatrix, false, mvpMatrix.elements);
        gl.uniformMatrix4fv(prog.u_modelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(prog.u_normalMatrix, false, normalMatrix.elements);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, reflectFBO.texture);
        gl.uniform1i(prog.u_envCubeMap, 0);

        for (let i = 0; i < obj.length; i++) {
            initAttributeVariable(gl, prog.a_Position, obj[i].vertexBuffer);
            initAttributeVariable(gl, prog.a_Normal, obj[i].normalBuffer);
            gl.drawArrays(gl.TRIANGLES, 0, obj[i].numVertices);
        }

    }

}
function drawShadow() {
    gl.useProgram(shadowProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO);
    gl.viewport(0, 0, offScreenWidth, offScreenHeight);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    mvpFL = []
    var modelMatrix = new Matrix4();
    //ball for light
    modelMatrix.setTranslate(lightLocate.x, lightLocate.y, lightLocate.z);
    modelMatrix.scale(0.5, 0.5, 0.5)

    var mvpFromLightFloor = new Matrix4();
    mvpFromLightFloor.setPerspective(160, offScreenWidth / offScreenHeight, 1, 2000);
    mvpFromLightFloor.lookAt(lightLocate.x, lightLocate.y, lightLocate.z, 0, 0, -1 + 0.05, 0, 1, 0);
    mvpFromLightFloor.multiply(modelMatrix);
    mvpFL.push(mvpFromLightFloor)

    // drawCube(program, sphereObj, modelMatrix, 0.1, 0.1, 0.1, 'quartz', null, 'textureOnscreen', mvpFL[cnt++])

    //floor
    for (var i = -200; i <= 200; i += 25) {
        for (var j = -200; j <= 200; j += 25) {

            // modelMatrix.setTranslate()
            modelMatrix.setTranslate(i, -5, j);
            // modelMatrix.setTranslate(0, -5, 0);
            modelMatrix.scale(25, 0.1, 25)
            mvpFromLightFloor.setPerspective(160, offScreenWidth / offScreenHeight, 1, 2000);
            mvpFromLightFloor.lookAt(lightLocate.x, lightLocate.y, lightLocate.z, 0, 0, -1 + 0.05, 0, 1, 0);
            mvpFromLightFloor.multiply(modelMatrix);
            mvpFL.push(mvpFromLightFloor)
            // drawCube(program, cubeObj, modelMatrix, 10, 0.1, 10, 'grass', null, 'textureOnscreen', mvpFL[cnt++])
        }
    }
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])
    for (var i = -1; i <= boardSize[0]; ++i) {//-1~25, board is 0~24
        for (var j = 3; j <= boardSize[1]; ++j) {
            if (i == -1 || i == boardSize[0] || j == 3 || j == boardSize[1]) {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);
                mvpFL.push(drawCube(shadowProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, "stone", shadowFBO, 'shadow'))
            }
        }

    }
    for (var i = 0; i < boardSize[0]; ++i) {//-1~25, board is 0~24
        for (var j = 4; j < boardSize[1]; ++j) {
            if (board[i][j] != '-') {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);

                mvpFL.push(drawCube(shadowProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i, j).texture, shadowFBO, 'shadow'));
            }
        }

    }
    var nowSpeed = Math.max(1, Math.floor((softDrop ? 0.1 : 1) * LEVELSPEED[nowLevel > 19 ? 19 : nowLevel]));

    for (var i = 0; i < 4; ++i) {
        let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
        let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1]
        if (dy < 4) continue
        var nowMat = new Matrix4();
        var delta = 0;
        if (view() > 0) {
            delta = (TICKFORDRAW % nowSpeed) / nowSpeed
        }
        nowMat.multiply(modelMatrix);
        nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1 - delta) * blockSize, 0);
        mvpFL.push(drawCube(shadowProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, shadowFBO, 'shadow'));
    }

    // frame for next block
    for (var i = -1; i < 5; ++i) {
        for (var j = -1; j < 5; ++j) {
            if (i == -1 || j == -1 || i == 4 || j == 4) {
                modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                modelMatrix.translate(boardSize[0] * blockSize, (boardSize[1] - 2) * blockSize, 0)
                modelMatrix.translate((i + 2) * blockSize, -(j + 2.5) * blockSize, 0)
                mvpFL.push(drawCube(shadowProgram, cubeObj, modelMatrix, blockSize / 2, blockSize / 2, blockSize / 2, 'obsidien', shadowFBO, 'shadow'));
            }
        }
    }
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
    modelMatrix.translate((boardSize[0] + 2) * blockSize, (boardSize[1] - 4.5) * blockSize, 0)
    if (holdBlock != '-') {

        for (var i = 0; i < 4; ++i) {
            let dx = blockData[holdBlock][0][i][0]
            let dy = blockData[holdBlock][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4(); 1
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (- dy) * blockSize, 0);
            mvpFL.push(drawCube(shadowProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, blockData[holdBlock].texture, shadowFBO, 'shadow'));

        }
    }
    //player
    modelMatrix.setTranslate(player.locate.x, player.locate.y, player.locate.z)
    modelMatrix.rotate(facing, 0, -1, 0)
    mvpFL.push(drawCube(shadowProgram, creeperObj, modelMatrix, 5, 5, 5, 'creeper', shadowFBO, 'shadow'))

    var havePreview = document.getElementById("preview");
    if (havePreview.checked) {

        var offset = view();
        modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])
        for (var i = 0; i < 4; ++i) {
            let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
            let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1] + offset
            if (dy < 4) continue
            var checkdup = false
            for (var j = 0; j < 4; ++j) {
                let realx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
                let realy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1]
                if (dx == realx && dy == realy) {
                    checkdup = true;
                    break;
                }
            }
            if (checkdup) {
                continue
            }
            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1) * blockSize, 0);
            nowMat.scale(blockSize / 2, blockSize / 2, blockSize / 2)
            var mvpFromLight = new Matrix4();
            mvpFromLight.setPerspective(160, offScreenWidth / offScreenHeight, 1, 2000);
            mvpFromLight.lookAt(lightLocate.x, lightLocate.y, lightLocate.z, 0, 0, -1 + 0.05, 0, 1, 0);
            mvpFromLight.multiply(nowMat);
            mvpFL.push(mvpFromLight)
            // drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, 'concrete', 'textureOnscreen', mvpFL[cnt++]);

        }
    }
    scaleSight = boardSize[1] * blockSize
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] - 20 * blockSize)
    mvpFL.push(drawCube(shadowProgram, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'front', shadowFBO, 'shadow'));
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] + 100 * blockSize)
    mvpFL.push(drawCube(shadowProgram, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'back', shadowFBO, 'shadow'));

    modelMatrix.setIdentity();
    for (var c = 0; c < 5; ++c) {
        for (var i = -1; i < 5; ++i) {
            for (var j = -1; j < 5; ++j) {
                if (i == -1 || j == -1 || i == 4 || j == 4) {
                    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                    modelMatrix.translate(-blockSize - 6 * blockSize / 2, (boardSize[1] - 2 - 0.5) * blockSize, 0)
                    modelMatrix.translate((i + 1) * blockSize / 2, -(j + 2.5 + c * 5) * blockSize / 2, 0)
                    mvpFL.push(drawCube(shadowProgram, cubeObj, modelMatrix, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, 'nextblock', shadowFBO, 'shadow'));

                }
            }
        }
        //draw this next

        modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
        modelMatrix.translate(-blockSize - 5 * blockSize / 2, (boardSize[1] - 4) * blockSize + blockSize / 4.0, 0)
        for (var i = 0; i < 4; ++i) {
            // console.log(blockData[holdBlock][0][i])
            let dx = blockData[queueBlock[c]][0][i][0]
            let dy = blockData[queueBlock[c]][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize / 2, (- dy - 5 * c) * blockSize / 2, 0);

            mvpFL.push(drawCube(shadowProgram, cubeObj, nowMat, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, blockData[queueBlock[c]].texture, shadowFBO, 'shadow'));


        }
    }
    // modelMatrix.setIdentity()
    // modelMatrix.rotate(moonAngle.locate, 0, 0, 1)
    // modelMatrix.translate(200, 0, 0)
    // modelMatrix.rotate(moonAngle.facing, 1, 0, 0)
    // mvpFL.push(drawCube(shadowProgram, moonObj, modelMatrix, 0.1, 0.1, 0.1, 'moon', shadowFBO, 'shadow'));
    gl.viewport(0, 0, canvas.width, canvas.height);
}
function drawEnvCube() {
    var vpMatrix = new Matrix4();
    vpMatrix.setPerspective(60, 1, 1, 15)
    var eyeLoc, centerLoc;
    if (cameraType == 1) {
        //first person
        eyeLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
        centerLoc = new Vector3([player.locate.x + cameraDirFirst.elements[0], player.locate.y + player.height + cameraDirFirst.elements[1], player.locate.z + cameraDirFirst.elements[2]]);
    } else {
        // third person
        eyeLoc = new Vector3([player.locate.x - cameraDirThird.elements[0] * cameraDis,
        player.locate.y + player.height - cameraDirThird.elements[1] * cameraDis,
        player.locate.z - cameraDirThird.elements[2] * cameraDis]);
        // eyeLoc = cameraDirThird * cameraDis;
        centerLoc = new Vector3([player.locate.x, player.locate.y + player.height, player.locate.z]);
    }
    var viewMatrixRotationOnly = new Matrix4();
    viewMatrixRotationOnly.lookAt(eyeLoc.elements[0], eyeLoc.elements[1], eyeLoc.elements[2], centerLoc.elements[0], centerLoc.elements[1], centerLoc.elements[2], 0, 1, 0)
    viewMatrixRotationOnly.elements[12] = 0; //ignore translation
    viewMatrixRotationOnly.elements[13] = 0;
    viewMatrixRotationOnly.elements[14] = 0;
    vpMatrix.multiply(viewMatrixRotationOnly);
    var vpFromCameraInverse = vpMatrix.invert();
    gl.useProgram(programEnvCube);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.depthFunc(gl.LEQUAL);
    gl.uniformMatrix4fv(programEnvCube.u_viewDirectionProjectionInverse,
        false, vpFromCameraInverse.elements);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTex);
    gl.uniform1i(programEnvCube.u_envCubeMap, 0);
    initAttributeVariable(gl, programEnvCube.a_Position, quadObj.vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, quadObj.numVertices);
}
function renderCubeMap(x, y, z) {
    //camera 6 direction to render 6 cubemap faces
    var ENV_CUBE_LOOK_DIR = [
        [1.0, 0.0, 0.0],
        [-1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, -1.0, 0.0],
        [0.0, 0.0, 1.0],
        [0.0, 0.0, -1.0]
    ];

    //camera 6 look up vector to render 6 cubemap faces
    var ENV_CUBE_LOOK_UP = [
        [0.0, -1.0, 0.0],
        [0.0, -1.0, 0.0],
        [0.0, 0.0, 1.0],
        [0.0, 0.0, -1.0],
        [0.0, -1.0, 0.0],
        [0.0, -1.0, 0.0]
    ];
    gl.useProgram(program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, reflectFBO);
    gl.viewport(0, 0, offScreenWidth, offScreenHeight);
    gl.clearColor(0.4, 0.4, 0.4, 1);

    for (var side = 0; side < 6; side++) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + side, reflectFBO.texture, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let vpMatrix = new Matrix4();
        vpMatrix.setPerspective(160, 1, 1, 1000);
        vpMatrix.lookAt(x, y, z,
            x + ENV_CUBE_LOOK_DIR[side][0],
            y + ENV_CUBE_LOOK_DIR[side][1],
            z + ENV_CUBE_LOOK_DIR[side][2],
            ENV_CUBE_LOOK_UP[side][0],
            ENV_CUBE_LOOK_UP[side][1],
            ENV_CUBE_LOOK_UP[side][2]);

        drawOffScreen(vpMatrix)
        gl.useProgram(programEnvCube)
        gl.depthFunc(gl.LEQUAL);
        var vpFromCameraInverse = vpMatrix.invert();
        gl.uniformMatrix4fv(programEnvCube.u_viewDirectionProjectionInverse,
            false, vpFromCameraInverse.elements);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTex);
        gl.uniform1i(programEnvCube.u_envCubeMap, 0);
        initAttributeVariable(gl, programEnvCube.a_Position, quadObj.vertexBuffer);
        gl.drawArrays(gl.TRIANGLES, 0, quadObj.numVertices);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
}
function drawOffScreen(vpmatrix) {
    gl.useProgram(reflectProgram);
    gl.enable(gl.DEPTH_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, reflectFBO);
    // drawEnvCube()
    var modelMatrix = new Matrix4();

    modelMatrix.setTranslate(lightLocate.x, lightLocate.y, lightLocate.z);
    drawCubeOff(program, sphereObj, modelMatrix, 0.5, 0.5, 0.5, 'quartz', reflectFBO, 'textureOnscreen', vpmatrix)

    //floor
    for (var i = -200; i <= 200; i += 25) {
        for (var j = -200; j <= 200; j += 25) {

            modelMatrix.setTranslate(i, -5, j);
            drawCubeOff(program, cubeObj, modelMatrix, 25, 0.1, 25, 'grass', reflectFBO, 'textureOnscreen', vpmatrix)
        }
    }
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])

    for (var i = -1; i <= boardSize[0]; ++i) {//-1~25, board is 0~24
        for (var j = 3; j <= boardSize[1]; ++j) {
            if (i == -1 || i == boardSize[0] || j == 3 || j == boardSize[1]) {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);
                drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, "stone", reflectFBO, 'textureOnscreen', vpmatrix)
                // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, "stone", refractFBO, 'textureOnscreen', vpmatrix)
            }
        }

    }
    var haveReflect = document.getElementById("reflect");
    var haveRefract = document.getElementById("refract");
    var havePreview = document.getElementById("preview");
    for (var i = 0; i < boardSize[0]; ++i) {//-1~25, board is 0~24
        for (var j = 4; j < boardSize[1]; ++j) {
            if (board[i][j] != '-') {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);
                if (getDataFromBoard(i, j).reflect) {

                } else if (getDataFromBoard(i, j).refract) {

                } else {
                    drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i, j).texture, reflectFBO, 'textureOnscreen', vpmatrix);
                }
            }
        }

    }
    var nowSpeed = Math.max(1, Math.floor((softDrop ? 0.1 : 1) * LEVELSPEED[nowLevel > 19 ? 19 : nowLevel]));

    for (var i = 0; i < 4; ++i) {
        let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
        let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1]
        if (dy < 4) continue
        var nowMat = new Matrix4();
        var delta = 0;
        if (view() > 0) {
            delta = (TICKFORDRAW % nowSpeed) / nowSpeed
        }
        nowMat.multiply(modelMatrix);
        nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1 - delta) * blockSize, 0);
        if (getData().reflect) {
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i,j).texture, reflectFBO, 'textureOnscreenReflect', vpmatrix);
            // console.log(nowMat.elements)
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, reflectFBO, 'textureOnscreenReflect', vpmatrix);
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, refractFBO, 'textureOnscreenReflect', vpmatrix);
        } else if (getData().refract) {
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, reflectFBO, 'textureOnscreenRefract', vpmatrix);
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, refractFBO, 'textureOnscreenRefract', vpmatrix);
        } else {
            drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, reflectFBO, 'textureOnscreen', vpmatrix);
            // drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, refractFBO, 'textureOnscreen', vpmatrix);
        }

    }
    //frame of next block
    for (var i = -1; i < 5; ++i) {
        for (var j = -1; j < 5; ++j) {
            if (i == -1 || j == -1 || i == 4 || j == 4) {
                modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                modelMatrix.translate(boardSize[0] * blockSize, (boardSize[1] - 2) * blockSize, 0)
                modelMatrix.translate((i + 2) * blockSize, -(j + 2.5) * blockSize, 0)
                drawCubeOff(program, cubeObj, modelMatrix, blockSize / 2, blockSize / 2, blockSize / 2, 'obsidien', reflectFBO, 'textureOnscreen', vpmatrix);

            }
        }
    }
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
    modelMatrix.translate((boardSize[0] + 2) * blockSize, (boardSize[1] - 4.5) * blockSize, 0)
    if (holdBlock != '-') {

        for (var i = 0; i < 4; ++i) {
            let dx = blockData[holdBlock][0][i][0]
            let dy = blockData[holdBlock][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1) * blockSize, 0);
            drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, blockData[holdBlock].texture, reflectFBO, 'textureOnScreen', vpmatrix);

        }
    }
    // player
    modelMatrix.setTranslate(player.locate.x, player.locate.y, player.locate.z)
    modelMatrix.rotate(facing, 0, -1, 0)
    drawCubeOff(program, creeperObj, modelMatrix, 5, 5, 5, 'creeper', reflectFBO, 'textureOnscreen', vpmatrix)
    if (havePreview.checked) {

        var offset = view();
        modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])
        for (var i = 0; i < 4; ++i) {
            let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
            let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1] + offset
            if (dy < 4) continue
            var checkdup = false
            for (var j = 0; j < 4; ++j) {
                let realx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
                let realy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1]
                if (dx == realx && dy == realy) {
                    checkdup = true;
                    break;
                }
            }
            if (checkdup) {
                continue
            }
            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1) * blockSize, 0);

            drawCubeOff(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, 'concrete', reflectFBO, 'textureOnscreen', vpmatrix);

        }
    }
    scaleSight = boardSize[1] * blockSize
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] - 20 * blockSize)
    drawCubeOff(program, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'front', reflectFBO, 'textureOnscreen', vpmatrix);
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] + 100 * blockSize)
    drawCubeOff(program, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'back', reflectFBO, 'textureOnscreen', vpmatrix);

    modelMatrix.setIdentity();
    for (var c = 0; c < 5; ++c) {
        for (var i = -1; i < 5; ++i) {
            for (var j = -1; j < 5; ++j) {
                if (i == -1 || j == -1 || i == 4 || j == 4) {
                    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                    modelMatrix.translate(-blockSize - 6 * blockSize / 2, (boardSize[1] - 2 - 0.5) * blockSize, 0)
                    modelMatrix.translate((i + 1) * blockSize / 2, -(j + 2.5 + c * 5) * blockSize / 2, 0)
                    drawCubeOff(program, cubeObj, modelMatrix, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, 'nextblock', reflectFBO, 'textureOnscreen', vpmatrix);

                }
            }
        }
        //draw this next

        modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
        modelMatrix.translate(-blockSize - 5 * blockSize / 2, (boardSize[1] - 4) * blockSize + blockSize / 4.0, 0)
        for (var i = 0; i < 4; ++i) {
            // console.log(blockData[holdBlock][0][i])
            let dx = blockData[queueBlock[c]][0][i][0]
            let dy = blockData[queueBlock[c]][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize / 2, (- dy - 5 * c) * blockSize / 2, 0);
            if (blockData[queueBlock[c]].reflect) {
            } else if (blockData[queueBlock[c]].refract) {
            } else {
                drawCubeOff(program, cubeObj, nowMat, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, blockData[queueBlock[c]].texture, reflectFBO, 'textureOnscreen', vpmatrix);
            }

        }
    }
    // modelMatrix.setIdentity()
    // modelMatrix.rotate(moonAngle.locate, 0, 0, 1)
    // modelMatrix.translate(200, 0, 0)
    // modelMatrix.rotate(moonAngle.facing, 1, 0, 0)
    // drawCube(program, moonObj, modelMatrix, 0.1, 0.1, 0.1, 'moon', reflectFBO, 'textureOnscreen', vpmatrix);
}
function draw(T) {
    TICKFORDRAW = T;
    gl.useProgram(program)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    drawShadow()
    drawEnvCube();
    var cnt = 0;
    var modelMatrix = new Matrix4();
    //draw light locate
    modelMatrix.setTranslate(lightLocate.x, lightLocate.y, lightLocate.z);
    drawCube(program, sphereObj, modelMatrix, 0.5, 0.5, 0.5, 'quartz', null, 'textureOnscreen', mvpFL[cnt++])
    // draw floor
    // modelMatrix.scale(100, 100, 100)
    for (var i = -200; i <= 200; i += 25) {
        for (var j = -200; j <= 200; j += 25) {

            modelMatrix.setTranslate(i, -5, j);
            drawCube(program, cubeObj, modelMatrix, 25, 0.1, 25, 'grass', null, 'textureOnscreen', mvpFL[cnt++])
        }
    }
    // draw board of game board
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])
    for (var i = -1; i <= boardSize[0]; ++i) {//-1~25, board is 0~24
        for (var j = 3; j <= boardSize[1]; ++j) {
            if (i == -1 || i == boardSize[0] || j == 3 || j == boardSize[1]) {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);
                drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, "stone", null, 'textureOnscreen', mvpFL[cnt++]);
            }
        }

    }
    //draw board
    var haveReflect = document.getElementById("reflect");
    var haveRefract = document.getElementById("refract");
    var havePreview = document.getElementById("preview");

    for (var i = 0; i < boardSize[0]; ++i) {//-1~25, board is 0~24
        // console.log(board[i])
        for (var j = 4; j < boardSize[1]; ++j) {
            if (board[i][j] != '-') {
                var nowMat = new Matrix4();
                nowMat.multiply(modelMatrix);
                nowMat.translate(i * blockSize, (boardSize[1] - j - 1) * blockSize, 0);
                if (getDataFromBoard(i, j).reflect && haveReflect.checked) {
                    let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
                    renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                    drawCube(reflectProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i, j).texture, null, 'textureOnscreenReflect', mvpFL[cnt++]);

                } else if (getDataFromBoard(i, j).refract && haveRefract.checked) {
                    let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
                    renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                    drawCube(refractProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i, j).texture, null, 'textureOnscreenRefract', mvpFL[cnt++]);

                } else {
                    let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
                    // renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                    drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getDataFromBoard(i, j).texture, null, 'textureOnscreen', mvpFL[cnt++]);
                }
            }
        }

    }
    //draw now dropping piece
    var nowSpeed = Math.max(1, Math.floor((softDrop ? 0.1 : 1) * LEVELSPEED[nowLevel > 19 ? 19 : nowLevel]));
    for (var i = 0; i < 4; ++i) {
        let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
        let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1]
        if (dy < 4) continue

        var nowMat = new Matrix4();
        nowMat.multiply(modelMatrix);
        var delta = 0;
        if (view() > 0) {
            delta = (TICKFORDRAW % nowSpeed) / nowSpeed
        }
        nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1 - delta) * blockSize, 0);
        if (getData().reflect && haveReflect.checked) {
            // console.log(nowPiece.type, getData(), getData().texture, getData().reflect, getData().refract)
            let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))

            renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
            drawCube(reflectProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, null, 'textureOnscreenReflect', mvpFL[cnt++]);
        } else if (getData().refract && haveRefract.checked) {
            let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
            renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
            drawCube(refractProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, null, 'textureOnscreenRefract', mvpFL[cnt++]);
        } else {
            drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, getData().texture, null, 'textureOnscreen', mvpFL[cnt++]);
        }

    }
    // draw a quad for holding
    // draw frame
    modelMatrix.setIdentity();
    for (var i = -1; i < 5; ++i) {
        for (var j = -1; j < 5; ++j) {
            if (i == -1 || j == -1 || i == 4 || j == 4) {

                modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                modelMatrix.translate(boardSize[0] * blockSize, (boardSize[1] - 2) * blockSize, 0)
                modelMatrix.translate((i + 2) * blockSize, -(j + 2.5) * blockSize, 0)
                drawCube(program, cubeObj, modelMatrix, blockSize / 2, blockSize / 2, blockSize / 2, 'obsidien', null, 'textureOnscreen', mvpFL[cnt++]);

            }
        }
    }
    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
    modelMatrix.translate((boardSize[0] + 2) * blockSize, (boardSize[1] - 4.5) * blockSize, 0)
    if (holdBlock != '-') {

        for (var i = 0; i < 4; ++i) {
            // console.log(blockData[holdBlock][0][i])
            let dx = blockData[holdBlock][0][i][0]
            let dy = blockData[holdBlock][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (- dy) * blockSize, 0);
            if (blockData[holdBlock].reflect && haveReflect.checked) {
                // console.log(nowPiece.type, blockData[holdBlock], blockData[holdBlock].texture, blockData[holdBlock].reflect, blockData[holdBlock].refract)
                let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))

                renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                drawCube(reflectProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, blockData[holdBlock].texture, null, 'textureOnscreenReflect', mvpFL[cnt++]);
            } else if (blockData[holdBlock].refract && haveRefract.checked) {
                let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
                // renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                // renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                // var locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]));
                renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                drawCube(refractProgram, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, blockData[holdBlock].texture, null, 'textureOnscreenRefract', mvpFL[cnt++]);
            } else {
                drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, blockData[holdBlock].texture, null, 'textureOnscreen', mvpFL[cnt++]);
            }

        }
    }
    //draw player
    if (cameraType == 3) {

        modelMatrix.setTranslate(player.locate.x, player.locate.y, player.locate.z)
        modelMatrix.rotate(facing, 0, -1, 0)
        drawCube(program, creeperObj, modelMatrix, 5, 5, 5, 'creeper', null, 'textureOnscreen', mvpFL[cnt++])
    }
    //draw preview
    if (havePreview.checked) {

        var offset = view();
        // console.log(offset)
        modelMatrix.setTranslate(boardLocate[0], boardLocate[1] + blockSize / 2, boardLocate[2])
        for (var i = 0; i < 4; ++i) {
            let dx = nowPiece.locate[0] + getData()[nowPiece.rotate][i][0]
            let dy = nowPiece.locate[1] + getData()[nowPiece.rotate][i][1] + offset
            if (dy < 4) continue
            var checkdup = false
            // console.log(dx.toString() + ' ' + dy.toString())

            for (var j = 0; j < 4; ++j) {
                let realx = nowPiece.locate[0] + getData()[nowPiece.rotate][j][0]
                let realy = nowPiece.locate[1] + getData()[nowPiece.rotate][j][1]
                // console.log(' ' + realx.toString() + ' ' + realy.toString())
                if (dx == realx && dy == realy) {
                    checkdup = true;
                    break;
                }
            }
            if (checkdup) {
                continue
            }
            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize, (boardSize[1] - dy - 1) * blockSize, 0);

            drawCube(program, cubeObj, nowMat, blockSize / 2, blockSize / 2, blockSize / 2, 'concrete', null, 'textureOnscreen', mvpFL[cnt++]);

        }
    }
    //draw sight on background
    scaleSight = boardSize[1] * blockSize
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] - 20 * blockSize)
    drawCube(program, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'front', null, 'textureOnscreen', mvpFL[cnt++]);
    modelMatrix.setTranslate(boardLocate[0] + boardSize[0] / 2 * blockSize, boardLocate[1] + boardSize[1] / 2 * blockSize, boardLocate[2] + 100 * blockSize)
    drawCube(program, cubeObj, modelMatrix, scaleSight / 2, scaleSight / 2, 0.1, 'back', null, 'textureOnscreen', mvpFL[cnt++]);

    // draw a bar for next 5 block
    //draw a frame
    modelMatrix.setIdentity();
    for (var c = 0; c < 5; ++c) {
        for (var i = -1; i < 5; ++i) {
            for (var j = -1; j < 5; ++j) {
                if (i == -1 || j == -1 || i == 4 || j == 4) {
                    modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
                    modelMatrix.translate(-blockSize - 6 * blockSize / 2, (boardSize[1] - 2 - 0.5) * blockSize, 0)
                    modelMatrix.translate((i + 1) * blockSize / 2, -(j + 2.5 + c * 5) * blockSize / 2, 0)
                    drawCube(program, cubeObj, modelMatrix, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, 'nextblock', null, 'textureOnscreen', mvpFL[cnt++]);

                }
            }
        }
        //draw this next
        modelMatrix.setTranslate(boardLocate[0], boardLocate[1], boardLocate[2])
        modelMatrix.translate(-blockSize - 5 * blockSize / 2, (boardSize[1] - 4) * blockSize + blockSize / 4.0, 0)
        for (var i = 0; i < 4; ++i) {
            // console.log(blockData[holdBlock][0][i])
            let dx = blockData[queueBlock[c]][0][i][0]
            let dy = blockData[queueBlock[c]][0][i][1]
            // if (dy < 4) continue

            var nowMat = new Matrix4();
            nowMat.multiply(modelMatrix);
            nowMat.translate(dx * blockSize / 2, (- dy - 5 * c) * blockSize / 2, 0);
            if (blockData[queueBlock[c]].reflect && haveReflect.checked) {
                let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))

                renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                drawCube(reflectProgram, cubeObj, nowMat, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, blockData[queueBlock[c]].texture, null, 'textureOnscreenReflect', mvpFL[cnt++]);
            } else if (blockData[queueBlock[c]].refract && haveRefract.checked) {
                let locate = nowMat.multiplyVector4(new Vector4([0, 0, 0, 1]))
                renderCubeMap(locate.elements[0], locate.elements[1], locate.elements[2]);
                drawCube(refractProgram, cubeObj, nowMat, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, blockData[queueBlock[c]].texture, null, 'textureOnscreenRefract', mvpFL[cnt++]);
            } else {
                drawCube(program, cubeObj, nowMat, blockSize / 2 / 2, blockSize / 2 / 2, blockSize / 2 / 2, blockData[queueBlock[c]].texture, null, 'textureOnscreen', mvpFL[cnt++]);
            }

        }
    }
    // modelMatrix.setIdentity()
    // modelMatrix.rotate(moonAngle.locate, 0, 0, 1)
    // modelMatrix.translate(200, 0, 0)
    // modelMatrix.rotate(moonAngle.facing, 1, 0, 0)
    // drawCube(program, moonObj, modelMatrix, 1, 1, 1, 'moon', null, 'textureOnscreen', mvpFL[cnt++]);

}