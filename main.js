import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as CANNON from 'cannon-es'


// I guess I understand multiple/modifier keys.
var keyCodes = {};
var options =
{
    freeCamera: false
};
var freeCam = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const floorGeometry = new THREE.BoxGeometry(10, 0, 100);
const floorMaterial = new THREE.MeshBasicMaterial({color: "white"});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);
floor.position.y = -0.5;
floor.position.z = -50;


const controls = new OrbitControls(camera, renderer.domElement);
controls.update;
camera.position.z = 5;
controls.update;
controls.enabled = freeCam;
const gui = new GUI();
gui.add(options, "freeCamera").onChange(function(bool)
{
    freeCam = bool;
    controls.enabled = bool;
});

const world = new CANNON.World();

function ListenKeys()
{
    window.addEventListener("keydown", function(event)
    {
        keyCodes[event.code] = true;
    }, false);
    
    window.addEventListener("keyup", function(event)
    {
        keyCodes[event.code] = false;
    });
}
ListenKeys();

function animate()
{
    requestAnimationFrame(animate);
    if (keyCodes["KeyW"] && !keyCodes["KeyS"])
    {
        cube.translateZ(-0.01);
    }
    else if (keyCodes["KeyS"] && !keyCodes["KeyW"])
    {
        cube.translateZ(0.01);
    }

    if (keyCodes["KeyA"] && !keyCodes["KeyD"])
    {
        cube.rotateY(0.01);
    }
    else if (keyCodes["KeyD"] && !keyCodes["KeyA"])
    {
        cube.rotateY(-0.01);
    }

    // Camera
    if (freeCam == true)
    {
        controls.update;
    }
    else
    {
        camera.position.x = cube.position.x;
        camera.position.y = cube.position.y + 2;
        camera.position.z = cube.position.z + 5;
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
    }
    renderer.render(scene, camera);
}
animate();