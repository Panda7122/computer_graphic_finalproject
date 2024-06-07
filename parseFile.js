var textures = {};
var texCount = 0;
var numTextures = 1;
async function parseModel(file) {
    try {
        let response = await fetch(file);
        let text = await response.text();
        let obj = parseOBJ(text);
        let O = [];
        for (let i = 0; i < obj.geometries.length; i++) {
            let o = initVertexBufferForLaterUse(gl,
                obj.geometries[i].data.position,
                obj.geometries[i].data.normal,
                obj.geometries[i].data.texcoord);
            O.push(o);
        }
        return O;
    } catch (error) {
        console.error('Error loading model:', error);
        return null;
    }
}
function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];

    // same order as `f` indices
    const objVertexData = [
        objPositions,
        objTexcoords,
        objNormals,
    ];

    // same order as `f` indices
    let webglVertexData = [
        [],   // positions
        [],   // texcoords
        [],   // normals
    ];

    const materialLibs = [];
    const geometries = [];
    let geometry;
    let groups = ['default'];
    let material = 'default';
    let object = 'default';

    const noop = () => { };

    function newGeometry() {
        // If there is an existing geometry and it's
        // not empty then start a new one.
        if (geometry && geometry.data.position.length) {
            geometry = undefined;
        }
    }

    function setGeometry() {
        if (!geometry) {
            const position = [];
            const texcoord = [];
            const normal = [];
            webglVertexData = [
                position,
                texcoord,
                normal,
            ];
            geometry = {
                object,
                groups,
                material,
                data: {
                    position,
                    texcoord,
                    normal,
                },
            };
            geometries.push(geometry);
        }
    }

    function addVertex(vert) {
        const ptn = vert.split('/');
        ptn.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr);
            const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
            webglVertexData[i].push(...objVertexData[i][index]);
        });
    }

    const keywords = {
        v(parts) {
            objPositions.push(parts.map(parseFloat));
        },
        vn(parts) {
            objNormals.push(parts.map(parseFloat));
        },
        vt(parts) {
            // should check for missing v and extra w?
            // console.log(text)
            // if (text == './Coffin.obj')
            //     console.log(parts.map(parseFloat))
            objTexcoords.push(parts.map(parseFloat));
        },
        f(parts) {
            setGeometry();
            const numTriangles = parts.length - 2;
            for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
            }
        },
        s: noop,    // smoothing group
        mtllib(parts, unparsedArgs) {
            // the spec says there can be multiple filenames here
            // but many exist with spaces in a single filename
            materialLibs.push(unparsedArgs);
        },
        usemtl(parts, unparsedArgs) {
            material = unparsedArgs;
            newGeometry();
        },
        g(parts) {
            groups = parts;
            newGeometry();
        },
        o(parts, unparsedArgs) {
            object = unparsedArgs;
            newGeometry();
        },
    };

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
        const line = lines[lineNo].trim();
        if (line === '' || line.startsWith('#')) {
            continue;
        }
        const m = keywordRE.exec(line);
        if (!m) {
            continue;
        }
        const [, keyword, unparsedArgs] = m;
        const parts = line.split(/\s+/).slice(1);
        const handler = keywords[keyword];
        if (!handler) {
            console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
            continue;
        }
        handler(parts, unparsedArgs);
    }

    // remove any arrays that have no entries.
    for (const geometry of geometries) {
        geometry.data = Object.fromEntries(
            Object.entries(geometry.data).filter(([, array]) => array.length > 0));
    }

    return {
        geometries,
        materialLibs,
    };
}
function parseMTL(text) {
    const materials = {};
    let currentMaterial = null;

    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('#') || line === '') {
            continue; // Skip comments and empty lines
        }

        const parts = line.split(/\s+/);
        const keyword = parts[0];

        switch (keyword) {
            case 'newmtl': // New material
                currentMaterial = parts[1];
                materials[currentMaterial] = {
                    Ka: [1, 1, 1], // Ambient color default to white
                    Kd: [1, 1, 1], // Diffuse color default to white
                    Ks: [1, 1, 1], // Specular color default to white
                    Ns: 0,         // Specular exponent default to 0
                    map_Kd: null   // Diffuse texture map
                };
                break;
            case 'Ka': // Ambient color
                materials[currentMaterial].Ka = parts.slice(1).map(Number);
                break;
            case 'Kd': // Diffuse color
                materials[currentMaterial].Kd = parts.slice(1).map(Number);
                break;
            case 'Ks': // Specular color
                materials[currentMaterial].Ks = parts.slice(1).map(Number);
                break;
            case 'Ns': // Specular exponent
                materials[currentMaterial].Ns = parseFloat(parts[1]);
                break;
            case 'map_Kd': // Diffuse texture map
                // Assuming the texture file is directly available or correctly pathed
                materials[currentMaterial].map_Kd = parts[1];
                break;
        }
    }

    return materials;
}
function initTexture(gl, img, texKey) {
    var tex = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    textures[texKey] = tex;

    texCount++;
    //if (texCount == numTextures) draw();
}
function parsetexture(text, mtl) {
    let objCompImgIndex = [];
    const lines = text.split('\n');  // Split the text into lines

    lines.forEach(line => {
        const trimmedLine = line.trim();  // Trim whitespace from the line
        if (trimmedLine.startsWith('usemtl')) {  // Check if the line starts with "usemtl"
            const materialName = trimmedLine.split(' ')[1];  // Extract the material name
            if (mtl[materialName] && mtl[materialName].map_Kd) {
                // Check if the material exists and has a map_Kd property
                objCompImgIndex.push(mtl[materialName].map_Kd);  // Add the map_Kd to the array
            }
            else {
                //show error to the console
                console.error('Material not found:', materialName);
            }
        }
    });

    return objCompImgIndex;  // Return the array containing the map_Kd values
}
function onloadTexture(tex, file) {
    var img = new Image();
    img.onload = function () { initTexture(gl, img, tex); };
    img.src = file;
}

function initCubeTexture(posXName, negXName, posYName, negYName,
    posZName, negZName, imgWidth, imgHeight) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    const faceInfos = [
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            fName: posXName,
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            fName: negXName,
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            fName: posYName,
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            fName: negYName,
        },
        {
            target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            fName: posZName,
        },
        {
            target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            fName: negZName,
        },
    ];
    faceInfos.forEach((faceInfo) => {
        const { target, fName } = faceInfo;
        // setup each face so it's immediately renderable
        gl.texImage2D(target, 0, gl.RGBA, imgWidth, imgHeight, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null);

        var image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        };
        image.src = fName;
    });
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    return texture;
}

async function loadOBJtoCreateVBO(objFile) {
    let objComponents = [];
    response = await fetch(objFile);
    text = await response.text();
    obj = parseOBJ(text);
    for (let i = 0; i < obj.geometries.length; i++) {
        let o = initVertexBufferForLaterUse(gl,
            obj.geometries[i].data.position,
            obj.geometries[i].data.normal,
            obj.geometries[i].data.texcoord);
        objComponents.push(o);
    }
    return objComponents;
}