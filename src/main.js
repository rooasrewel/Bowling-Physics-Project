import * as THREE from 'three';
import { launchBall, updateBallMovement, velocity } from '../physics/movement.js';

// 1. إنشاء المشهد والكاميرا والمنشئ بكامل حجم الشاشة
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e17); // خلفية داكنة مريحة للعين

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// ضبط موقع الكاميرا ليكون مرتفعاً قليلاً وخلف الكرة تماماً لرؤية الحركة بوضوح
camera.position.set(0, 4, 12); 

const renderer = new THREE.WebGLRenderer({ antialias: true }); // تفعيل تنعيم الحواف ليكون المشهد ممتازاً
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. إضافة إضاءة واقعية (إضاءة موجهة Directional مع إضاءة محيطية)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // إضاءة خفيفة للمشهد ككل
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2); // إضاءة قوية كالشمس لإظهار الأبعاد ثلاثية الأبعاد
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// 3. إنشاء كرة بولينغ تجريبية واضحة وكبيرة (بحجم نصف قطر 1.5 بدلاً من 1)
const geometry = new THREE.SphereGeometry(1.5, 64, 64); // زيادة التفاصيل لتكون الكرة ناعمة ودائرية تماماً
// استخدام MeshStandardMaterial لكي تتفاعل الكرة مع الإضاءة والظلال بشكل واقعي
const material = new THREE.MeshStandardMaterial({ 
    color: 0xe63946, // لون أحمر زاهي
    roughness: 0.2,  // جعل الكرة لامعة ومصقولة مثل كرات البولينغ الحقيقية
    metalness: 0.1
});
const ball = new THREE.Mesh(geometry, material);
scene.add(ball);

// 4. إنشاء أرضية مسار ممتدة وواضحة جداً
const floorGeo = new THREE.PlaneGeometry(20, 100);
const floorMat = new THREE.MeshStandardMaterial({ 
    color: 0xEEDC82, // أرضية رمادية داكنة متباينة مع الكرة حمراء
    roughness: 0.5 
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2; // تدوير الأرضية لتصبح أفقية
floor.position.y = -1.5; // إنزال الأرضية لتلامس أسفل الكرة تماماً
scene.add(floor);

// 5. إطلاق الكرة بقوة مدروسة للأمام (على محور Z) وجانبياً قليلاً جداً لترى الانحراف والتوقف
launchBall(new THREE.Vector3(0.5, 0, -40)); 

// 6. حلقة التحريك والفيزياء
const timer = new THREE.Timer();

function animate() {
    requestAnimationFrame(animate);

    timer.update();
    const deltaTime = timer.getDelta();

    // استدعاء الكود الفيزيائي لتحديث الحركة
    updateBallMovement(ball, deltaTime);

    // [إضافة]: إذا انعدمت سرعة الكرة تماماً (توقفت بفعل الاحتكاك)، أعدها لنقطة البداية وأطلقها مجدداً
    if (velocity.lengthSq() === 0) {
        ball.position.set(0, 0, 0);       // إعادة الكرة لنقطة الصفر (البرواز الابتدائى)
        launchBall(new THREE.Vector3(0.8, 0, -25)); // إعادة إطلاقها بنفس القوة
    }

    // جعل الكاميرا تتبع الكرة
    if (ball.position.z > -40) {
        camera.position.z = ball.position.z + 12;
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);
    } else if (velocity.lengthSq() === 0) {
        // إعادة الكاميرا أيضاً لموقعها الأصلي عند إعادة تصفير الكرة
        camera.position.set(0, 4, 12);
    }

    renderer.render(scene, camera);
}

// 7. تحديث أبعاد المشهد تلقائياً عند تغيير حجم نافذة المتصفح
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();