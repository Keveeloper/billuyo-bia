import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background.
// renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around.
const orbit = new OrbitControls(camera, renderer.domElement);

//Prepare audio
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('/voice.opus', function (buffer) {
  sound.setBuffer(buffer);
  window.addEventListener('click', function () {
    sound.play();
  });
  window.addEventListener('keypress', function (e) {
    if (e.code === 'Space' && sound.isPlaying) {
        sound.pause();
        return;
    }
    
    sound.play();
  });
});

const analyser = new THREE.AudioAnalyser(sound, 32);


// Camera positioning.
camera.position.set(6, 8, 14);
// Has to be done everytime we update the camera position.
orbit.update();

// Creates a 12 by 12 grid helper.
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);

// Creates an axes helper with an axis length of 4.
// const axesHelper = new THREE.AxesHelper(4);
// scene.add(axesHelper);

// Create IcosahedronGeometry and its wireframe material.
const uniforms = {
  u_time: { value: 0.0 },
  u_frequency: { value: 0.0 },
};

const mat = new THREE.ShaderMaterial({
  wireframe: true,
  uniforms: uniforms,
  vertexShader: document.getElementById('vertexshader').textContent,
  fragmentShader: document.getElementById('fragmentshader').textContent,
});

const geo = new THREE.IcosahedronGeometry(4, 40);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

//Clock for time uniform
const clock = new THREE.Clock();

function animate() {
    uniforms.u_frequency.value = analyser.getAverageFrequency();
  
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});