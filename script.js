let balance = 0;
let shakeCount = 0;
let lastTime = new Date();
const threshold = 15;
const shakeResetTime = 2000;

function updateBalance() {
    balance += 5;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
    document.getElementById('message').innerText = 'Потрясите телефон 5 раз для получения 5 EOS!';
    console.log(`Баланс обновлен: ${balance} EOS`);
}

function resetShakeCount() {
    shakeCount = 0;
    document.getElementById('message').innerText = 'Потрясите телефон 5 раз для получения 5 EOS!';
}

function onDeviceMotion(event) {
    const currentTime = new Date();
    const acceleration = event.accelerationIncludingGravity;

    const currentX = acceleration.x;
    const currentY = acceleration.y;
    const currentZ = acceleration.z;

    const timeDifference = currentTime.getTime() - lastTime.getTime();

    if (timeDifference > 100) {
        const speed = Math.abs(currentX + currentY + currentZ - lastX - lastY - lastZ) / timeDifference * 10000;

        if (speed > threshold) {
            shakeCount++;
            document.getElementById('message').innerText = `Трясок: ${shakeCount}`;
            console.log(`Трясок: ${shakeCount}`);

            if (shakeCount >= 5) {
                updateBalance();
                resetShakeCount();
            }

            clearTimeout(shakeTimer);
            shakeTimer = setTimeout(resetShakeCount, shakeResetTime);
        }

        lastTime = currentTime;
        lastX = currentX;
        lastY = currentY;
        lastZ = currentZ;
    }
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', onDeviceMotion, false);
    console.log('Событие DeviceMotion поддерживается');
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение тряски.';
    console.log('Событие DeviceMotion не поддерживается');
}
