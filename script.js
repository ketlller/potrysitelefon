let balance = 0;
let stakeBalance = 0;
let isStaking = false;
let stakingInterval;
let lastShakeTime = 0;
let lastX = null;
let lastY = null;
let lastZ = null;
const threshold = 20; // Порог чувствительности для тряски
const shakeCooldown = 500; // Время между трясками в миллисекундах
let currentLevel = 1;
let vibrateOn = true;
const levels = [
    { maxCoins: 0.01, nextLevel: 2, reward: 0.0001, image: 'images/round1.png' },
    { maxCoins: 0.05, nextLevel: 3, reward: 0.0001, image: 'images/round2.png' },
    { maxCoins: 0.1, nextLevel: 4, reward: 0.001, image: 'images/round3.png' },
    { maxCoins: 0.5, nextLevel: 5, reward: 0.001, image: 'images/round4.png' },
    { maxCoins: 1, nextLevel: 6, reward: 0.001, image: 'images/round5.png' },
    { maxCoins: 1.5, nextLevel: 7, reward: 0.01, image: 'images/round6.png' },
    { maxCoins: 2, nextLevel: 8, reward: 0.01, image: 'images/round7.png' },
    { maxCoins: 2.5, nextLevel: 9, reward: 0.01, image: 'images/round8.png' },
    { maxCoins: 3, nextLevel: 10, reward: 0.03, image: 'images/round9.png' },
    { maxCoins: 5, nextLevel: 11, reward: 0.05, image: 'images/round10.png' },
    { maxCoins: 10, nextLevel: 12, reward: 0.1, image: 'images/round11.png' },
    { maxCoins: 20, nextLevel: 13, reward: 0.2, image: 'images/round12.png' },
    { maxCoins: 50, nextLevel: 14, reward: 0.5, image: 'images/round13.png' },
    { maxCoins: 100, nextLevel: 15, reward: 1, image: 'images/round14.png' },
    { maxCoins: 250, nextLevel: 16, reward: 2.5, image: 'images/round15.png' },
    { maxCoins: 500, nextLevel: 17, reward: 5, image: 'images/round16.png' },
    { maxCoins: 1000, nextLevel: 18, reward: 10, image: 'images/round17.png' },
    { maxCoins: 2000, nextLevel: 19, reward: 20, image: 'images/round18.png' },
    { maxCoins: 5000, nextLevel: 20, reward: 50, image: 'images/round19.png' },
    { maxCoins: 10000, nextLevel: 21, reward: 100, image: 'images/round20.png' }
];

let soundOn = true;
const coinSound = document.getElementById('coinSound');
const levelUpSound = document.getElementById('levelUpSound');
const soundToggle = document.getElementById('sound-toggle');
const vibrateToggle = document.getElementById('vibrate-toggle');
const shakePage = document.getElementById('shake-page');
const walletPage = document.getElementById('wallet-page');
const stakePage = document.getElementById('stake-page');
const friendsPage = document.getElementById('friends-page');
const earnPage = document.getElementById('earn-page');
const requestPermissionButton = document.getElementById('requestPermission');
const roundImage = document.getElementById('round-image');

function playSound(sound) {
    if (soundOn) {
        sound.currentTime = 0;
        sound.play();
    }
}

function vibrate() {
    if (vibrateOn && navigator.vibrate) {
        navigator.vibrate(200);
    }
}

soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.textContent = soundOn ? '🔊 Sound On' : '🔇 Sound Off';
});

vibrateToggle.addEventListener('click', () => {
    vibrateOn = !vibrateOn;
    vibrateToggle.textContent = vibrateOn ? '🔊 Vibrate On' : '🔇 Vibrate Off';
});

function createCoinAnimation() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    document.getElementById('shake-page').appendChild(coin);

    const onAnimationEnd = () => {
        coin.remove();
    };

    const intervalId = setInterval(() => {
        const roundRect = roundImage.getBoundingClientRect();
        const coinRect = coin.getBoundingClientRect();

        const coinCenterX = coinRect.left + coinRect.width / 2;
        const coinCenterY = coinRect.top + coinRect.height / 2;
        const roundCenterX = roundRect.left + roundRect.width / 2;
        const roundCenterY = roundRect.top + roundRect.height / 2;

        const distance = Math.sqrt((coinCenterX - roundCenterX) ** 2 + (coinCenterY - roundCenterY) ** 2);

        if (distance < roundRect.width / 2) {
            clearInterval(intervalId);
            coin.remove();
        }
    }, 50);

    coin.addEventListener('animationend', onAnimationEnd);
}

function updateBalance() {
    const levelInfo = levels[currentLevel - 1];
    balance += levelInfo.reward;
    document.getElementById('balance').innerText = `Баланс: ${balance.toFixed(4)} EOS`;
    document.getElementById('stake-wallet-balance').innerText = `${balance.toFixed(4)} EOS`;
    playSound(coinSound);
    vibrate();
    createCoinAnimation();
    updateProgressBar();
    updateWalletInfo();
    checkLevelUp();
}

function updateProgressBar() {
    const levelInfo = levels[currentLevel - 1];
    const percentage = (balance / levelInfo.maxCoins) * 100;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
}

function updateWalletInfo() {
    document.getElementById('wallet-balance').innerText = `${balance.toFixed(4)} EOS`;
    document.getElementById('wallet-round').innerText = currentLevel;
    document.getElementById('stake-wallet-balance').innerText = `${balance.toFixed(4)} EOS`;
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
    roundImage.style.backgroundImage = `url(${levelInfo.image})`;
    document.getElementById('message').innerText = `Трясите телефон для достижения ${levelInfo.maxCoins} EOS!`;
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
                    requestPermissionButton.style.display = 'none';
                } else {
                    document.getElementById('message').innerText = 'Разрешение на доступ к данным сенсоров не предоставлено.';
                    console.log('Разрешение на доступ к данным сенсоров не предоставлено.');
                }
            })
            .catch(console.error);
    } else {
        startMotionDetection(); // Если не требуется явное разрешение
        requestPermissionButton.style.display = 'none';
    }
}

function switchPage(page) {
    shakePage.style.display = 'none';
    walletPage.style.display = 'none';
    stakePage.style.display = 'none';
    friendsPage.style.display = 'none';
    earnPage.style.display = 'none';
    page.style.display = 'flex';
}

document.getElementById('shake-btn').addEventListener('click', () => switchPage(shakePage));
document.getElementById('wallet-btn').addEventListener('click', () => switchPage(walletPage));
document.getElementById('stake-btn').addEventListener('click', () => switchPage(stakePage));
document.getElementById('friends-btn').addEventListener('click', () => switchPage(friendsPage));
document.getElementById('earn-btn').addEventListener('click', () => switchPage(earnPage));

document.getElementById('start-stake').addEventListener('click', () => {
    if (!isStaking) {
        isStaking = true;
        stakingInterval = setInterval(() => {
            stakeBalance += stakeBalance * 0.1;
            document.getElementById('stake-balance').innerText = `${stakeBalance.toFixed(4)} EOS`;
        }, 60000); // 10% каждый минуту
        document.getElementById('stake-status').innerText = "Статус стейкинга: Активный стейкинг";
    }
});

document.getElementById('stop-stake').addEventListener('click', () => {
    if (isStaking) {
        isStaking = false;
        clearInterval(stakingInterval);
        document.getElementById('stake-status').innerText = "Статус стейкинга: Неактивный стейкинг";
    }
});

document.getElementById('add-stake').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('stake-amount').value);
    if (amount > 0 && amount <= balance) {
        balance -= amount;
        stakeBalance += amount;
        document.getElementById('balance').innerText = `Баланс: ${balance.toFixed(4)} EOS`;
        document.getElementById('stake-balance').innerText = `${stakeBalance.toFixed(4)} EOS`;
        updateWalletInfo();
    } else {
        alert('У вас не достаточно основного баланса для пополнения стейкинга');
    }
});

document.getElementById('withdraw-stake').addEventListener('click', () => {
    balance += stakeBalance;
    stakeBalance = 0;
    document.getElementById('balance').innerText = `Баланс: ${balance.toFixed(4)} EOS`;
    document.getElementById('stake-balance').innerText = `${stakeBalance.toFixed(4)} EOS`;
    updateWalletInfo();
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        requestPermissionButton.style.display = 'block';
        requestPermissionButton.addEventListener('click', requestPermission);
    } else {
        startMotionDetection();
    }
    updateRoundInfo();
    updateWalletInfo();
});
