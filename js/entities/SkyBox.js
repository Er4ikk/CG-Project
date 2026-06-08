import { GameObject } from "./GameObject.js";

export class SkyBox extends GameObject {

    skyboxBufferInfo = {}
    skyboxTexture    = {};
    skyboxUniforms   = {}

    constructor() {
        super();
        this.initSkyboxBufferInfo()
    }

    initSkyboxBufferInfo() {
    this.skyboxBufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, {
        position: {
            numComponents: 2,
            data: [
                -1, -1,
                1, -1,
                -1, 1,
                -1, 1,
                1, -1,
                1, 1,
            ],
        },
    });
}
}