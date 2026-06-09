import { GameObject } from "./GameObject.js";
import { utils } from "../../resources/utils.js";
import { TEXTURES } from "../../resources/textures/textures.js";

export class Track extends GameObject {

    meshPath = "../../resources/models/track1/race_track2.obj"
    objectMesh = {}
    faceGroups = {}
    objectTransformsArray = {}
    trackBuffer = []
    bufferInfo = []
    validFaces = []

    uniforms = {
        u_colorMult: [0.5, 1, 0.5, 1],  // lightgreen
        u_color: [0, 0, 1, 1],
        u_texture: TEXTURES.CHECKERBOARD_TEXTURE,
        u_world: this.Transform,
    };

    materialTextureMap = {
        'default':  'Start' ,  // gray
        'Track': 'Track',  // gray
        'Start': 'Start',  // gray
        'Sand': 'Sand',  // black
        'Cement_3' : 'Concrete',
        'Cement_2': 'Concrete',  // gray metallic
        'Ramp': 'Ramp',
       
    };

    materialColors = {
        'default': [0.5, 1, 1, 1],
        'Track': [0.5, 0.5, 0.5, 1],
        'Start': [0.5, 0, 0, 1],
        'Sand': [0.1, 0.1, 0.1, 1],  // black
        'Concrete': [0.7, 0.7, 0.7, 1],  // gray 
        'Ramp': [0.95, 0.95, 0.95, 1],  // white
    };

    textures = {
        'Track': TEXTURES.loadTexture(this.gl, '../../resources/textures/track1/asphalt.jpg', this.gl.CLAMP_TO_EDGE),
        'Start': TEXTURES.loadTexture(this.gl, '../../resources/textures/track1/Start.jpeg', this.gl.CLAMP_TO_EDGE),
        'Sand': TEXTURES.loadTexture(this.gl, '../../resources/textures/track1/sand.jpg', this.gl.CLAMP_TO_EDGE),
        'Concrete': TEXTURES.loadTexture(this.gl, '../../resources/textures/track1/concrete.jpg', this.gl.CLAMP_TO_EDGE),
        'Ramp': TEXTURES.loadTexture(this.gl, '../../resources/textures/track1/ramp.jpg', this.gl.CLAMP_TO_EDGE),
    
    };


    constructor() {
        super()

    }

    async init() {
        await this.loadMesh()
        // console.log(this.objectMesh)
        this.faceGroups = this.groupFacesByMaterial(this.validFaces);
        this.generateTrackBuffer()
        this.setScale(200, 200, 200)
        // this.setInitialPosition()
    }

    generateTrackBuffer() {
        for (const matIndex in this.faceGroups) {
            const faces = this.faceGroups[matIndex];
            const carBufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, {
                position: { numComponents: 4, data: this.convertVerticesFromGlmFormat(faces ,this.objectMesh.mesh.vert) },
                normal: { numComponents: 3, data: this.convertNormalsFromGlmFormat(faces, this.objectMesh.mesh.normal) },
                texcoord: { numComponents: 2, data: this.convertTexcoordsFromGlmFormat(faces, this.objectMesh.mesh.textCoords) },
            });
            const material = this.objectMesh.mesh.materials[matIndex];
            const textureName = material.name;
            this.trackBuffer.push({

                carBufferInfo,
                texture: this.materialTextureMap[material.name]
                    ? this.textures[this.materialTextureMap[material.name]]
                    : TEXTURES.WHITE_TEXTURE,
                color: this.materialColors[material.name] || [0.8, 0.8, 0.8],
            });
        }
    }


    groupFacesByMaterial(faces) {
        const groups = {};
        faces.forEach(face => {
            const matIndex = face.material;
            if (!groups[matIndex]) groups[matIndex] = [];
            groups[matIndex].push(face);
        });
        return groups;
    }

    async loadMesh() {
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