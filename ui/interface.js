// src/ui/interface.js

let powerContainer = null;
let powerBar = null;
let powerLabel = null;

/**
 * تهيئة وبناء عناصر واجهة مستخدم مقياس القوة داخل صفحة الـ HTML برمجياً
 */
export function initPowerGaugeUI() {
    if (document.getElementById('power-container')) return;

    // 1. تصميم الحاوية الخارجية للمقياس
    powerContainer = document.createElement('div');
    powerContainer.id = 'power-container';
    powerContainer.style.cssText = `
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 22px;
        background-color: rgba(0, 0, 0, 0.7);
        border: 2px solid #ffffff;
        border-radius: 10px;
        overflow: hidden;
        display: none;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
        z-index: 10;
    `;

    // 2. تصميم المؤشر الداخلي المتغير الألوان
    powerBar = document.createElement('div');
    powerBar.id = 'power-bar';
    powerBar.style.cssText = `
        width: 0%;
        height: 100%;
        background-color: #00ff88;
        transition: width 0.05s linear;
    `;

    // 3. تصميم عنوان التنبيه العلوي للمستخدم
    powerLabel = document.createElement('div');
    powerLabel.id = 'power-label';
    powerLabel.innerText = 'قوة الرمية (HOLD SPACE)';
    powerLabel.style.cssText = `
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        color: #ffffff;
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 1px 1px 4px #000;
        display: none;
        z-index: 10;
    `;

    powerContainer.appendChild(powerBar);
    document.body.appendChild(powerContainer);
    document.body.appendChild(powerLabel);
}

/**
 * تحديث واجهة المقياس وتغيير الألوان تدريجياً أثناء عملية الشحن
 */
export function updatePowerGaugeUI(percentage) {
    if (!powerBar || !powerContainer || !powerLabel) return;

    powerContainer.style.display = 'block';
    powerLabel.style.display = 'block';
    powerBar.style.width = `${percentage}%`;

    // تحديث لون الشريط بناءً على عمق ضغط المستخدم لزر الـ Space
    if (percentage < 40) {
        powerBar.style.backgroundColor = '#00ff88'; // أخضر (رمية ضعيفة/هادئة)
    } else if (percentage < 75) {
        powerBar.style.backgroundColor = '#ffcc00'; // أصفر (رمية متوسطة متزنة)
    } else {
        powerBar.style.backgroundColor = '#ff3333'; // أحمر (رمية قصوى حادّة)
    }
}

/**
 * إخفاء عناصر المقياس بعد انطلاق الكرة لإخلاء المشهد السينمائي
 */
export function hidePowerGaugeUI() {
    if (!powerContainer || !powerLabel) return;
    setTimeout(() => {
        powerContainer.style.display = 'none';
        powerLabel.style.display = 'none';
        powerBar.style.width = '0%'; // تصفير العداد للرمية التالية
    }, 200);
}