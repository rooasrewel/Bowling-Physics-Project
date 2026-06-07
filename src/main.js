// src/main.js
import * as THREE from 'three';
import { handleBallControl, updateBallMovement } from '../physics/movement.js';

// 1. إنشاء المشهد والكاميرا والمنشئ
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e17); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. الإضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2); 
dirLight.position.set(5, 15, 10);
scene.add(dirLight);

// 3. إنشاء كرة البولينغ
const ballRadius = 1.0; 
const geometry = new THREE.SphereGeometry(ballRadius, 64, 64); 
const material = new THREE.MeshStandardMaterial({ 
    color: 0xe63946, 
    roughness: 0.1,  
    metalness: 0.1
});
const ball = new THREE.Mesh(geometry, material);
ball.position.set(0, 0, 0); 
scene.add(ball);

// 4. إنشاء أرضية المسار والشبكة المساعدة
const trackLength = 60; 
const floorGeo = new THREE.PlaneGeometry(12, trackLength);
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4a373, 
    roughness: 0.3 
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2; 
floor.position.y = -ballRadius; 
floor.position.z = -trackLength / 2 + 2; 
scene.add(floor);

const gridHelper = new THREE.GridHelper(trackLength, 30, 0x000000, 0x444444);
gridHelper.position.y = -ballRadius + 0.01; 
gridHelper.position.z = -trackLength / 2 + 2;
scene.add(gridHelper);

// 5. إعداد الموقع الابتدائي الثابت للكاميرا
const initialCameraPos = new THREE.Vector3(0, 4, 10);
camera.position.copy(initialCameraPos);
camera.lookAt(0, 0, -20);

// 6. الاستماع لأحداث الكيبورد وتمرير الكاميرا والكرة والوضع الابتدائي لها
window.addEventListener('keydown', (event) => {
    handleBallControl(event, ball, camera, initialCameraPos);
});

// 7. حلقة التحريك والفيزياء باستخدام Timer
const timer = new THREE.Timer();

function animate() {
    requestAnimationFrame(animate);

    timer.update();
    const deltaTime = timer.getDelta();

    // تحديث حركة الكرة والفيزياء والكاميرا بشكل مستمر
    updateBallMovement(ball, camera, initialCameraPos, deltaTime);

    renderer.render(scene, camera);
}

// التحديث التلقائي لحجم الشاشة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();