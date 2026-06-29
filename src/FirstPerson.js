import * as THREE from 'three';
// إنشاء المشهد
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
// إنشاء الكاميرا
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// تحديد مكان الكاميرا
camera.position.set(0, 4.5, 19);
camera.lookAt(0, 1, -5); 

// إنشاء Renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // تمكين الظلال
// تحديد حجم الشاشة
renderer.setSize(window.innerWidth, window.innerHeight);

// إضافة الرسم إلى الصفحة
document.body.appendChild(renderer.domElement);
//اضافة حلقة الرسم
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
// شكل الارضية
const laneGeometry = new THREE.BoxGeometry(4, 0.2, 20);
// مادة الارضية
const laneMaterial = new THREE.MeshStandardMaterial({
    color: 0xc68642,
    roughness: 0.3,
    metalness: 0.1
});
//دمجهم
const lane = new THREE.Mesh(laneGeometry, laneMaterial);
// وضع الارضية في المكان الصح
lane.position.set(0, -0.1, 0);
// إضافة الارضية إلى المشهد
lane.receiveShadow = true; 
scene.add(lane);

// الممر الأيسر
const leftLane = new THREE.Mesh(
    laneGeometry,
    laneMaterial
);

leftLane.position.set(-7, -0.1, 0);
leftLane.receiveShadow = true;

scene.add(leftLane);

// الممر الأيمن
const rightLane = new THREE.Mesh(
    laneGeometry,
    laneMaterial
);

rightLane.position.set(7, -0.1, 0);
rightLane.receiveShadow = true;

scene.add(rightLane);

// المرر الجانبي للملعب
const gutterGeometry = new THREE.BoxGeometry(0.5, 0.15, 20);

const gutterMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444
});

const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
leftGutter.position.set(-2.25, -0.12, 0);

const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
rightGutter.position.set(2.25, -0.12, 0);

scene.add(leftGutter);
scene.add(rightGutter);

// مجاري الممر الأيسر
const leftLaneGutter1 = new THREE.Mesh(
    gutterGeometry,
    gutterMaterial
);

leftLaneGutter1.position.set(-7.75, -0.12, 0);

const leftLaneGutter2 = new THREE.Mesh(
    gutterGeometry,
    gutterMaterial
);

leftLaneGutter2.position.set(-3.25, -0.12, 0);

scene.add(leftLaneGutter1);
scene.add(leftLaneGutter2);

// مجاري الممر الأيمن
const rightLaneGutter1 = new THREE.Mesh(
    gutterGeometry,
    gutterMaterial
);

rightLaneGutter1.position.set(3.25, -0.12, 0);

const rightLaneGutter2 = new THREE.Mesh(
    gutterGeometry,
    gutterMaterial
);

rightLaneGutter2.position.set(7.75, -0.12, 0);

scene.add(rightLaneGutter1);
scene.add(rightLaneGutter2);

// مكان وقوف اللاعب 
const approachGeometry = new THREE.BoxGeometry(6, 0.2, 4);

const approachMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9b382,
    roughness: 0.4
});

const approach = new THREE.Mesh(
    approachGeometry,
    approachMaterial
);

approach.position.set(0, -0.1, 12);

approach.receiveShadow = true;

scene.add(approach);
// خط فاصل بين الملعب ومكان وقوف اللاعب
const lineGeometry = new THREE.BoxGeometry(4, 0.02, 0.1);

const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

const foulLine = new THREE.Mesh(
    lineGeometry,
    lineMaterial
);

foulLine.position.set(0, 0.02, 10);

scene.add(foulLine);

// أرضية الصالة
const floorGeometry = new THREE.BoxGeometry(28, 0.1, 35);

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.8
});

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
);

floor.position.set(0, -0.25, 2);

floor.receiveShadow = true;

scene.add(floor);

// الجدار الأيسر
 const leftWallGeometry = new THREE.BoxGeometry(0.5, 6, 35);

const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0d0d0
});

const leftWall = new THREE.Mesh(
    leftWallGeometry,
    wallMaterial
);

leftWall.position.set(-13, 3, 2);

leftWall.receiveShadow = true;

scene.add(leftWall);

// الجدار الأيمن
const rightWall = new THREE.Mesh(
    leftWallGeometry,
    wallMaterial
);

rightWall.position.set(13, 3, 2);

rightWall.receiveShadow = true;

scene.add(rightWall);

// السقف
const ceilingGeometry = new THREE.BoxGeometry(28, 0.3, 35);

const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0
});

const ceiling = new THREE.Mesh(
    ceilingGeometry,
    ceilingMaterial
);

ceiling.position.set(0, 6, 2);

ceiling.receiveShadow = true;

scene.add(ceiling);

// خامة المصباح
const lightPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffee,
    emissive: 0xffffcc,
    emissiveIntensity: 1
});

function createCeilingLight(z) {

    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.05, 3),
        lightPanelMaterial
    );

    panel.position.set(0, 5.8, z);

    scene.add(panel);

    return panel;
}

createCeilingLight(10);
createCeilingLight(4);
createCeilingLight(-2);
createCeilingLight(-8);

const ceilingLight = new THREE.PointLight( // لزيادة لمعان المصابيح
    0xffffff,
    1.5,
    30
);

ceilingLight.position.set(0, 5.5, 0);

scene.add(ceilingLight);

//اضافة اضاءة
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 8);

directionalLight.castShadow = true;

scene.add(directionalLight);
//انشاء شكل الكرة
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
//مادة الكرة
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x0044ff,
    roughness: 0.2,
    metalness: 0.5
});
// انشاء الكرة 
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
// وضع الكرة في المكان الصح
ball.position.set(0, 0.5 , 10);
// إضافة الكرة إلى المشهد
ball.castShadow = true;
ball.receiveShadow = true; //ظل الكرة
scene.add(ball);
// انشاء شكل الدبابيس
const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3
});

function createPin(x, z) {

    const pin = new THREE.Group();

    // القاعدة
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.25, 0.35, 24),
        pinMaterial
    );

    base.position.y = 0.18;

    // الجسم
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.18, 0.6, 24),
        pinMaterial
    );

    body.position.y = 0.65;

    // الرأس
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 24, 24),
        pinMaterial
    );

    head.position.y = 1.05;

    // الحلقة الحمراء
    const stripe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.08, 24),
        new THREE.MeshStandardMaterial({
            color: 0xcc0000
        })
    );

    stripe.position.y = 0.9;

    pin.add(base);
    pin.add(body);
    pin.add(head);
    pin.add(stripe);

    pin.position.set(x, 0, z);

    pin.traverse((obj) => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    scene.add(pin);

    return pin;
}

const pinSpacing = 0.7;

createPin(0, -8);

createPin(-0.35, -8.7);
createPin(0.35, -8.7);

createPin(-0.7, -9.4);
createPin(0, -9.4);
createPin(0.7, -9.4);

createPin(-1.05, -10.1);
createPin(-0.35, -10.1);
createPin(0.35, -10.1);
createPin(1.05, -10.1);

// دبابيس الممر الأيسر
createPin(-7, -8);

createPin(-7.35, -8.7);
createPin(-6.65, -8.7);

createPin(-7.7, -9.4);
createPin(-7.0, -9.4);
createPin(-6.3, -9.4);

createPin(-8.05, -10.1);
createPin(-7.35, -10.1);
createPin(-6.65, -10.1);
createPin(-5.95, -10.1);

// دبابيس الممر الأيمن
createPin(7, -8);

createPin(7.35, -8.7);
createPin(6.65, -8.7);

createPin(7.7, -9.4);
createPin(7.0, -9.4);
createPin(6.3, -9.4);

createPin(8.05, -10.1);
createPin(7.35, -10.1);
createPin(6.65, -10.1);
createPin(5.95, -10.1);

// جدار خلف الدبابيس
const backWallGeometry = new THREE.BoxGeometry(8, 4, 0.3);

const backWallMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555
});

const backWall = new THREE.Mesh(
    backWallGeometry,
    backWallMaterial
);

backWall.position.set(0, 2, -11.5);

backWall.receiveShadow = true;

scene.add(backWall);

// لوحة النتائج
const scoreCanvas = document.createElement('canvas'); //نشاء كانفاس لعرض النتيجة عليه
scoreCanvas.width = 4096;
scoreCanvas.height = 2048;

const ctx = scoreCanvas.getContext('2d');
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// خلفية الشاشة
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, scoreCanvas.width, scoreCanvas.height);

// عنوان اللوحة
ctx.fillStyle = '#00ff88';
ctx.font = 'bold 120px Arial';

ctx.fillText(
    'BOWLING SCOREBOARD',
    scoreCanvas.width / 2,
    180
);

// رسم الإطار الخارجي
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 8;

ctx.strokeRect(
    150,
    350,
    3800,
    900
);

// تقسيم 10 إطارات
const startX = 150;
const width = 3800;
const frameWidth = width / 10;

for (let i = 1; i < 10; i++) {

    ctx.beginPath();

    ctx.moveTo(
        startX + frameWidth * i,
        250
    );

    ctx.lineTo(
        startX + frameWidth * i,
        950
    );

    ctx.stroke();
}

// أرقام الإطارات
ctx.fillStyle = '#ffffff';
ctx.font = '90px Arial';

for (let i = 0; i < 10; i++) {

    ctx.fillText(
        `${i + 1}`,
        startX + frameWidth * i + frameWidth / 2,
        500
    );
}

// نتائج تجريبية
ctx.font = '110px Arial';

for (let i = 0; i < 10; i++) {

    ctx.fillText(
        '-',
        startX + frameWidth * i + frameWidth / 2,
        900
    );
}

// المجموع الكلي
ctx.fillStyle = '#00ff88';
ctx.font = 'bold 140px Arial';

ctx.fillText(
    'TOTAL SCORE : 0',
    scoreCanvas.width / 2,
    1700
);

const scoreTexture = new THREE.CanvasTexture(scoreCanvas);

scoreTexture.minFilter = THREE.LinearFilter;
scoreTexture.magFilter = THREE.LinearFilter;
scoreTexture.generateMipmaps = false;

const scoreboardGeometry = new THREE.BoxGeometry(12, 4.5, 0.2);

const scoreboardMaterial = new THREE.MeshBasicMaterial({
    map: scoreTexture
});

const scoreboard = new THREE.Mesh(
    scoreboardGeometry,
    scoreboardMaterial
);

scoreboard.position.set(0, 4.5, -11);

scene.add(scoreboard);

const scoreboardLight = new THREE.PointLight(
    0xaaddff,
    1,
    15
);

scoreboardLight.position.set(0, 4.5, -10);

scene.add(scoreboardLight);

// إطار اللوحة
const frameGeometry = new THREE.BoxGeometry(8.4, 3.4, 0.15);

const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666
});

const frame = new THREE.Mesh(
    frameGeometry,
    frameMaterial
);

frame.position.set(0, 4.5, -11.05);

scene.add(frame);

// ارضية خلف الدبابيس
const pinDeckGeometry = new THREE.BoxGeometry(5, 0.15, 2);

const pinDeckMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0c28a
});

const pinDeck = new THREE.Mesh(
    pinDeckGeometry,
    pinDeckMaterial
);

pinDeck.position.set(0, -0.05, -9);

pinDeck.receiveShadow = true;

scene.add(pinDeck);

