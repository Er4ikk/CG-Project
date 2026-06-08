import { GameObject } from "./GameObject.js";
import { utils } from "../../resources/utils.js";

export class Car extends GameObject {

    meshPath = "../../resources/models/cars/lacia_delta.obj"
    objectMesh = {}
    objectTransformsArray = {}
    objectBufferInfo = []
    validFaces = []


    constructor() {
        super()
       
    }


    async loadMesh(){
         var loadedObj = await utils.loadFile(this.meshPath)
        // debugger
        this.objectMesh = glmReadOBJ(loadedObj, {
            groups: [],
            materials: [],
            vert: [],
            textCoords: [],
            face: [],
            uvs: [],
            normal: [],
            facetnorms: [],
            indices: []
        })
        this.validFaces = this.getValidFaces()


    }


    getValidFaces() {
        return this.objectMesh.mesh.face.filter(face => {
            const hasValidVerts = !(face.vert[0] === face.vert[1] && face.vert[1] === face.vert[2]);
            // debugger
            const hasUVs = face.textCoordsIndex && face.textCoordsIndex.length === 3;
            return hasValidVerts && hasUVs;
        })

    }
}