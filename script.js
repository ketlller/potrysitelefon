let balance = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 1; // Порог чувствительности

function updateBalance() {
    balance += 1;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
    console.log(`Баланс обновлен: ${balance} EOS`);
}

function onDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(acceleration.x - lastX);
        const deltaY = Math.abs(acceleration.y - lastY);
        const deltaZ = Math.abs(acceleration.z - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            updateBalance();
        }
    }

    lastX = acceleration.x;
    lastY = acceleration.y;
    lastZ = acceleration.z;
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
    console.log('Событие DeviceMotion поддерживается');
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение движения.';
    console.log('Событие DeviceMotion не поддерживается');
}
