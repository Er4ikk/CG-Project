import { GameObject } from "./GameObject.js";
import { TEXTURES } from "../../resources/textures/textures.js";
import { utils } from "../../resources/utils.js";

export class Plane extends GameObject {

    bufferInfo = {}
    width = 200;
    depth = 200;
    uniforms = {
        u_colorMult: [0.5, 0.5, 1, 1],  // lightblue
        u_color: [1, 0, 0, 1],
        u_texture: TEXTURES.CHECKERBOARD_TEXTURE,
        u_world: m4.translation(0, 0, 0),
      };

    constructor() {
        super()
         const arrays2 = this.createPlaneVertices.apply(this, Array.prototype.slice.call(arguments, 1));
        this.bufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, arrays2);
        
    }



    applyFuncToV3Array(array, matrix, fn) {
        const len = array.length;
        const tmp = new Float32Array(3);
        for (let ii = 0; ii < len; ii += 3) {
            fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
            array[ii] = tmp[0];
            array[ii + 1] = tmp[1];
            array[ii + 2] = tmp[2];
        }
    }

    transformNormal(mi, v, dst) {
        dst = dst || new Float32Array(3);
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
        dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
        dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

        return dst;
    }
    
    reorientDirections(array, matrix) {
        this.applyFuncToV3Array(array, matrix, m4.transformDirection);
        return array;
    }

    /*
     * Reorients normals by the inverse-transpose of the given
     * matrix.
     */
    reorientNormals(array, matrix) {
        this.applyFuncToV3Array(array, m4.inverse(matrix), this.transformNormal);
        return array;
    }

    /*
     * Reorients positions by the given matrix. In other words, it
     * multiplies each vertex by the given matrix.
     */
    reorientPositions(array, matrix) {
        this.applyFuncToV3Array(array, matrix, m4.transformPoint);
        return array;
    }

    /*
     * Reorients arrays by the given matrix. Assumes arrays have
     * names that contains 'pos' could be reoriented as positions,
     * 'binorm' or 'tan' as directions, and 'norm' as normals.
     */
    

    createPlaneVertices() {
        var subdivisionsWidth = 1;
        var subdivisionsDepth = 1;
        var matrix;

        this.width = this.width || 1;
        this.depth = this.depth || 1;
        subdivisionsWidth = subdivisionsWidth || 1;
        subdivisionsDepth = subdivisionsDepth || 1;
        matrix = matrix || m4.identity();

        const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
        const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
        const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
        const texcoords = webglUtils.createAugmentedTypedArray(2, numVertices);

        for (let z = 0; z <= subdivisionsDepth; z++) {
            for (let x = 0; x <= subdivisionsWidth; x++) {
                const u = x / subdivisionsWidth;
                const v = z / subdivisionsDepth;
                positions.push(
                    this.width * u - this.width * 0.5,
                    0,
                    this.depth * v - this.depth * 0.5);
                normals.push(0, 1, 0);
                texcoords.push(u, v);
            }
        }

        const numVertsAcross = subdivisionsWidth + 1;
        const indices = webglUtils.createAugmentedTypedArray(
            3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);

        for (let z = 0; z < subdivisionsDepth; z++) {
            for (let x = 0; x < subdivisionsWidth; x++) {
                // Make triangle 1 of quad.
                indices.push(
                    (z + 0) * numVertsAcross + x,
                    (z + 1) * numVertsAcross + x,
                    (z + 0) * numVertsAcross + x + 1);

                // Make triangle 2 of quad.
                indices.push(
                    (z + 1) * numVertsAcross + x,
                    (z + 1) * numVertsAcross + x + 1,
                    (z + 0) * numVertsAcross + x + 1);
            }
        }
        // debugger
        const arrays = this.reorientVertices({
            position: positions,
            normal: normals,
            texcoord: texcoords,
            indices: indices,
        }, matrix);
        return arrays;
    }

    reorientVertices(arrays, matrix) {
        Object.keys(arrays).forEach((name) => {
            const array = arrays[name];
            if (name.indexOf('pos') >= 0) {
                this.reorientPositions(array, matrix);
            } else if (name.indexOf('tan') >= 0 || name.indexOf('binorm') >= 0) {
                this.reorientDirections(array, matrix);
            } else if (name.indexOf('norm') >= 0) {
                this.reorientNormals(array, matrix);
            }
        });
        return arrays;
    }

}