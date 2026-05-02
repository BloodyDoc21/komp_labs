import { Cube } from './models/Cube.js';
import { Pyramid } from './models/Pyramid.js';
import { WireframeRenderer } from './renderer/WireframeRenderer.js';
import { SolidRenderer } from './renderer/SolidRenderer.js';
import { ShadedRenderer } from './renderer/ShadedRenderer.js';
import { Lighting } from './lighting/Lighting.js';

const canvas = document.getElementById('canvas');
const modeWireframeBtn = document.getElementById('modeWireframe');
const modeSolidBtn = document.getElementById('modeSolid');
const modeShadedBtn = document.getElementById('modeShaded');
const rotateBtn = document.getElementById('rotateBtn');
const resetBtn = document.getElementById('resetBtn');
const angleXSlider = document.getElementById('angleX');
const angleYSlider = document.getElementById('angleY');
const angleZSlider = document.getElementById('angleZ');
const angleXVal = document.getElementById('angleXVal');
const angleYVal = document.getElementById('angleYVal');
const angleZVal = document.getElementById('angleZVal');
const projectionSelect = document.getElementById('projectionSelect');
const modelSelect = document.getElementById('modelSelect');
const showAxesCheck = document.getElementById('showAxes');
const fpsSpan = document.getElementById('fps');
const triCountSpan = document.getElementById('triCount');
const modeNameSpan = document.getElementById('modeName');

let currentMode = 'shaded';
let rotating = false;
let frameCount = 0;
let lastTime = performance.now();

const cube = new Cube();
const pyramid = new Pyramid();
let currentModel = cube;

const lighting = new Lighting();
const wireframeRenderer = new WireframeRenderer(canvas);
const solidRenderer = new SolidRenderer(canvas);
const shadedRenderer = new ShadedRenderer(canvas, lighting);

let angles = { x: 30, y: 30, z: 0 };

function updateRotation() {
    const radX = angles.x * Math.PI / 180;
    const radY = angles.y * Math.PI / 180;
    const radZ = angles.z * Math.PI / 180;
    
    wireframeRenderer.setRotation(radX, radY, radZ);
    solidRenderer.setRotation(radX, radY, radZ);
    shadedRenderer.setRotation(radX, radY, radZ);
}

function updateProjection() {
    const aspect = canvas.width / canvas.height;
    const type = projectionSelect.value;
    
    wireframeRenderer.setProjection(type, aspect);
    solidRenderer.setProjection(type, aspect);
    shadedRenderer.setProjection(type, aspect);
}

function render() {
    const showAxes = showAxesCheck.checked;
    
    if (currentMode === 'wireframe') {
        wireframeRenderer.render(currentModel, showAxes);
    } else if (currentMode === 'solid') {
        solidRenderer.render(currentModel, showAxes);
    } else {
        const lightAngle = performance.now() * 0.002;
        lighting.setLightDirection(Math.sin(lightAngle), 1, Math.cos(lightAngle));
        shadedRenderer.setShowAxes(showAxes);
        shadedRenderer.render(currentModel, 'solid', true);
    }
    
    let triCount = 0;
    currentModel.faces.forEach(face => {
        if (face.vertices.length === 4) triCount += 2;
        else if (face.vertices.length === 3) triCount += 1;
    });
    triCountSpan.textContent = triCount;
}

function animate() {
    if (rotating) {
        angles.y = (angles.y + 2) % 360;
        angleYSlider.value = angles.y;
        angleYVal.textContent = angles.y;
        updateRotation();
    }
    
    updateProjection();
    render();
    
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        fpsSpan.textContent = frameCount;
        frameCount = 0;
        lastTime = now;
    }
    
    requestAnimationFrame(animate);
}

modeWireframeBtn.addEventListener('click', () => {
    currentMode = 'wireframe';
    modeNameSpan.textContent = 'Wireframe';
    modeWireframeBtn.classList.add('active');
    modeSolidBtn.classList.remove('active');
    modeShadedBtn.classList.remove('active');
});

modeSolidBtn.addEventListener('click', () => {
    currentMode = 'solid';
    modeNameSpan.textContent = 'Solid';
    modeSolidBtn.classList.add('active');
    modeWireframeBtn.classList.remove('active');
    modeShadedBtn.classList.remove('active');
});

modeShadedBtn.addEventListener('click', () => {
    currentMode = 'shaded';
    modeNameSpan.textContent = 'Shaded';
    modeShadedBtn.classList.add('active');
    modeWireframeBtn.classList.remove('active');
    modeSolidBtn.classList.remove('active');
});

rotateBtn.addEventListener('click', () => {
    rotating = !rotating;
    rotateBtn.textContent = rotating ? '⏸ Стоп' : '▶ Вращать';
});

resetBtn.addEventListener('click', () => {
    rotating = false;
    angles = { x: 30, y: 30, z: 0 };
    angleXSlider.value = 30;
    angleYSlider.value = 30;
    angleZSlider.value = 0;
    angleXVal.textContent = 30;
    angleYVal.textContent = 30;
    angleZVal.textContent = 0;
    updateRotation();
    rotateBtn.textContent = '▶ Вращать';
});

angleXSlider.addEventListener('input', (e) => {
    angles.x = parseInt(e.target.value);
    angleXVal.textContent = angles.x;
    updateRotation();
});

angleYSlider.addEventListener('input', (e) => {
    angles.y = parseInt(e.target.value);
    angleYVal.textContent = angles.y;
    updateRotation();
});

angleZSlider.addEventListener('input', (e) => {
    angles.z = parseInt(e.target.value);
    angleZVal.textContent = angles.z;
    updateRotation();
});

projectionSelect.addEventListener('change', () => {
    updateProjection();
});

modelSelect.addEventListener('change', (e) => {
    currentModel = e.target.value === 'cube' ? cube : pyramid;
});

updateRotation();
updateProjection();
animate();

console.log('3D Renderer запущен!');