let balance = 0;
let lastShakeTime = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 20; // Увеличиваем порог чувствительности
const shakeCooldown = 500; // Увеличиваем время между трясками до 2.5 секунд
let currentLevel = 1;
const levels = [
    { maxCoins: 0.01, nextLevel: 2 },
    { maxCoins: 0.05, nextLevel: 3 },
    { maxCoins: 0.1, nextLevel: 4 },
    { maxCoins: 0.5, nextLevel: 5 },
    { maxCoins: 1, nextLevel: 6 },
    { maxCoins: 1.5, nextLevel: 7 },
    { maxCoins: 2, nextLevel: 8 },
    { maxCoins: 2.5, nextLevel: 9 },
    { maxCoins: 3, nextLevel: 10 },
    { maxCoins: 5, nextLevel: 11 },
    { maxCoins: 10, nextLevel: 12 },
    { maxCoins: 20, nextLevel: 13 },
    { maxCoins: 50, nextLevel: 14 },
    { maxCoins: 100, nextLevel: 15 },
    { maxCoins: 250, nextLevel: 16 },
    { maxCoins: 500, nextLevel: 17 },
    { maxCoins: 1000, nextLevel: 18 },
    { maxCoins: 2000, nextLevel: 19 },
    { maxCoins: 5000, nextLevel: 20 }
    
];

const coinSound = document.getElementById('coinSound');
const levelUpSound = document.getElementById('levelUpSound');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function updateBalance() {
    balance += 0.0001;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
    playSound(coinSound);
    updateProgressBar();
    checkLevelUp();
}

function updateProgressBar() {
    const levelInfo = levels[currentLevel - 1];
    const percentage = (balance / levelInfo.maxCoins) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
}

function checkLevelUp() {
    const levelInfo = levels[currentLevel - 1];
    if (balance >= levelInfo.maxCoins) {
        if (currentLevel < levels.length) {
            currentLevel = levelInfo.nextLevel;
            playSound(levelUpSound);
            alert(`Поздравляем! Вы достигли уровня ${currentLevel}`);
            document.getElementById('message').innerText = `Трясите телефон для достижения ${levels[currentLevel - 1].maxCoins} EOS!`;
            updateProgressBar();
        } else {
            alert('Вы достигли максимального уровня!');
        }
    }
}

function onDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;
    const currentTime = new Date().getTime();

    if (acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
        if (lastX !== null && lastY !== null && lastZ !== null) {
            const deltaX = Math.abs(acceleration.x - lastX);
            const deltaY = Math.abs(acceleration.y - lastY);
            const deltaZ = Math.abs(acceleration.z - lastZ);

            if ((deltaX > threshold || deltaY > threshold || deltaZ > threshold) && (currentTime - lastShakeTime > shakeCooldown)) {
                updateBalance();
                lastShakeTime = currentTime;
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
