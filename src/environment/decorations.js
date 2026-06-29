import * as THREE from 'three';

export function createDecorations(scene) {

    // رف كرات البولينغ 

    const rack = new THREE.Group();

    // قاعدة كبيرة (طابقين)
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.4, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x3b2f2f })
    );
    base.position.y = 0.2;
    rack.add(base);

    // الطابق الثاني (رف علوي)
    const upperBase = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.3, 1.3),
        new THREE.MeshStandardMaterial({ color: 0x2a1f1f })
    );
    upperBase.position.y = 0.9;
    rack.add(upperBase);

    // أرجل دعم
    const legGeo = new THREE.BoxGeometry(0.25, 1.2, 0.25);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    const positions = [
        [-1.8, 0.6, -0.6],
        [1.8, 0.6, -0.6],
        [-1.8, 0.6, 0.6],
        [1.8, 0.6, 0.6]
    ];

    positions.forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        rack.add(leg);
    });

    // كرات بولينغ 
    const ballGeo = new THREE.SphereGeometry(0.25, 20, 20);

    const colors = [0xff0000, 0x0044ff, 0x00cc44, 0xffaa00, 0xffffff, 0x8800ff];

    for (let i = 0; i < 6; i++) {

        const ball = new THREE.Mesh(
            ballGeo,
            new THREE.MeshStandardMaterial({
                color: colors[i % colors.length]
            })
        );

        // توزيع على مستويين (شكل طابقين)
        const row = Math.floor(i / 3);
        const col = i % 3;

        ball.position.set(
    -0.8 + col * 0.8,
    0.75 + row * 0.6,
    0.0
);

        rack.add(ball);
    }

    // مكان الرف داخل الصالة 
    rack.position.set(10, 0, 11);

    scene.add(rack);

    // مقاعد اللاعبين

function createBench(x, z) {

    const bench = new THREE.Group();

    // قاعدة المقعد
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.3, 1),
        new THREE.MeshStandardMaterial({ color: 0x4a4a4a })
    );
    seat.position.y = 0.5;
    bench.add(seat);

    // ظهر المقعد
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x3a3a3a })
    );
    back.position.set(0, 1.1, -0.4);
    bench.add(back);

    // أرجل المقعد
    const legGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    const positions = [
        [-1.6, 0.25, 0.4],
[1.6, 0.25, 0.4],
[-1.6, 0.25, -0.4],
[1.6, 0.25, -0.4]
    ];

    positions.forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        bench.add(leg);
    });

    // مكان المقعد في الصالة
    bench.position.set(x, 0.2, z);
bench.rotation.y = x > 0 ? -0.25 : 0.25;

    scene.add(bench);
}
//مقاعد يسار 
createBench(-11, 2);
createBench(-11, 7);
//مقاعد يمين
createBench(11, 2);
createBench(11, 7);

// =========================
// 🏛️ أعمدة الصالة
// =========================

function createColumn(x, z) {

    const column = new THREE.Group();

    // جسم العمود
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 6, 16),
        new THREE.MeshStandardMaterial({ color: 0xdcdcdc })
    );
    body.position.y = 3;
    column.add(body);

    // قاعدة العمود
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.3, 1),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    base.position.y = 0.15;
    column.add(base);

    // رأس العمود
    const top = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.3, 1),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    top.position.y = 6.15;
    column.add(top);

    column.position.set(x, 0, z);

    scene.add(column);
 

}
   // أعمدة الجهة اليسار
createColumn(-12, -5);
createColumn(-12, 0);
createColumn(-12, 5);

// أعمدة الجهة اليمين
createColumn(12, -5);
createColumn(12, 0);
createColumn(12, 5);

//لوحة خلفية (حائط خلفي)
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(10, 6, 0.5),
    new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.8
    })
);

backWall.position.set(0, 3, -12);
scene.add(backWall);
//لوحة جانبية (حائط جانبي)  
function createSign(text, x, y, z, color = 0xff00ff) {

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 128);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        emissive: color
    });

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 2),
        material
    );

    mesh.position.set(x, y, z);

    scene.add(mesh);
}
createSign("STRIKE ZONE", 0, 4, -11);
createSign("LET'S BOWL", -9, 3, -8, 0x00ffff);
createSign("GOOD TIMES", 9, 3, -8, 0xff8800);

// خطين ليد على المرر
function createLEDLine(x) {

    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.05, 20),
        new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 2
        })
    );

    line.position.set(x, 0.05, 0);
    scene.add(line);
}

createLEDLine(-1.8);
createLEDLine(1.8);
}