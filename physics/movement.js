// physics/movement.js
import * as THREE from 'three';

// 1. تعريف المتغيرات الفيزيائية الأساسية للحركة وثباتها
export let velocity = new THREE.Vector3(0, 0, 0);     // السرعة الابتدائية للكرة في الأبعاد الثلاثة
export let acceleration = new THREE.Vector3(0, 0, 0); // التسارع الناتج عن قوة الرمي
const frictionCoefficient = 0.05;                     // معامل الاحتكاك الخاص بأرضية مسار البولينغ

/**
 * دالة إطلاق أو رمي الكرة (قوة ابتدائية لحظية)
 * @param {THREE.Vector3} initialForce - متجه القوة المطبق على الكرة عند الرمي
 */
export function launchBall(initialForce) {
    // بناءً على قانون نيوتن الثاني: القوة تعطي تسارعاً لحظياً (بفرض الكتلة = 1)
    acceleration.copy(initialForce);
    velocity.add(acceleration);
    
    // تصفير التسارع فوراً بعد الدفعة الأولى لتستمر الكرة تحت تأثير سرعتها واحتكاك الأرضية فقط
    acceleration.set(0, 0, 0);
}

/**
 * دالة تحديث الحركة الفيزيائية للكرة في كل إطار (Frame)
 * @param {THREE.Mesh} ball - مجسم الكرة ثلاثي الأبعاد القادم من الشخص الأول
 * @param {number} deltaTime - الوقت الفاصل المنقضي بين كل إطار والآخر لضمان ثبات السرعة
 */
export function updateBallMovement(ball, deltaTime) {
    if (!ball) return;

    // 2. تطبيق قوة الاحتكاك لإبطاء الكرة تدريجياً
    // الاحتكاك يعمل دائماً بعكس اتجاه الحركة الحالية للكرة
    if (velocity.lengthSq() > 0.001) { 
        // نقوم بعمل نسخة من اتجاه السرعة، وتصغيره بناءً على معامل الاحتكاك والزمن الفاصل
        let friction = velocity.clone().normalize().multiplyScalar(-frictionCoefficient * deltaTime);
        velocity.add(friction);
    } else {
        // إيقاف الكرة تماماً إذا أصبحت سرعتها قريبة جداً من الصفر لمنع الاهتزاز اللانهائي
        velocity.set(0, 0, 0);
    }

    // 3. تحديث موقع الكرة بناءً على السرعة المتبقية والزمن (المسافة = السرعة × الزمن)
    ball.position.x += velocity.x * deltaTime;
    ball.position.z += velocity.z * deltaTime; // الحركة الأساسية لمسار البولينغ تكون على المحور Z وعرضياً على X
}