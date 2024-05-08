import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as CANNON from 'cannon-es'
import CannonDebugger, * as CANNONDebugger from 'cannon-es-debugger'

// I guess I understand multiple/modifier keys.
var keyCodes = {};
var options =
{
    freeCamera: false
};
var freeCam = false;

const world = new CANNON.World();
world.gravity.y = -9.8;
const slipperyMaterial = new CANNON.Material("slippery");
var groundMaterial = new CANNON.Material('ground');
const slipperyGround = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
    friction: 0.0001,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxtion: 3
})
world.addContactMaterial(slipperyGround)

const scene = new THREE.Scene();

const cannonDebugger = new CannonDebugger(scene, world, {
    onInit(body, mesh) {
        mesh.visible = true;
    }
})


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

const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const cubeBody = new CANNON.Body({mass: 1, material: slipperyGround});
cubeBody.addShape(cubeShape);
world.addBody(cubeBody);

const floorGeometry = new THREE.BoxGeometry(10, 0, 100);
const floorMaterial = new THREE.MeshBasicMaterial({color: "white"});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);
floor.position.y = -0.5;
floor.position.z = -45;

const floorShape = new CANNON.Box(new CANNON.Vec3(5, 0.01, 50));
const floorBody = new CANNON.Body({mass: 0, material: groundMaterial});
floorBody.addShape(floorShape);
floorBody.position.x = 0;
floorBody.position.y = -0.5;
floorBody.position.z = -45;
world.addBody(floorBody);

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
    world.step(1/60);
    cannonDebugger.update();
    cube.position.copy(cubeBody.position);
    cube.quaternion.copy(cubeBody.quaternion);

    if (keyCodes["KeyW"] && !keyCodes["KeyS"])
    {
        cubeBody.applyLocalForce(new CANNON.Vec3(0, 0, -5));
    }
    else if (keyCodes["KeyS"] && !keyCodes["KeyW"])
    {
        cubeBody.applyLocalForce(new CANNON.Vec3(0, 0, 5));
    }

    if (keyCodes["KeyA"] && !keyCodes["KeyD"])
    {
        cubeBody.applyTorque(new CANNON.Vec3(0, 1, 0));
    }
    else if (keyCodes["KeyD"] && !keyCodes["KeyA"])
    {
        cubeBody.applyTorque(new CANNON.Vec3(0, -1, 0));
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
        camera.position.z = cube.position.z + 6;
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
    }
    renderer.render(scene, camera);
}
animate();