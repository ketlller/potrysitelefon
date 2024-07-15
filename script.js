let balance = 0;
let shakeCount = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 15;
const shakeTimeout = 1000; // Время для сброса данных о тряске в миллисекундах
let shakeTimer = null;

function updateBalance() {
    balance += 5;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
}

function resetShakeCount() {
    shakeCount = 0;
}

function onDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(acceleration.x - lastX);
        const deltaY = Math.abs(acceleration.y - lastY);
        const deltaZ = Math.abs(acceleration.z - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            shakeCount++;
            document.getElementById('message').innerText = `Трясок: ${shakeCount}`;
            if (shakeCount >= 5) {
                updateBalance();
                shakeCount = 0; // Сбрасываем счетчик трясок
            }

            if (shakeTimer) {
                clearTimeout(shakeTimer);
            }
            shakeTimer = setTimeout(resetShakeCount, shakeTimeout);
        }
    }

    lastX = acceleration.x;
    lastY = acceleration.y;
    lastZ = acceleration.z;
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение тряски.';
}
