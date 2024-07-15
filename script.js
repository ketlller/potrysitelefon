let balance = 0;
let lastX = 0;
let lastY = 0;
let lastZ = 0;
const threshold = 10; // Порог чувствительности

function updateBalance() {
    balance += 1;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
    console.log(`Баланс обновлен: ${balance} EOS`);
}

function onDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;

    if (acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
        const deltaX = Math.abs(acceleration.x - lastX);
        const deltaY = Math.abs(acceleration.y - lastY);
        const deltaZ = Math.abs(acceleration.z - lastZ);

        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
            updateBalance();
        }

        lastX = acceleration.x;
        lastY = acceleration.y;
        lastZ = acceleration.z;
    }
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
    console.log('Событие DeviceMotion поддерживается');
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение движения.';
    console.log('Событие DeviceMotion не поддерживается');
}
