import * as THREE from 'three';

export function detectCollision(ball, pins, delta) {
    // 1. حماية تمنع توقف الكود إذا لم تكن الدلتا أو الكرة أو الدبابيس جاهزة بعد
    if (!delta || delta <= 0 || !ball || !pins || !Array.isArray(pins)) return;

    // 2. قراءة موضع الكرة بأي اسم معرّفة به (سواء ball مباشرة أو ball.mesh)
    const ballPos = ball.position || (ball.mesh ? ball.mesh.position : null);
    if (!ballPos) return;

    // 3. قراءة سرعة الكرة بأي اسم معرّفة به
    const ballVelocity = ball.velocity || ball.currentVelocity;
    if (!ballVelocity) return;

    pins.forEach(pin => {
        // حماية للتأكد من أن كائن الدبوس متاح وله مجسم
        if (!pin || pin.fallen) return;
        const pinMesh = pin.mesh || pin;
        if (!pinMesh || !pinMesh.position) return;

        const pinPos = pinMesh.position;
        const distance = ballPos.distanceTo(pinPos);

        // مسافة التصادم الآمنة
        if (distance < 0.45) {
            const vi = ballVelocity.length();
            if (vi < 0.1) return; // إذا كانت الكرة شبه متوقفة

            const vf = vi * 0.6; // إبطاء الكرة
            const force = ((ball.mass || 7) * (vi - vf)) / delta;

            const direction = new THREE.Vector3().subVectors(pinPos, ballPos).normalize();
            const cappedForce = Math.min(force, 15); // حماية من الطيران العشوائي
            const forceVector = direction.clone().multiplyScalar(cappedForce);

            // استدعاء دالة السقوط إذا كانت معرفة، أو إسقاط الدبوس فيزيائياً فوراً
            if (typeof pin.fall === 'function') {
                pin.fall(forceVector);
            } else {
                pinMesh.rotation.z = -forceVector.x * 0.2;
                pinMesh.rotation.x = forceVector.z * 0.2;
                pin.fallen = true;
            }

            // تطبيق الإبطاء على سرعة الكرة
            ballVelocity.multiplyScalar(0.6);
        }
    });
}