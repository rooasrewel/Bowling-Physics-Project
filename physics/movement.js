// physics/movement.js
import * as THREE from 'three';

// المتغيرات الفيزيائية وحالة الكرة
export let velocity = new THREE.Vector3(0, 0, 0);     // السرعة الحالية
export let acceleration = new THREE.Vector3(0, 0, 0); // التسارع اللحظي
export let isLaunched = { value: false };             // كائن لتتبع حالة الرمي بشكل مرجعي ديناميكي

const frictionCoefficient = 0.05;                     // معامل الاحتكاك
const gravity = 9.81;                                 // الجاذبية الأرضية
const endOfTrack = -55;                               // حدود نهاية المسار
const originalFOV = 60;                               // زاوية الرؤية الأصلية

export function launchBall(initialForce) {
    acceleration.copy(initialForce);
    velocity.add(acceleration);
    isLaunched.value = true; // تم الرمي
    acceleration.set(0, 0, 0); // تصفير التسارع فوراً بعد الدفعة الأولى
}

// دالة التحكم بمدخلات الكيبورد (قبل الرمي)
export function handleBallControl(event, ball, camera, initialCameraPos) {
    if (!isLaunched.value) {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            if (ball.position.x > -5.0) ball.position.x -= 0.2;
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
            if (ball.position.x < 5.0) ball.position.x += 0.2;
        }
        if (event.key === ' ') {
            launchBall(new THREE.Vector3(0, 0, -24)); // إطلاق الكرة
        }

        // تحديث الكاميرا لتتبع الكرة أفقياً أثناء التوجيه وقبل الرمي
        camera.fov = originalFOV;
        camera.updateProjectionMatrix();
        camera.position.set(ball.position.x, 4, initialCameraPos.z);
        camera.lookAt(ball.position.x, ball.position.y, -20);
    }
}

// دالة تحديث الحركة الفيزيائية والزوم السينمائي في كل إطار
export function updateBallMovement(ball, camera, initialCameraPos, deltaTime) {
    if (!ball) return;

    // إذا تجاوزت الكرة نهاية المسار، تقف تماماً
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

        // الكاميرا تثبت في الخلف وتنظر باتجاه الكرة لرؤية التباطؤ
        camera.position.copy(initialCameraPos);
        camera.lookAt(ball.position.x, ball.position.y, ball.position.z);

        // عمل الـ Zoom In السينمائي عند الاقتراب من النهاية
        if (ball.position.z <= endOfTrack + 20) {
            if (camera.fov > 25) {
                camera.fov -= 1.0;
                camera.updateProjectionMatrix();
            }
        }
    }
}