let balance = 0;
let lastShakeTime = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 15; // Порог чувствительности для тряски
const shakeCooldown = 2500; // Время между трясками в миллисекундах
let currentLevel = 1;
const levels = [
    { maxCoins: 0.01, nextLevel: 2, reward: 0.0001 },
    { maxCoins: 0.05, nextLevel: 3, reward: 0.0001 },
    { maxCoins: 0.1, nextLevel: 4, reward: 0.001 },
    { maxCoins: 0.5, nextLevel: 5, reward: 0.001 },
    { maxCoins: 1, nextLevel: 6, reward: 0.001 },
    { maxCoins: 1.5, nextLevel: 7, reward: 0.01 },
    { maxCoins: 2, nextLevel: 8, reward: 0.01 },
    { maxCoins: 2.5, nextLevel: 9, reward: 0.01 },
    { maxCoins: 3, nextLevel: 10, reward: 0.03 },
    { maxCoins: 5, nextLevel: 11, reward: 0.05 },
    { maxCoins: 10, nextLevel: 12, reward: 0.1 },
    { maxCoins: 20, nextLevel: 13, reward: 0.2 },
    { maxCoins: 50, nextLevel: 14, reward: 0.5 },
    { maxCoins: 100, nextLevel: 15, reward: 1 },
    { maxCoins: 250, nextLevel: 16, reward: 2.5 },
    { maxCoins: 500, nextLevel: 17, reward: 5 },
    { maxCoins: 1000, nextLevel: 18, reward: 10 },
    { maxCoins: 2000, nextLevel: 19, reward: 20 },
    { maxCoins: 5000, nextLevel: 20, reward: 50 }
];

const coinSound = document.getElementById('coinSound');
const levelUpSound = document.getElementById('levelUpSound');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function updateBalance() {
    const levelInfo = levels[currentLevel - 1];
    balance += levelInfo.reward;
    document.getElementById('balance').innerText = `Баланс: ${balance.toFixed(4)} EOS`;
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
            alert(`Поздравляем! Вы достигли уровня ${currentLevel}`);
            playSound(levelUpSound);
            document.getElementById('message').innerText = `Трясите телефон для достижения ${levels[currentLevel - 1].maxCoins} EOS!`;
            updateRoundInfo();
            updateProgressBar();
        } else {
            alert('Вы достигли максимального уровня!');
        }
    }
}

function updateRoundInfo() {
    const levelInfo = levels[currentLevel - 1];
    document.getElementById('current-round').innerText = `Раунд: ${currentLevel}, Вознаграждение за тряску: ${levelInfo.reward} EOS`;
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
    updateRoundInfo();
});
