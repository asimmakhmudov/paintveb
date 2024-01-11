document.querySelector('#drawCylinderBtn').addEventListener('click', draw3DCube);

function draw3DCube() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl2');
    console.log("jsd");
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Vertex and fragment shader code (for simplicity, embedded in the HTML)
    const vsSource = `
                attribute vec4 aVertexPosition;
                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;
                void main(void) {
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                }
            `;

    const fsSource = `
                precision mediump float;
                void main(void) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                }
            `;

    // Compile shaders and link program
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.useProgram(shaderProgram);

    // Define cube vertices
    const vertices = new Float32Array([
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
    ]);

    // Create a buffer and put the vertices in it
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const position = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    const projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');

    // Specify how to retrieve the position data from the buffer
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    // Set up matrices
    const modelViewMatrixValue = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -5, 1]);
    const projectionMatrixValue = new Float32Array([2 / canvas.width, 0, 0, 0, 0, -2 / canvas.height, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1]);

    // Set matrices in shaders
    gl.uniformMatrix4fv(modelViewMatrix, false, modelViewMatrixValue);
    gl.uniformMatrix4fv(projectionMatrix, false, projectionMatrixValue);

    // Clear the canvas and draw the cube
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 3);
}

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}