import { utils } from "../../resources/utils.js";

export class GameObject {
    Transform = m4.translation(0, 0, 0)
    canvas = utils.canvas;
    gl = utils.graphicLibrary;

    X = 12
    Y = 13
    Z = 14

    convertVerticesFromGlmFormat(facesList, verticesList) {
        var verticesFloat32 = new Float32Array(facesList.length * 12)
        facesList.forEach((face, facesIdx) => {

            for (let i = 0; i < 3; i++) {
                var index = (facesIdx * 3) + i
                var vertexIdx = face.vert[i]
                // debugger
                verticesFloat32[index * 4] = verticesList[vertexIdx].x
                verticesFloat32[(index * 4) + 1] = verticesList[vertexIdx].y
                verticesFloat32[(index * 4) + 2] = verticesList[vertexIdx].z
                //fourth component
                verticesFloat32[(index * 4) + 3] = 1.0
            }


        });
        return verticesFloat32;
    }

    convertNormalsFromGlmFormat(faceList, glmNormalsList) {
        var NormalsFloat32 = new Float32Array(glmNormalsList.length * 9)



        faceList.forEach((face, faceIndex) => {
            face.normalVertexIndex.forEach((normalIdx, i) => {
                // debugger
                var index = faceIndex * 3 + i
                var normal = glmNormalsList[normalIdx]
                NormalsFloat32[index * 3] = normal.i
                NormalsFloat32[(index * 3) + 1] = normal.j
                NormalsFloat32[(index * 3) + 2] = normal.k
            });

        })
        return NormalsFloat32;
    }

    convertTexcoordsFromGlmFormat(facesList, uvsList) {
        var out = new Float32Array(facesList.length * 6);

        facesList.forEach((face, faceIdx) => {
            face.textCoordsIndex.forEach((uvIndex, i) => {
                const uv = uvsList[uvIndex];

                out[(faceIdx * 3 + i) * 2 + 0] = uv.u;
                out[(faceIdx * 3 + i) * 2 + 1] = 1.0 - uv.v;

            });
        });

        return out;
    }

    setScale(x, y, z) {
        this.Transform = m4.scale(this.Transform, x, y, z)
    }


    sumTransforms(x,y,z){
        this.Transform[this.X] += x;
        this.Transform[this.Y] += y;
        this.Transform[this.Z] += z;
    }
    setRotation(degreeX, degreeY, degreeZ) {
        this.Transform = m4.xRotate(this.Transform, utils.degToRad(degreeX))
        this.Transform = m4.yRotate(this.Transform, utils.degToRad(degreeY))
        this.Transform = m4.zRotate(this.Transform, utils.degToRad(degreeZ))
    }
    setTransforms(x, y, z) {
        // debugger
        this.Transform[this.X] = x;
        this.Transform[this.Y] = y;
        this.Transform[this.Z] = z;
    }

    getTransforms() {
        return {
            x: this.Transform[this.X],
            y: this.Transform[this.Y],
            z: this.Transform[this.Z]
        }
    }

    getTransformsAsArray() {
        // debugger
        return [
            this.Transform[this.X],
            this.Transform[this.Y],
            this.Transform[this.Z]
        ]
    }



}
