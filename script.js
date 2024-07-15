let balance = 0;
let shakeCount = 0;
let lastX, lastY, lastZ;
const threshold = 15;

function updateBalance() {
    balance += 5;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
}

function onDeviceMotion(event) {
    const { x, y, z } = event.accelerationIncludingGravity;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);
        const deltaZ = Math.abs(lastZ - z);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            shakeCount++;
            if (shakeCount >= 5) {
                updateBalance();
                shakeCount = 0;
            }
        }
    }

    lastX = x;
    lastY = y;
    lastZ = z;
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение тряски.';
}
