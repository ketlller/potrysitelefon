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

    if (acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
        if (lastX !== null && lastY !== null && lastZ !== null) {
            const deltaX = Math.abs(acceleration.x - lastX);
            const deltaY = Math.abs(acceleration.y - lastY);
            const deltaZ = Math.abs(acceleration.z - lastZ);

            console.log(`deltaX: ${deltaX}, deltaY: ${deltaY}, deltaZ: ${deltaZ}`);

            if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
                updateBalance();
            }
        }

        lastX = acceleration.x;
        lastY = acceleration.y;
        lastZ = acceleration.z;
    } else {
        console.log('Данные акселерометра недоступны');
    }
}

function startMotionDetection() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', onDeviceMotion, false);
        console.log('Событие DeviceMotion поддерживается');
    } else {
        document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение движения.';
        console.log('Событие DeviceMotion не поддерживается');
    }
}

// Проверка и запрос разрешений для iOS 13+
function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startMotionDetection();
                } else {
                    document.getElementById('message').innerText = 'Разрешение на доступ к данным сенсоров не предоставлено.';
                    console.log('Разрешение на доступ к данным сенсоров не предоставлено.');
                }
            })
            .catch(console.error);
    } else {
        startMotionDetection(); // Если не требуется явное разрешение
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        document.getElementById('requestPermission').style.display = 'block';
        document.getElementById('requestPermission').addEventListener('click', requestPermission);
    } else {
        startMotionDetection();
    }
});
