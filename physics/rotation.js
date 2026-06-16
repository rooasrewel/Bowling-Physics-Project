export function updatePhysics(state) {

  const {
    ball,
    position,
    velocity,
    omega,
    torque,
    dt,
    r,
    m,
    I,
    friction,
    floorFriction
  } = state;

  // =========================
  // 1. الاحتكاك الخطي (Linear Friction)
  // =========================
  velocity.x *= floorFriction;
  velocity.z *= floorFriction;

  // =========================
  // 2. الاحتكاك الزاوي (Angular Friction)
  // =========================
  omega.x *= friction;
  omega.y *= friction;
  omega.z *= friction;

  // =========================
  // 3. العزم → تسارع زاوي
  // τ = I α
  // =========================
  const alphaX = torque.x / I;
  const alphaY = torque.y / I;
  const alphaZ = torque.z / I;

  omega.x += alphaX * dt;
  omega.y += alphaY * dt;
  omega.z += alphaZ * dt;

  // =========================
  // 4. Spin effect (انحراف المسار)
  // Magnus-like effect مبسط
  // =========================
  velocity.z += omega.y * 0.001;
  velocity.x -= omega.z * 0.0008;

  // =========================
  // 5. الحركة الانتقالية
  // =========================
  position.x += velocity.x * dt;
  position.z += velocity.z * dt;

  ball.position.set(position.x, position.y, position.z);

  // =========================
  // 6. الحركة الدورانية
  // =========================
  ball.rotation.x += omega.x * dt;
  ball.rotation.y += omega.y * dt;
  ball.rotation.z += omega.z * dt;

  // =========================
  // 7. شرط التدحرج الحقيقي
  // v = r ω
  // =========================
  const rollingSpeed = r * omega.z;
  const diff = velocity.x - rollingSpeed;

  if (Math.abs(diff) < 0.03) {
    velocity.x = rollingSpeed;
  }

  // =========================
  // 8. تحويل الانزلاق → تدحرج تدريجي
  // =========================
  if (Math.abs(diff) > 0.03) {
    velocity.x -= diff * 0.02;
  }

  // =========================
  // 9. عزم يتناقص مع الزمن
  // =========================
  torque.x *= 0.97;
  torque.y *= 0.97;
  torque.z *= 0.97;

  // =========================
  // 10. طاقة الحركة (للاستخدام الخارجي)
  // =========================
  state.energy = {
    translational: 0.5 * m * (velocity.x ** 2 + velocity.z ** 2),
    rotational: 0.5 * I * (omega.x ** 2 + omega.y ** 2 + omega.z ** 2)
  };
}