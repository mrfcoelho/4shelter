import "./style.css";
import * as LocAR from "locar";
import * as THREE from "three";

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

// setup the models to be shown in the scene
const box = new THREE.BoxGeometry(20, 20, 20);
const cube = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

//overall AR.js "manager" object
const locar = new LocAR.LocationBased(scene, camera);
//responsible for rendering the camera feed
const cam = new LocAR.WebcamRenderer(renderer);

let firstLocation = true;

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

locar.on("gpsupdate", (pos, distMoved) => {
  if (firstLocation) {
    alert(
      `Got the initial location: longitude ${pos.coords.longitude}, latitude ${pos.coords.latitude}`
    );

    const boxProps = [
      {
        latDis: 0.001,
        lonDis: 0,
        colour: 0xff0000,
      },
      {
        latDis: -0.001,
        lonDis: 0,
        colour: 0xffff00,
      },
      {
        latDis: 0,
        lonDis: -0.001,
        colour: 0x00ffff,
      },
      {
        latDis: 0,
        lonDis: 0.001,
        colour: 0x00ff00,
      },
    ];

    const geom = new THREE.BoxGeometry(20, 20, 20);

    for (const boxProp of boxProps) {
      const mesh = new THREE.Mesh(
        geom,
        new THREE.MeshBasicMaterial({ color: boxProp.colour })
      );

      console.log(
        `adding at ${pos.coords.longitude + boxProp.lonDis},${
          pos.coords.latitude + boxProp.latDis
        }`
      );
      locar.add(
        mesh,
        pos.coords.longitude + boxProp.lonDis,
        pos.coords.latitude + boxProp.latDis
      );
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
