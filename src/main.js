import "./style.css";
import * as LocAR from "locar";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// setup the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.001,
  10000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", (e) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

// Models
const models = {
  m1: {
    uri: "arq.glb",
    latitude: 41.4534311145121,
    longitude: -8.288169382564208,
    altitude: 278,
    orientation: 0,
    descritpion: "Testing description",
  },
};

/**
 * + lat = right
 * - lat = left
 * + long = back
 * - long = front
 */

locar.on("gpsupdate", async (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}, altitude ${pos.coords.altitude}`
    );

    // add all models
    for (const key in models) {
      // load the model
      let model;
      let modelLoader = await new GLTFLoader(model)
        .loadAsync(models[key].uri)
        .then(function (gltfModel) {
          // get all children of current model
          gltfModel.scene.scale.set(1000, 1000, 1000);
          gltfModel.scene.updateWorldMatrix(true);
          model = gltfModel.scene.children;
          console.log(model);
        });

      model.forEach((child) => {
        // only add to the scene the child of type mesh
        if (child.isMesh) {
          child.scale;
          locar.add(child, pos.coords.longitude - 0.001, pos.coords.latitude);
        }
      });
    }

    firstLocation = false;
  }
});

locar.startGps();

renderer.setAnimationLoop(animate);

// function that will update the cam
function animate() {
  cam.update();
  deviceOrientationControls.update();
  renderer.render(scene, camera);
}
