// physics/movement.js
import * as THREE from 'three';
// استيراد دوال التحكم بالواجهة من ملف الـ UI الفارغ لديكِ
import { initPowerGaugeUI, updatePowerGaugeUI, hidePowerGaugeUI } from '../ui/interface.js';

// المتغيرات الفيزيائية وحالة الكرة (تم الحفاظ عليها تماماً كما هي عندكِ)
export let velocity = new THREE.Vector3(0, 0, 0);     // السرعة الحالية
export let acceleration = new THREE.Vector3(0, 0, 0); // التسارع اللحظي
export let isLaunched = { value: false };             // كائن لتتبع حالة الرمي بشكل مرجعي ديناميكي

// متغيرات إضافية تم إدخالها لحساب شحن القوة والسقوط الحر
let spacePressedTime = 0;
let isCharging = false;
let verticalVelocity = 0;       // السرعة العمودية الخاصة بالسقوط والارتداد

// الثوابت (تم الحفاظ على ثوابتكِ مع إضافة ثوابت المحاكاة الجديدة)
const frictionCoefficient = 0.05;                     // معامل الاحتكاك الخاص بكِ
const gravity = 9.81;                                 // الجاذبية الأرضية الخاصة بكِ
const endOfTrack = -10;                               // حدود نهاية المسار عند الدبابيس الخاصة بكِ
const originalFOV = 75;                               // زاوية الرؤية المعتمدة الخاصة بكِ

const initialHeightY = 1.2;                           // الارتفاع الابتدائي لمحاكاة إمساك اللاعب بالكرة
const bounceFactor = 0.25;                            // معامل الارتداد لقفزة الكرة عند الارتطام

// تهيئة تراكيب الواجهة الرسومية لمقياس القوة فور تحميل الملف
initPowerGaugeUI();

export function launchBall(initialForce) {
    acceleration.copy(initialForce);
    velocity.add(acceleration);
    isLaunched.value = true; // تم الرمي
    acceleration.set(0, 0, 0); // تصفير التسارع فوراً بعد الدفعة الأولى
}

// دالة التحكم بمدخلات الكيبورد - تمت إضافة حسابات شحن المؤشر ديناميكياً
export function handleBallControl(event, ball, camera, initialCameraPos) {
    if (!isLaunched.value) {
        // ضبط الحدود الجانبية المعتمدة في كودكِ الأصلي
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            if (ball.position.x > -1.7) ball.position.x -= 0.15;
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
            if (ball.position.x < 1.7) ball.position.x += 0.15;
        }

        // منطق شحن القوة المطور عند الضغط المستمر على زر المسافة
        if (event.key === ' ' || event.code === 'Space') {
            if (!isCharging) {
                isCharging = true;
                spacePressedTime = performance.now();
            } else {
                // احتساب مدة الضغط وتحديث ملف الـ UI بصرياً
                const duration = (performance.now() - spacePressedTime) / 1000;
                let chargePercentage = (duration / 1.2) * 100; // امتلاء كامل خلال 1.2 ثانية
                if (chargePercentage > 100) chargePercentage = 100;
                
                updatePowerGaugeUI(chargePercentage);
            }
        }

        // تحديث الكاميرا لتتبع الكرة أفقياً أثناء التوجيه وقبل الرمي (كودكِ الأصلي كاملاً)
        camera.fov = originalFOV;
        camera.updateProjectionMatrix();
        camera.position.set(ball.position.x, initialCameraPos.y, initialCameraPos.z);
        camera.lookAt(ball.position.x, 1, -5);
    }
}

// مستمع خارجي مستقل لالتقاط لحظة رفع الإصبع عن زر المسافة لإطلاق الكرة بقوة متغيرة
window.addEventListener('keyup', (event) => {
    if ((event.key === ' ' || event.code === 'Space') && isCharging && !isLaunched.value) {
        isCharging = false;

        const duration = (performance.now() - spacePressedTime) / 1000;
        
        // تعديل السرعات لتكون متزنة بصرياً (الحد الأدنى -7 والحد الأقصى -14 م/ث)
        let calculatedSpeedZ = -5 - (duration * 4.5);
        if (calculatedSpeedZ < -10) calculatedSpeedZ = -10;

        window.currentBallMesh.position.y = initialHeightY;
        hidePowerGaugeUI();

        // إطلاق الكرة بالقيم الجديدة لتعطي المسافة حقها الطبيعي
        launchBall(new THREE.Vector3(0.5, 0, calculatedSpeedZ));
    }
});

// دالة تحديث الحركة الفيزيائية والزوم السينمائي في كل إطار
// دالة تحديث الحركة الفيزيائية والزوم السينمائي في كل إطار
export function updateBallMovement(ball, camera, initialCameraPos, deltaTime) {
    if (!ball) return;
    
    // حفظ إشارة مرجعية للكرة لكي يلتقطها مستمع الـ Keyup الخارجي بسلام
    window.currentBallMesh = ball;

    // إذا تجاوزت الكرة نهاية المسار عند الدبابيس، تقف تماماً (كودكِ الأصلي)
    if (ball.position.z <= endOfTrack) {
        velocity.set(0, 0, 0);
        return;
    }

    if (!isLaunched.value) {
        // قبل الرمي: جعل الكرة تطفو/تهتز ببطء شديد في الهواء لإعطاء إيحاء بأن اللاعب يحملها بيده
        ball.position.y = initialHeightY + Math.sin(performance.now() * 0.005) * 0.01;
        return;
    }

    if (isLaunched.value) {
        const ballRadius = ball.geometry.parameters.radius || 0.5;
        const floorY = ballRadius - 0.02;

        // 1. فيزياء السقوط العمودي والارتداد المتناقص (محور Y)
        if (ball.position.y > floorY || Math.abs(verticalVelocity) > 0.1) {
            verticalVelocity -= gravity * deltaTime;
            ball.position.y += verticalVelocity * deltaTime;

            // عند الارتطام بالأرضية اللامعة
            if (ball.position.y <= floorY) {
                ball.position.y = floorY;
                verticalVelocity = -verticalVelocity * bounceFactor; // عكس اتجاه الحركة لإنتاج ارتداد متخامد
                if (Math.abs(verticalVelocity) < 0.1) verticalVelocity = 0;
            }
        }

        // 2. تطبيق قوة الاحتكاك لإبطاء الكرة تدريجياً (كودكِ الأصلي كاملاً)
        if (velocity.lengthSq() > 0.001) { 
            let frictionMagnitude = frictionCoefficient * gravity * deltaTime;
            let friction = velocity.clone().normalize().multiplyScalar(-frictionMagnitude);
            
            if (velocity.length() <= friction.length()) {
                velocity.set(0, 0, 0);
            } else {
                velocity.add(friction);
            }
        } else {
            velocity.set(0, 0, 0);
        }

        // 3. تطبيق حركة المسار المنحني (The Hook) بعد منتصف الممر
        if (velocity.z !== 0) {
            if (ball.position.z < 2) { 
                velocity.x -= 1.5 * deltaTime; // سحب تدريجي جانبي لمحاكاة دوران الكرة والـ Hook
            }
        }

        // تحديث الموقع بناءً على السرعة المدمجة الجديدة والزمن
        ball.position.x += velocity.x * deltaTime;
        ball.position.z += velocity.z * deltaTime;

        // 4. حركة الكاميرا والزوم السينمائي المشترك (تم تحسين الإحساس بالمسافة والعمق دون تغيير الأساس)
        // زيادة المسافة الطردية الخلفية قليلاً إلى 9.5 لتوسيع مدى زاوية رؤية طول الممر بصرياً
        let targetCamZ = ball.position.z + 9.5; 

        if (targetCamZ < 3) {
            targetCamZ = 3; // منع الكاميرا من اختراق اللوحة الخلفية
        }

        // استخدام التنعيم الخطي (lerp) بمعامل ناعم (0.035) لتتأخر الكاميرا بذكاء في البداية وتترك الكرة تبتعد معطيةً إيحاءً حقيقياً بالعمق وطول المضمار
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, initialCameraPos.y + (ball.position.y * 0.2), 0.035);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, ball.position.x * 0.5, 0.035);
        
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

        // عمل زوم بصري ناعم إضافي (FOV) عند الاصطدام بالدبابيس (كودكِ الأصلي كاملاً)
        if (ball.position.z <= endOfTrack + 8) {
            if (camera.fov > 45) {
                camera.fov -= 0.5;
                camera.updateProjectionMatrix();
            }
        }
    }
}