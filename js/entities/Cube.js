import { TEXTURES } from "../../resources/textures/textures.js";
import { utils } from "../../resources/utils.js";
import { GameObject } from "./GameObject.js";

export class Cube extends GameObject {

    uniforms = {
        u_colorMult: [0.5, 1, 0.5, 1],  // lightgreen
        u_color: [0, 0, 1, 1],
        u_texture: TEXTURES.CHECKERBOARD_TEXTURE,
    };

    bufferInfo = {}


    constructor() {
        super()
        // this.createCubeVertices()
        const arrays3 = this.createCubeVertices.apply(this, Array.prototype.slice.call(arguments, 1));
        this.bufferInfo = webglUtils.createBufferInfoFromArrays(utils.graphicLibrary, arrays3);

        // const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(utils.graphicLibrary, {
        //     position: [-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1,],
        //     indices: [0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6,],
        // });



    }





    createCubeVertices() {
        const k = 1;
        const cornerVertices = [
            [-k, -k, -k],
            [+k, -k, -k],
            [-k, +k, -k],
            [+k, +k, -k],
            [-k, -k, +k],
            [+k, -k, +k],
            [-k, +k, +k],
            [+k, +k, +k],
        ];

        const faceNormals = [
            [+1, +0, +0],
            [-1, +0, +0],
            [+0, +1, +0],
            [+0, -1, +0],
            [+0, +0, +1],
            [+0, +0, -1],
        ];

        const uvCoords = [
            [1, 0],
            [0, 0],
            [0, 1],
            [1, 1],
        ];

        const CUBE_FACE_INDICES = [
            [3, 7, 5, 1], // right
            [6, 2, 0, 4], // left
            [6, 7, 3, 2], // ??
            [0, 1, 5, 4], // ??
            [7, 6, 4, 5], // front
            [2, 3, 1, 0], // back
        ];

        const numVertices = 6 * 4;
        const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
        const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
        const texCoords = webglUtils.createAugmentedTypedArray(2, numVertices);
        const indices = webglUtils.createAugmentedTypedArray(3, 6 * 2, Uint16Array);

        for (let f = 0; f < 6; ++f) {
            const faceIndices = CUBE_FACE_INDICES[f];
            for (let v = 0; v < 4; ++v) {
                const position = cornerVertices[faceIndices[v]];
                const normal = faceNormals[f];
                const uv = uvCoords[v];

                // Each face needs all four vertices because the normals and texture
                // coordinates are not all the same.
                positions.push(position);
                normals.push(normal);
                texCoords.push(uv);

            }
            // Two triangles make a square face.
            const offset = 4 * f;
            indices.push(offset + 0, offset + 1, offset + 2);
            indices.push(offset + 0, offset + 2, offset + 3);
        }

        return {
            position: positions,
            normal: normals,
            texcoord: texCoords,
            indices: indices,
        };
    }



}