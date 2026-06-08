// physics/movement.js
import * as THREE from 'three';

// المتغيرات الفيزيائية وحالة الكرة
export let velocity = new THREE.Vector3(0, 0, 0);     // السرعة الحالية
export let acceleration = new THREE.Vector3(0, 0, 0); // التسارع اللحظي
export let isLaunched = { value: false };             // كائن لتتبع حالة الرمي بشكل مرجعي ديناميكي

const frictionCoefficient = 0.05;                     // معامل الاحتكاك
const gravity = 9.81;                                 // الجاذبية الأرضية
const endOfTrack = -10;                               // حدود نهاية المسار عند الدبابيس في الصالة الجديدة
const originalFOV = 75;                               // زاوية الرؤية المعتمدة في الصالة الجديدة

export function launchBall(initialForce) {
    acceleration.copy(initialForce);
    velocity.add(acceleration);
    isLaunched.value = true; // تم الرمي
    acceleration.set(0, 0, 0); // تصفير التسارع فوراً بعد الدفعة الأولى
}

// دالة التحكم بمدخلات الكيبورد (قبل الرمي) - مسؤولية التوجيه والكاميرا الابتدائية
export function handleBallControl(event, ball, camera, initialCameraPos) {
    if (!isLaunched.value) {
        // ضبط الحدود الجانبية لتناسب عرض الممر الأوسط الجديد (عرضه 4، أي من -1.8 إلى 1.8 مع حساب حجم الكرة)
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            if (ball.position.x > -1.7) ball.position.x -= 0.15;
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
            if (ball.position.x < 1.7) ball.position.x += 0.15;
        }
        if (event.key === ' ') {
            launchBall(new THREE.Vector3(0, 0, -18)); // إطلاق الكرة بسرعة مناسبة لطول الممر الجديد
        }

        // تحديث الكاميرا لتتبع الكرة أفقياً أثناء التوجيه وقبل الرمي
        camera.fov = originalFOV;
        camera.updateProjectionMatrix();
        camera.position.set(ball.position.x, initialCameraPos.y, initialCameraPos.z);
        camera.lookAt(ball.position.x, 1, -5);
    }
}

// دالة تحديث الحركة الفيزيائية والزوم السينمائي في كل إطار - مسؤولية الكاميرا والكرة
export function updateBallMovement(ball, camera, initialCameraPos, deltaTime) {
    if (!ball) return;

    // إذا تجاوزت الكرة نهاية المسار عند الدبابيس، تقف تماماً
    if (ball.position.z <= endOfTrack) {
        velocity.set(0, 0, 0);
        return;
    }

    if (isLaunched.value) {
        // تطبيق قوة الاحتكاك لإبطاء الكرة تدريجياً
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

        // تحديث الموقع بناءً على السرعة والزمن
        ball.position.x += velocity.x * deltaTime;
        ball.position.z += velocity.z * deltaTime;

        // --- حركة الكاميرا والزوم السينمائي المشترك ---
        // الكاميرا تلحق بالكرة على محور Z لتأثير سينمائي، مع الحفاظ على ارتفاعها
        let targetCamZ = ball.position.z + 8; 

        // [تعديل الحدود]: منع الكاميرا من التقدم أكثر من النقطة Z = 3 حتى لا تخترق اللوحة الخلفية
        if (targetCamZ < 3) {
            targetCamZ = 3;
        }

        camera.position.set(ball.position.x * 0.5, initialCameraPos.y, targetCamZ);
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

        // عمل زوم بصري ناعم إضافي (FOV) عند الاقتراب من الدبابيس لمشاهدة الاصطدام بوضوح
        if (ball.position.z <= endOfTrack + 8) {
            if (camera.fov > 45) {
                camera.fov -= 0.5;
                camera.updateProjectionMatrix();
            }
        }
    }
}