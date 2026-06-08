// src/main.js
import * as THREE from 'three';
import { handleBallControl, updateBallMovement } from '../physics/movement.js';

// 1. إنشاء المشهد (تم اعتماد ألوان خلفية صالة صديقكِ)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// 2. إنشاء الكاميرا (تم اعتماد زاوية الرؤية وموقع كاميرا الصالة الخاصة بصديقكِ)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const initialCameraPos = new THREE.Vector3(0, 4.5, 19);
camera.position.copy(initialCameraPos);
camera.lookAt(0, 1, -5); 

// 3. إنشاء الـ Renderer وتمكين الظلال من فرع صديقكِ
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==========================================
// أولاً: تركيب عناصر تصميم الصالة (كود صديقكِ بالكامل)
// ==========================================

// خامات الممرات والأرضيات
const laneGeometry = new THREE.BoxGeometry(4, 0.2, 20);
const laneMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68642,
    roughness: 0.3,
    metalness: 0.1
});

// الممر الأوسط (الرئيسي الذي ستتحرك فيه الكرة)
const lane = new THREE.Mesh(laneGeometry, laneMaterial);
lane.position.set(0, -0.1, 0);
lane.receiveShadow = true; 
scene.add(lane);

// الممر الأيسر
const leftLane = new THREE.Mesh(laneGeometry, laneMaterial);
leftLane.position.set(-7, -0.1, 0);
leftLane.receiveShadow = true;
scene.add(leftLane);

// الممر الأيمن
const rightLane = new THREE.Mesh(laneGeometry, laneMaterial);
rightLane.position.set(7, -0.1, 0);
rightLane.receiveShadow = true;
scene.add(rightLane);

// مجاري الممرات (Gutters)
const gutterGeometry = new THREE.BoxGeometry(0.5, 0.15, 20);
const gutterMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
leftGutter.position.set(-2.25, -0.12, 0);
const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
rightGutter.position.set(2.25, -0.12, 0);
scene.add(leftGutter, rightGutter);

const leftLaneGutter1 = new THREE.Mesh(gutterGeometry, gutterMaterial);
leftLaneGutter1.position.set(-7.75, -0.12, 0);
const leftLaneGutter2 = new THREE.Mesh(gutterGeometry, gutterMaterial);
leftLaneGutter2.position.set(-3.25, -0.12, 0);
scene.add(leftLaneGutter1, leftLaneGutter2);

const rightLaneGutter1 = new THREE.Mesh(gutterGeometry, gutterMaterial);
rightLaneGutter1.position.set(3.25, -0.12, 0);
const rightLaneGutter2 = new THREE.Mesh(gutterGeometry, gutterMaterial);
rightLaneGutter2.position.set(7.75, -0.12, 0);
scene.add(rightLaneGutter1, rightLaneGutter2);

// مكان وقوف اللاعب (Approach)
const approachGeometry = new THREE.BoxGeometry(6, 0.2, 4);
const approachMaterial = new THREE.MeshStandardMaterial({ color: 0xd9b382, roughness: 0.4 });
const approach = new THREE.Mesh(approachGeometry, approachMaterial);
approach.position.set(0, -0.1, 12);
approach.receiveShadow = true;
scene.add(approach);

// الخط الفاصل (Foul Line)
const lineGeometry = new THREE.BoxGeometry(4, 0.02, 0.1);
const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const foulLine = new THREE.Mesh(lineGeometry, lineMaterial);
foulLine.position.set(0, 0.02, 10);
scene.add(foulLine);

// أرضية الصالة المحيطة
const floorGeometry = new THREE.BoxGeometry(28, 0.1, 35);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -0.25, 2);
floor.receiveShadow = true;
scene.add(floor);

// الجدران والسقف
const leftWallGeometry = new THREE.BoxGeometry(0.5, 6, 35);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd0d0d0 });
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.set(-13, 3, 2);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
rightWall.position.set(13, 3, 2);
rightWall.receiveShadow = true;
scene.add(rightWall);

const ceilingGeometry = new THREE.BoxGeometry(28, 0.3, 35);
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.set(0, 6, 2);
ceiling.receiveShadow = true;
scene.add(ceiling);

// إضاءة السقف والمصابيح السينمائية
const lightPanelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffcc, emissiveIntensity: 1 });
function createCeilingLight(z) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 3), lightPanelMaterial);
    panel.position.set(0, 5.8, z);
    scene.add(panel);
}
createCeilingLight(10); createCeilingLight(4); createCeilingLight(-2); createCeilingLight(-8);

const ceilingLight = new THREE.PointLight(0xffffff, 1.5, 30);
ceilingLight.position.set(0, 5.5, 0);
scene.add(ceilingLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 8);
directionalLight.castShadow = true;
scene.add(directionalLight);

// جدار خلف الدبابيس وأرضية الدبابيس (Pin Deck)
const backWallGeometry = new THREE.BoxGeometry(8, 4, 0.3);
const backWallMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.set(0, 2, -11.5);
backWall.receiveShadow = true;
scene.add(backWall);

const pinDeckGeometry = new THREE.BoxGeometry(5, 0.15, 2);
const pinDeckMaterial = new THREE.MeshStandardMaterial({ color: 0xe0c28a });
const pinDeck = new THREE.Mesh(pinDeckGeometry, pinDeckMaterial);
pinDeck.position.set(0, -0.05, -9);
pinDeck.receiveShadow = true;
scene.add(pinDeck);

// بناء وتوزيع الدبابيس (Pins) لجميع الممرات
const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
function createPin(x, z) {
    const pin = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.35, 24), pinMaterial);
    base.position.y = 0.18;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.6, 24), pinMaterial);
    body.position.y = 0.65;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), pinMaterial);
    head.position.y = 1.05;
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xcc0000 }));
    stripe.position.y = 0.9;
    
    pin.add(base, body, head, stripe);
    pin.position.set(x, 0, z);
    pin.traverse((obj) => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    scene.add(pin);
    return pin;
}

// توزيع الدبابيس للممر الأوسط والممرات الجانبية
const paths = [0, -7, 7];
paths.forEach(xOffset => {
    createPin(xOffset + 0, -8);
    createPin(xOffset - 0.35, -8.7); createPin(xOffset + 0.35, -8.7);
    createPin(xOffset - 0.7, -9.4); createPin(xOffset + 0, -9.4); createPin(xOffset + 0.7, -9.4);
    createPin(xOffset - 1.05, -10.1); createPin(xOffset - 0.35, -10.1); createPin(xOffset + 0.35, -10.1); createPin(xOffset + 1.05, -10.1);
});

// لوحة النتائج المتقدمة (Scoreboard Canvas)
const scoreCanvas = document.createElement('canvas');
scoreCanvas.width = 4096; scoreCanvas.height = 2048;
const ctx = scoreCanvas.getContext('2d');
ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, scoreCanvas.width, scoreCanvas.height);
ctx.fillStyle = '#00ff88'; ctx.font = 'bold 120px Arial'; ctx.fillText('BOWLING SCOREBOARD', scoreCanvas.width / 2, 180);
ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.strokeRect(150, 350, 3800, 900);

const startX = 150; const width = 3800; const frameWidth = width / 10;
for (let i = 1; i < 10; i++) {
    ctx.beginPath(); ctx.moveTo(startX + frameWidth * i, 250); ctx.lineTo(startX + frameWidth * i, 950); ctx.stroke();
}
ctx.fillStyle = '#ffffff'; ctx.font = '90px Arial';
for (let i = 0; i < 10; i++) ctx.fillText(`${i + 1}`, startX + frameWidth * i + frameWidth / 2, 500);
for (let i = 0; i < 10; i++) ctx.fillText('-', startX + frameWidth * i + frameWidth / 2, 900);
ctx.fillStyle = '#00ff88'; ctx.font = 'bold 140px Arial'; ctx.fillText('TOTAL SCORE : 0', scoreCanvas.width / 2, 1700);

const scoreTexture = new THREE.CanvasTexture(scoreCanvas);
scoreTexture.minFilter = THREE.LinearFilter; scoreTexture.magFilter = THREE.LinearFilter; scoreTexture.generateMipmaps = false;

const scoreboardGeometry = new THREE.BoxGeometry(12, 4.5, 0.2);
const scoreboardMaterial = new THREE.MeshBasicMaterial({ map: scoreTexture });
const scoreboard = new THREE.Mesh(scoreboardGeometry, scoreboardMaterial);
scoreboard.position.set(0, 4.5, -11);
scene.add(scoreboard);

const scoreboardLight = new THREE.PointLight(0xaaddff, 1, 15);
scoreboardLight.position.set(0, 4.5, -10);
scene.add(scoreboardLight);

const frameGeometry = new THREE.BoxGeometry(8.4, 3.4, 0.15);
const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
const frame = new THREE.Mesh(frameGeometry, frameMaterial);
frame.position.set(0, 4.5, -11.05);
scene.add(frame);


// ==========================================
// ثانياً: دمج كرتكِ الفيزيائية الذكية والتحكم
// ==========================================

// إنشاء الكرة (تم ضبط إحداثيات البداية لتتطابق مع بداية ممر صديقكِ)
const ballRadius = 0.5; // الحجم المتوافق مع الممر الجديد
const ballGeometry = new THREE.SphereGeometry(ballRadius, 64, 64); 
const ballMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xe63946, // كرتكِ الحمراء المميزة
    roughness: 0.1,  
    metalness: 0.1
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, ballRadius-0.02, 10); // وضعها فوق أرضية خط الخطأ تماماً
ball.castShadow = true;
ball.receiveShadow = true;
scene.add(ball);

// الاستماع لأحداث الكيبورد والتحكم الجانبي
window.addEventListener('keydown', (event) => {
    handleBallControl(event, ball, camera, initialCameraPos);
});

// حلقة التحريك الفيزيائية المشتركة
const timer = new THREE.Timer();

function animate() {
    requestAnimationFrame(animate);

    timer.update();
    const deltaTime = timer.getDelta();

    // استدعاء دالتكِ الفيزيائية لتحديث حركة الكرة والزوم السينمائي فوق الممر الجديد
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