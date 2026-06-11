'use strict';

import { utils } from "../../resources/utils.js";
import { PlayerControls } from "../../resources/controls.js";
import { Cube } from "../entities/Cube.js";
import { TEXTURES } from "../../resources/textures/textures.js";
import { LanciaDelta } from "../entities/LanciaDelta.js";
import { SkyBox } from "../entities/SkyBox.js";
import { Track } from "../entities/Track.js";
import { soundManager } from "../entities/SoundManager.js";

var isPressingLeftMouseButton = false;


//GAME-OBJECTS
var cube = {}
var cube2 = {}
var cube3 = {}
var cube4 = {}
var cube5 = {}
var cube6 = {}
var cube7 = {}

var objectList = [];

var car = {};
var track = {}

//SKYBOX
var skyBox = {};

//CONTEXT
var canvas = {};
var gl = {};


//BUFFER AND PROGRAM
var depthFramebuffer = {}
var textureProgramInfo = {}
var colorProgramInfo = {}
var skyboxProgramInfo = {}



var settings = new function () {
  this.cameraX = 15;
  this.cameraY = 4;
  this.cameraZ = 0;
  this.posX = 10;
  this.posY = 12;
  this.posZ = 4.3;
  this.targetX = 2.5;
  this.targetY = 1;
  this.targetZ = 3.5;
  this.projWidth = 100;
  this.projHeight = 100;
  this.fieldOfView = 178;
  this.bias = -0.006;
  this.perspective = false;
};

window.addEventListener('game-window-component-loaded', () => {

  main();
});

function AdjustDistance(scrollEvent) {
  //lower this value to obtain higher sensitivity
  var sensitivity = 100
  settings.cameraX -= scrollEvent.wheelDelta / sensitivity
}

function MoveCamera(mouseEvent) {
  //lower this value to obtain higher sensitivity
  var sensitivity = 100
  if (isPressingLeftMouseButton == true) {
    settings.cameraZ -= (mouseEvent.movementX / sensitivity)
    settings.cameraY -= (mouseEvent.movementY / sensitivity)


  }
}

function setMouseEvents() {
  canvas.onwheel = (scrollEvent) => { AdjustDistance(scrollEvent) }
  canvas.onmousedown = (mouseEvent) => { mouseEvent.button == 0 ? isPressingLeftMouseButton = true : isPressingLeftMouseButton = false }
  canvas.onmouseup = (mouseEvent) => { mouseEvent.button == 0 ? isPressingLeftMouseButton = false : isPressingLeftMouseButton = true }
  canvas.onmousemove = (mouseEvent) => { MoveCamera(mouseEvent) }
}

function setEventListeners() {
  // debugger
  document.addEventListener("keydown", manageKeyDown)
  document.addEventListener("keyup", manageKeyUp)
}

function manageKeyDown(event) {
  manageMovement(event, true);
}

function manageKeyUp(event) {
  manageMovement(event, false);
}

function manageMovement(keyDownEvent, isPressed) {
  if (keyDownEvent.code != undefined && car instanceof LanciaDelta) {
    // debugger
    switch (keyDownEvent.code) {
      case PlayerControls.MOVE_FORWARD:
        car.isAccellerating = isPressed;

        if(isPressed)
          soundManager.playAccellerate()
        else
          soundManager.stopAccellerate()
        // car.setTransforms(oldTranforms.x - 1, oldTranforms.y, oldTranforms.z)
        break;
      case PlayerControls.MOVE_BACKWARD:
        car.isDecelerating = isPressed
        // car.setTransforms(oldTranforms.x + 1, oldTranforms.y, oldTranforms.z)
        break;
      case PlayerControls.MOVE_LEFT:
        car.isTurningleft = isPressed;
        // car.setTransforms(oldTranforms.x, oldTranforms.y, oldTranforms.z + 1)
        break;
      case PlayerControls.MOVE_RIGHT:
        car.isTurningRight = isPressed;
        // car.setTransforms(oldTranforms.x, oldTranforms.y, oldTranforms.z - 1)
        break;
      default:
        car.isAccellerating = false;
        car.isTurningRight = false;
        car.isTurningLeft = false;
        break;
    }


  }

}

function initDatGui() {
  var gui = new dat.GUI();

  gui.add(settings, 'cameraX', -100, 100);
  gui.add(settings, 'cameraY', -20, 20);
  gui.add(settings, 'cameraZ', -10, 10);
  gui.add(settings, 'posX', -10, 10);
  gui.add(settings, 'posY', 1, 20);
  gui.add(settings, 'posZ', 1, 20);
  gui.add(settings, 'targetX', -10, 10);
  gui.add(settings, 'targetY', 0, 20);
  gui.add(settings, 'targetZ', -10, 20);
  gui.add(settings, 'projWidth', 0, 150);
  gui.add(settings, 'projHeight', 0, 150);
  gui.add(settings, 'fieldOfView', 1, 179);
  gui.add(settings, 'bias', -0.2, 0.0).step(0.025);
  gui.add(settings, 'perspective');


}

function createDepthFrameBuffer() {
  depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,       // target
    gl.DEPTH_ATTACHMENT,  // attachment point
    gl.TEXTURE_2D,        // texture target
    TEXTURES.DEPTH_TEXTURE,         // texture
    0);                   // mip level

}

function initGate(x, y, z, scale, color, colorMult, texture) {
  var beginCube = new Cube()
  beginCube.setTransforms(x, y, z)
  beginCube.setScale(scale, scale, scale)
  beginCube.uniforms.u_color = color
  beginCube.uniforms.u_colorMult = colorMult
  beginCube.uniforms.u_texture = texture

  objectList.push(beginCube)

  var newZ = z
  for (let i = 0; i < 4; i++) {
    var cube = new Cube()
    cube.setTransforms(x, y + (2 * scale), newZ)
    cube.setScale(scale, scale, scale)
    cube.uniforms.u_color = color
    cube.uniforms.u_colorMult = colorMult
    cube.uniforms.u_texture = texture

    newZ -= (scale * 2);
    objectList.push(cube)
  }

  var endCube = new Cube()
  endCube.setTransforms(x, y, newZ + (scale * 2))
  endCube.setScale(scale, scale, scale)
  endCube.uniforms.u_color = color
  endCube.uniforms.u_colorMult = colorMult
  endCube.uniforms.u_texture = texture
  objectList.push(endCube)


}

async function main() {
  //function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');

  if (!gl) {
    return;
  }
  canvas.width = 600;
  canvas.height = 600;
  utils.setContext(canvas, gl)
  // debugger
  if (utils.isDebugEnabled)
    initDatGui();




  const ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    return alert('need WEBGL_depth_texture');  // eslint-disable-line
  }

  // setup GLSL programs
  textureProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/3d-vertex-shader.glsl', 'glsl/3d-fragment-shader.glsl']);
  colorProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/color-vertex-shader.glsl', 'glsl/color-fragment-shader.glsl']);
  skyboxProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/skybox-vertex-shader.glsl', 'glsl/skybox-fragment-shader.glsl'])





  car = new LanciaDelta();
  skyBox = new SkyBox();
  track = new Track();



  await track.init();


  await car.init()
  car.setTransforms(269, 1.5, -195)

  var texture = await TEXTURES.loadTexture(gl, '../../resources/textures/author/fototessera.jpg', gl.CLAMP_TO_EDGE)

  initGate(242, 5.5, -168, 10, [1, 1, 1, 1], [0.95, 0.95, 0.95, 1], texture)

  setMouseEvents()
  setEventListeners()

  skyBox.skyboxTexture = await TEXTURES.loadCubMapTexture(gl, '../../resources/textures/skybox/skybox.png')


  createDepthFrameBuffer()
  render();
  setInterval(render, 10);
}


function drawScene(
  projectionMatrix,
  cameraMatrix,
  textureMatrix,
  lightWorldMatrix,
  programInfo) {
  // Make a view matrix from the camera matrix.
  const viewMatrix = m4.inverse(cameraMatrix);

  drawSkybox(skyboxProgramInfo, skyBox.skyboxBufferInfo, projectionMatrix, viewMatrix, skyBox.skyboxTexture)

  gl.useProgram(programInfo.program);


  // set uniforms that are the same for both the sphere and plane
  // note: any values with no corresponding uniform in the shader
  // are ignored.
  webglUtils.setUniforms(programInfo, {
    u_view: viewMatrix,
    u_projection: projectionMatrix,
    u_bias: settings.bias,
    u_textureMatrix: textureMatrix,
    u_projectedTexture: TEXTURES.DEPTH_TEXTURE,
    u_shininess: 150,
    u_innerLimit: Math.cos(utils.degToRad(settings.fieldOfView / 2 - 10)),
    u_outerLimit: Math.cos(utils.degToRad(settings.fieldOfView / 2)),
    u_lightDirection: lightWorldMatrix.slice(8, 11).map(v => -v),
    u_lightWorldPosition: [settings.posX, settings.posY, settings.posZ],
    u_viewWorldPosition: cameraMatrix.slice(12, 15),
  });

  drawComplexObject(programInfo, track.trackBuffer, track.Transform)
  drawComplexObject(programInfo, car.carBuffers, car.Transform)

  objectList.forEach(object => drawObject(programInfo, object.bufferInfo, object))




}




function drawObject(programInfo, ObjectBufferInfo, object) {
  // Setup all the needed attributes.
  webglUtils.setBuffersAndAttributes(gl, programInfo, ObjectBufferInfo);

  // IMPORTANT: the transforms must be used outside the uniforms attribute otherwise they won't update
  webglUtils.setUniforms(programInfo, {
    u_world: object.Transform,
    u_color: object.uniforms.u_color,
    u_colorMult: object.uniforms.u_colorMult,
    u_texture: object.uniforms.u_texture,
  });

  // calls gl.drawArrays or gl.drawElements
  webglUtils.drawBufferInfo(gl, ObjectBufferInfo);
}

function drawComplexObject(programInfo, carBuffers, carTransforms) {
  //  if (programInfo === textureProgramInfo) {
  carBuffers.forEach(({ carBufferInfo, texture, color }) => {
    // debugger
    const hasTexture = texture !== TEXTURES.WHITE_TEXTURE;
    webglUtils.setBuffersAndAttributes(gl, programInfo, carBufferInfo);
    webglUtils.setUniforms(programInfo, {
      u_world: carTransforms,
      u_color: hasTexture ? [1, 1, 1, 1] : color,
      u_colorMult: hasTexture ? [1, 1, 1, 1] : color,
      u_texture: texture,  //  texture different for each group
    });
    webglUtils.drawBufferInfo(gl, carBufferInfo);
  });

  car.CarDoStep();
  // }

}

// https://webglfundamentals.org/webgl/lessons/webgl-skybox.html -> edited but same concept without animations
function drawSkybox(skyboxProgramInfo, skyboxBufferInfo, cameraProjectionMatrix, cameraViewMatrix, skyboxTexture) {
  gl.useProgram(skyboxProgramInfo.program);

  // Setup all the needed attributes.
  webglUtils.setBuffersAndAttributes(gl, skyboxProgramInfo, skyboxBufferInfo);

  //copying view matrix
  let viewMatrix = m4.copy(cameraViewMatrix);
  viewMatrix[12] = 0;
  viewMatrix[13] = 0;
  viewMatrix[14] = 0;
  //calculating the inverse
  let viewDirectionProjectionMatrix = m4.multiply(cameraProjectionMatrix, viewMatrix);
  let viewDirectionProjectionInverseMatrix = m4.inverse(viewDirectionProjectionMatrix);

  //defining the uniforms for skybox
  skyBox.skyboxUniforms = {
    u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
    u_skybox: skyboxTexture,
  }

  //setting the uniforms
  webglUtils.setUniforms(skyboxProgramInfo, skyBox.skyboxUniforms)

  // important otherwise the skybox wouldn't render
  gl.depthFunc(gl.LEQUAL);

  webglUtils.drawBufferInfo(gl, skyboxBufferInfo)

}

function render() {

  var carTransforms = null

  if (utils.isgGamePadConnected)
    utils.updateJoystickInput()


  const facingInrads = utils.degToRad(car.facing)
  const rearDistance = 15
  const heightCamera = 5;
  const offsetX = Math.sin(facingInrads) * rearDistance
  const offsetZ = Math.cos(facingInrads) * rearDistance

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);



  if (car instanceof LanciaDelta) {
    carTransforms = car.getTransformsAsArray()
  }

  if (utils.isDebugEnabled) {
    console.log("Car Position " +
      "x: " + carTransforms[0] +
      "y: " + carTransforms[1] +
      "z: " + carTransforms[2]
    )
  }


  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // first draw from the POV of the light
  const lightWorldMatrix = m4.lookAt(
    [settings.posX + carTransforms[0], settings.posY + carTransforms[1], settings.posZ + carTransforms[2]],          // position
    carTransforms, // target
    [0, 1, 0],                                              // up
  );
  const lightProjectionMatrix = settings.perspective
    ? m4.perspective(
      utils.degToRad(settings.fieldOfView),
      settings.projWidth / settings.projHeight,
      0.5,  // near
      100)   // far
    : m4.orthographic(
      -settings.projWidth,   // left
      settings.projWidth,   // right
      -settings.projHeight,  // bottom
      settings.projHeight,  // top
      0.5,                      // near
      100);                      // far

  // draw to the depth texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.viewport(0, 0, TEXTURES.DEPTURE_TEXTURE_SIZE, TEXTURES.DEPTURE_TEXTURE_SIZE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // debugger
  if(utils.areShadowEnabled){
  drawScene(
    lightProjectionMatrix,
    lightWorldMatrix,
    m4.identity(),
    lightWorldMatrix,
    colorProgramInfo);

  }

  // now draw scene to the canvas projecting the depth texture into the scene
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.4, 0.6, 0.9, 1); //light blue
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);





  let textureMatrix = m4.identity();
  textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
  textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
  textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
  // use the inverse of this world matrix to make
  // a matrix that will transform other positions
  // to be relative this this world space.
  textureMatrix = m4.multiply(
    textureMatrix,
    m4.inverse(lightWorldMatrix));

  // Compute the projection matrix
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const fieldOfViewRadians = utils.degToRad(60);
  const projectionMatrix =
    m4.perspective(fieldOfViewRadians, aspect, 1, 2000);




  // Compute the camera's matrix using look at.


  var cameraPosition = [carTransforms[0] - offsetX, carTransforms[1] + heightCamera, carTransforms[2] - offsetZ];
    
  if (utils.isDebugEnabled) {
    cameraPosition[0] += settings.cameraX
    cameraPosition[1] += settings.cameraY
    cameraPosition[2] += settings.cameraZ
  }



  const target = carTransforms;
  const up = [0, 5, 0];
  const cameraMatrix = m4.lookAt(cameraPosition, target, up);
  // gl.disable(gl.CULL_FACE);
  drawScene(
    projectionMatrix,
    cameraMatrix,
    textureMatrix,
    lightWorldMatrix,
    textureProgramInfo);

  // ------ Draw the frustum ------
  {
    const viewMatrix = m4.inverse(cameraMatrix);

    gl.useProgram(colorProgramInfo.program);

    // Setup all the needed attributes.

    // scale the cube in Z so it's really long
    // to represent the texture is being projected to
    // infinity
    const mat = m4.multiply(
      lightWorldMatrix, m4.inverse(lightProjectionMatrix));

    // Set the uniforms we just computed
    webglUtils.setUniforms(colorProgramInfo, {
      u_color: [1, 1, 1, 1],
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_world: mat,
    });

    // calls gl.drawArrays or gl.drawElements
    //  webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
  }
}
