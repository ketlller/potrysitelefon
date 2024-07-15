let balance = 0;
let shakeCount = 0;

if ('ondevicemotion' in window) {
    window.addEventListener('devicemotion', function(event) {
        const acceleration = event.acceleration;

        if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
            shakeCount++;
            
            if (shakeCount >= 5) {
                balance += 5;
                document.getElementById('balance').innerText = `Баланс: ${balance} EOS`;
                shakeCount = 0;  // Сбрасываем счетчик трясок после увеличения баланса
            }
        }
    });
} else {
    document.getElementById('message').innerText = 'Ваше устройство не поддерживает обнаружение тряски.';
}
