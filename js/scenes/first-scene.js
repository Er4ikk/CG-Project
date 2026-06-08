'use strict';

import { utils } from "../../resources/utils.js";
import { PlayerControls } from "../../resources/controls.js";
import { Cube } from "../entities/Cube.js";
import { TEXTURES } from "../../resources/textures/textures.js";
import { LanciaDelta } from "../entities/LanciaDelta.js";
import { SkyBox } from "../entities/SkyBox.js";
import { Track } from "../entities/Track.js";

var isPressingLeftMouseButton = false;

//GAME-OBJECTS
var cube   = {}
var car    = {};
var track  = {}

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
  this.posX = 2.5;
  this.posY = 20;
  this.posZ = 4.3;
  this.targetX = 2.5;
  this.targetY = 1;
  this.targetZ = 3.5;
  this.projWidth = 200;
  this.projHeight = 200;
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
    switch (keyDownEvent.code) {
      case PlayerControls.MOVE_FORWARD:
        car.isAccellerating = isPressed;
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
  gui.add(settings, 'projWidth', 0, 100);
  gui.add(settings, 'projHeight', 0, 100);
  gui.add(settings, 'fieldOfView', 1, 179);
  gui.add(settings, 'bias', -0.2, 0.0).step(0.025);
  gui.add(settings, 'perspective');


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
  initDatGui();




  const ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    return alert('need WEBGL_depth_texture');  // eslint-disable-line
  }

  // setup GLSL programs
  textureProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/3d-vertex-shader.glsl', 'glsl/3d-fragment-shader.glsl']);
  colorProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/color-vertex-shader.glsl', 'glsl/color-fragment-shader.glsl']);
  skyboxProgramInfo = await webglUtils.createProgramInfo(gl, ['glsl/skybox-vertex-shader.glsl', 'glsl/skybox-fragment-shader.glsl'])

  


  // debugger
  cube = new Cube()
  car = new LanciaDelta();
  skyBox = new SkyBox();
  track = new Track();



  await track.init();
  

  await car.init()

  cube.setTransforms(3, 5, 1)
  cube.uniforms.u_colorMult = [1, 1, 1, 1]
  cube.uniforms.u_texture = await TEXTURES.loadTexture(gl, '../../resources/textures/author/fototessera.jpg', gl.CLAMP_TO_EDGE)

  setMouseEvents()
  setEventListeners()

  skyBox.skyboxTexture = await TEXTURES.loadCubMapTexture(gl, '../../resources/textures/skybox/skybox.png')


  depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,       // target
    gl.DEPTH_ATTACHMENT,  // attachment point
    gl.TEXTURE_2D,        // texture target
    TEXTURES.DEPTH_TEXTURE,         // texture
    0);                   // mip level

  // ObjectUniforms.


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

  drawCar(programInfo, track.trackBuffer, track.Transform)
  drawObject(programInfo, cube.bufferInfo, cube.uniforms)
  drawCar(programInfo, car.carBuffers, car.Transform)




}




function drawObject(programInfo, ObjectBufferInfo, ObjectUniforms) {
  // Setup all the needed attributes.
  webglUtils.setBuffersAndAttributes(gl, programInfo, ObjectBufferInfo);

  // Set the uniforms unique to the cube
  webglUtils.setUniforms(programInfo, ObjectUniforms);

  // calls gl.drawArrays or gl.drawElements
  webglUtils.drawBufferInfo(gl, ObjectBufferInfo);
}

function drawCar(programInfo, carBuffers, carTransforms) {
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
  webglUtils.setUniforms(skyboxProgramInfo,skyBox.skyboxUniforms)

  // important otherwise the skybox wouldn't render
  gl.depthFunc(gl.LEQUAL);

  webglUtils.drawBufferInfo(gl, skyboxBufferInfo)

}

function render() {

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  // first draw from the POV of the light
  const lightWorldMatrix = m4.lookAt(
    [settings.posX, settings.posY, settings.posZ],          // position
    [settings.targetX, settings.targetY, settings.targetZ], // target
    [0, 5, 0],                                              // up
  );
  const lightProjectionMatrix = settings.perspective
    ? m4.perspective(
      utils.degToRad(settings.fieldOfView),
      settings.projWidth / settings.projHeight,
      0.5,  // near
      100)   // far
    : m4.orthographic(
      -settings.projWidth ,   // left
      settings.projWidth ,   // right
      -settings.projHeight ,  // bottom
      settings.projHeight ,  // top
      0.5,                      // near
      100);                      // far

  // draw to the depth texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.viewport(0, 0, TEXTURES.DEPTURE_TEXTURE_SIZE, TEXTURES.DEPTURE_TEXTURE_SIZE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawScene(
    lightProjectionMatrix,
    lightWorldMatrix,
    m4.identity(),
    lightWorldMatrix,
    colorProgramInfo);

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

  var carTransforms = null
  if (car instanceof LanciaDelta) {
    carTransforms = car.getTransformsAsArray()
  }

  const cameraPosition = [settings.cameraX + carTransforms[0], settings.cameraY + carTransforms[1], settings.cameraZ + carTransforms[2]];
  const target = carTransforms;
  const up = [0, 1, 0];
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
