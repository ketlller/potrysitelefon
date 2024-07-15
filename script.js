let balance = 0;
let shakeCount = 0;

function updateBalance() {
    balance += 5;
    document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
}

function onShake() {
    shakeCount++;
    if (shakeCount >= 5) {
        updateBalance();
        shakeCount = 0;
    }
}

if (typeof Shake !== 'undefined') {
    const shakeEvent = new Shake({ threshold: 15 });
    shakeEvent.start();

    window.addEventListener('shake', onShake, false);
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение тряски.';
}
