import { Car } from "./Car.js"
import { TEXTURES } from "../../resources/textures/textures.js";
import { utils } from "../../resources/utils.js";
import { soundManager } from "./SoundManager.js";

export class LanciaDelta extends Car {
    //LANCIA ONLY


    //GRAPHICS
    faceGroups = {}
    carBuffers = []


    // PHYSICS
    x = 0
    y = 1
    z = 2
    velocity = [0, 0, 0]
    accelleration = 0.01;
    reverseSpeed = 0.02;
    rotatioSpeed = 0.3;
    steerReturn = 0.94;
    frictionZ = 0.97;
    //0.97<- asphalt https://www.pasquali.org/dispense/Coefficienti%20di%20attrito.pdf
    frictionY = 0.99;
    frictionX = 0.97;
    facing = -90;
    grip = 0.45;
    rotationAngle = 0;

    //USER CONTROLS
    isAccellerating = false;
    isDecelerating = false;
    isTurningRight = false;
    isTurningleft = false;

    materialTextureMap = {
        'default': null,  // gray
        'Material': null,  // gray
        'Material.001': null,  // gray
        'Material.002': null,  // gray
        'None': null,  // gray
        'col_ban': null,  // black
        'col_pelek': null,  // gray metallic
        'col_uv_ban_dpn': 'uv_ban_depan',
        'col_body_depan': null,  // white body
        'cpl_body_tutup_msn_ats': 'tutup_mesin_ats_uv',
        'col_kaca': 'uv_kaca',
        'col_uv_tutup_mesin': 'tutup_mesin_ats_uv',
        'col_uv_tutup_msn_bwh': 'tutup_mesin_bwh_uv',
        'col_uv_sayap_&_belakang': 'sayap_&_belakang_uv',
        'col_uv_pintu_kanan_kiri': 'uv_pintu_kanan_kiri',
        'col_red': null,  // red
        'col_uv_bemper': 'uv_bemper',
    };

    materialColors = {
        'default': [0.5, 1, 1, 1],
        'Material': [0.5, 0.5, 0.5, 1],
        'Material.001': [0.5, 0.5, 0.5, 1],
        'Material.002': [0.5, 0.5, 0.5, 1],
        'None': [0.5, 0, 0, 1],
        'col_ban': [0.1, 0.1, 0.1, 1],  // black
        'col_pelek': [0.7, 0.7, 0.7, 1],  // gray 
        'col_body_depan': [0.95, 0.95, 0.95, 1],  // white
        'col_red': [0.8, 0.1, 0.1, 1],  // red
    };

    carTextures = {
        'sayap_&_belakang_uv': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/sayap_&_belakang_uv.png', this.gl.CLAMP_TO_EDGE),
        'tutup_mesin_ats_uv': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/tutup_mesin_ats_uv.png', this.gl.CLAMP_TO_EDGE),
        'tutup_mesin_bwh_uv': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/tutup_mesin_bwh_uv.png', this.gl.CLAMP_TO_EDGE),
        'col_uv_ban_dpn': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/uv_ban_depan.png', this.gl.CLAMP_TO_EDGE),
        'uv_bemper': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/uv_bemper.png', this.gl.CLAMP_TO_EDGE),
        'uv_kaca_1': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/uv_kaca_1.png', this.gl.CLAMP_TO_EDGE),
        'uv_kaca': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/uv_kaca.png', this.gl.CLAMP_TO_EDGE),
        'uv_pintu_kanan_kiri': TEXTURES.loadTexture(this.gl, '../../resources/textures/cars/delta/uv_pintu_kanan_kiri.png', this.gl.CLAMP_TO_EDGE),
    };



    constructor() {
        super()
    }

    async init() {
        await this.loadMesh()
        this.faceGroups = this.groupFacesByMaterial(this.validFaces);
        this.generateCarBuffer()
        this.setInitialPosition()
    }


    setInitialPosition() {
        this.setTransforms(6, 1.5,2)
        this.setRotation(0, this.facing, 0)
        this.setScale(0.5, 0.5, 0.5)
    }

    generateCarBuffer() {
        for (const matIndex in this.faceGroups) {
            const faces = this.faceGroups[matIndex];
            const carBufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, {
                position: { numComponents: 4, data: this.convertVerticesFromGlmFormat(faces, this.objectMesh.mesh.vert) },
                normal: { numComponents: 3, data: this.convertNormalsFromGlmFormat(faces, this.objectMesh.mesh.normal) },
                texcoord: { numComponents: 2, data: this.convertTexcoordsFromGlmFormat(faces, this.objectMesh.mesh.textCoords) },
            });
            const material = this.objectMesh.mesh.materials[matIndex];
            const textureName = material.name;
            this.carBuffers.push({

                carBufferInfo,
                texture: this.materialTextureMap[material.name]
                    ? this.carTextures[this.materialTextureMap[material.name]]
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




    CarDoStep() {
        // computiamo l'evolversi della macchina

        var vxm, vym, vzm; // velocita' in spazio macchina

        // da vel frame mondo a vel frame macchina
        var cosf = Math.cos(this.facing * Math.PI / 180.0);
        var sinf = Math.sin(this.facing * Math.PI / 180.0);
        vxm = +cosf * this.velocity[this.x] - sinf * this.velocity[this.z];
        vym = this.velocity[this.y];
        vzm = +sinf * this.velocity[this.x] + cosf * this.velocity[this.z];

        // gestione dello sterzo
        if (this.isTurningleft) {
            this.rotationAngle -= this.rotatioSpeed;
        }

        if (this.isTurningRight) {
            this.rotationAngle += this.rotatioSpeed;
        }
        this.rotationAngle *= this.steerReturn; // ritorno a volante fermo

        if (this.isAccellerating) vzm += this.accelleration; // accelerazione in avanti
        if (this.isDecelerating){
            if(vzm > 0)
                soundManager.playBrake()
            else
                soundManager.stopBrake()
            vzm -= this.reverseSpeed/10;
         } // accelerazione indietro

        // attriti (semplificando)
        vxm *= this.frictionX;
        vym *= this.frictionY;
        vzm *= this.frictionZ;

        // l'orientamento della macchina segue quello dello sterzo
        // (a seconda della velocita' sulla z)
        // 1. Calcola di quanto varia l'angolo in QUESTO frame (il delta)
        var deltaFacing = -(vzm * this.grip) * this.rotationAngle;

        // 2. Aggiorna il facing assoluto (ti serve per i calcoli trigonometrici sopra)
        this.facing = this.facing + deltaFacing;

        // 3. Ruota la matrice SOLO del delta di questo frame!
        this.setRotation(0, deltaFacing, 0);

        // ritorno a vel coord mondo
        this.velocity[this.x] = +cosf * vxm + sinf * vzm;
        this.velocity[this.y] = vym;
        this.velocity[this.z] = -sinf * vxm + cosf * vzm;

         // angle
        // this.sumTransforms(this.velocity[this.x], this.velocity[this.y], this.velocity[this.z])
        // this.Transform = m4.yRotate(this.Transform,utils.degToRad(this.facing))
        this.updatePosition(this.velocity[this.x], this.velocity[this.y], this.velocity[this.z])

       
    }

    // reset the matrix
    updatePosition(x,y,z){
        const oldTranforms = this.Transform
        let matrix = m4.translation(oldTranforms[this.X] + x, oldTranforms[this.Y] + y, oldTranforms[this.Z] + z);
        matrix = m4.yRotate(matrix, utils.degToRad(this.facing))
        this.Transform = matrix;
        this.setScale(0.5, 0.5, 0.5)
    }

}