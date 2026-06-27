// physics/pins.js
import * as THREE from 'three';

export class Pin {
    constructor(x, z) {
        // إنشاء مجموعة لدمج أجزاء القارورة المتقدمة
        this.mesh = new THREE.Group();

        const pinMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        
        // 1. قاعدة القارورة
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.35, 24), pinMaterial);
        base.position.y = 0.18;
        
        // 2. جسم القارورة
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.6, 24), pinMaterial);
        body.position.y = 0.65;
        
        // 3. رأس القارورة الكروي
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), pinMaterial);
        head.position.y = 1.05;
        
        // 4. الخط الأحمر الشهير في عنق القارورة
        const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xcc0000 }));
        stripe.position.y = 0.9;

        // دمج الأجزاء كلها داخل المجموعة
        this.mesh.add(base, body, head, stripe);

        // تعديل موضع القارورة: رفع الـ Y إلى 0.5 ليتطابق مركز ثقلها تماماً مع مركز الكرة (Y=0.5) عند التدحرج!
        this.mesh.position.set(x, 0.5, z);
        
        // تفعيل الظلال لجميع الأجزاء
        this.mesh.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        this.mass = 1;
        this.fallen = false;
    }

    fall(forceVector) {
        if (this.fallen) return;
        this.fallen = true;

        // تدوير القارورة بناءً على اتجاه وقوة صدمة الكرة
        this.mesh.rotation.z = -forceVector.x * 0.2;
        this.mesh.rotation.x = forceVector.z * 0.2;

        // إزاحة واقعية خفيفة على محاور الأرضية
        this.mesh.position.x += forceVector.x * 0.05;
        this.mesh.position.z += forceVector.z * 0.05;
        
        // خفض القارورة لتصبح مستلقية بالكامل على الممر
        this.mesh.position.y = 0.15; 
    }
}