import { utils } from "../utils.js";

class Textures {
    canvas = utils.canvas;
    gl = utils.graphicLibrary;
    _checkerboardTexture = null;
    _whiteTexture = null
    _blackTexture = null
    _depthTexture = null
    DEPTURE_TEXTURE_SIZE = 2048

    constructor() {
    }

    get CHECKERBOARD_TEXTURE() {
        if (!this._checkerboardTexture) {
            this.canvas = utils.canvas;
            this.gl = utils.graphicLibrary;
            this._checkerboardTexture = this.createCheckerBoardTexture();
        }
        return this._checkerboardTexture;
    }

    get WHITE_TEXTURE() {
        if (!this._whiteTexture) {
            this.canvas = utils.canvas;
            this.gl = utils.graphicLibrary;
            this._whiteTexture = this.createCheckerBoardTexture();
        }
        return this._whiteTexture;
    }

    get BLACK_TEXTURE() {
        if (!this._blackTexture) {
            this.canvas = utils.canvas;
            this.gl = utils.graphicLibrary;
            this._blackTexture = this.createCheckerBoardTexture();
        }
        return this._blackTexture;
    }

    get DEPTH_TEXTURE() {
        if (!this._depthTexture) {
            this.canvas = utils.canvas;
            this.gl = utils.graphicLibrary;
            this._depthTexture = this.createDepthTexure();
        }
        return this._depthTexture;
    }

    createCheckerBoardTexture() {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,                // mip level
            this.gl.LUMINANCE,     // internal format
            8,                // width
            8,                // height
            0,                // border
            this.gl.LUMINANCE,     // format
            this.gl.UNSIGNED_BYTE, // type
            new Uint8Array([  // data
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
            ]));
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        return texture
    }

    createWhiteTexture() {
        const whiteTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, whiteTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        return whiteTexture
    }

    createBlackTexture() {
        const blackTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, blackTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return blackTexture;
    }


    createDepthTexure() {
        const depthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, depthTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,      // target
            0,                  // mip level
            this.gl.DEPTH_COMPONENT, // internal format
            this.DEPTURE_TEXTURE_SIZE,   // width
            this.DEPTURE_TEXTURE_SIZE,   // height
            0,                  // border
            this.gl.DEPTH_COMPONENT, // format
            this.gl.UNSIGNED_INT,    // type
            null);              // data
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        return depthTexture;
    }

    loadTexture(gl, url, wrapMode = gl.REPEAT) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Placeholder
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 255, 255]));

        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
        };
        image.src = url;
        return texture;
    }

    loadCubMapTexture(gl, url, wrapMode = gl.REPEAT) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        //filters for not power of 2 images
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const faceTargets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, // rigth
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X, // left
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, // up
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, // down
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, // front
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z  // rear
        ];

        //creating 2d image for each face
        faceTargets.forEach(target => {
            gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        });

        const image = new Image();
        image.onload = function () {

            const faceSize = image.width / 4;

            //cut element
            const canvas = document.createElement('canvas');
            canvas.width = faceSize;
            canvas.height = faceSize;
            const ctx = canvas.getContext('2d');

            const faces = [
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, x: 2, y: 1 }, // rigth
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, x: 0, y: 1 }, // left
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, x: 1, y: 0 }, // up
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, x: 1, y: 2 }, // down
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, x: 1, y: 1 }, // front
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, x: 3, y: 1 }  // rear

            ];

            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

            faces.forEach(face => {
                // Clean support canvas
                ctx.clearRect(0, 0, faceSize, faceSize);

                // Cut the image
                ctx.drawImage(
                    image,
                    face.x * faceSize, face.y * faceSize, faceSize, faceSize, // source region (X, Y, width, height)
                    0, 0, faceSize, faceSize                                  // destination region on canvas
                );

                gl.texImage2D(face.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
            });

        };
        image.src = url;
        return texture;
    }
}

export const TEXTURES = new Textures();