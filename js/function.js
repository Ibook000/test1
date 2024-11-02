document.addEventListener('DOMContentLoaded', function() {    
    fetchDeviceInfo();
});

function fetchDeviceInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }
    fetch('https://106.52.119.131/hardware/listinfo', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": token
        })
    })
    .then(response => response.json())
    .then(data => {
        const deviceInfoContainer = document.getElementById('deviceInfo');
        if (data.info) {
            const info = data.info;
            const devices = Object.keys(info).map(device => {
                return `<div class="device-item">
                    <img class="device-icon" src="img/device.png">
                    <span>${device.charAt(0).toUpperCase() + device.slice(1)}: ${info[device]}</span>
                    <button class="toggle-button" onclick="toggleDevice('${device}', '${info[device]}')">${info[device] === 'off' ? '[开]' : '[关]'}</button>
                </div>`;
            }).join('');
            deviceInfoContainer.innerHTML = devices;
        } else {
            deviceInfoContainer.textContent = data.detail;
        }
    })
    .catch(error => {
        console.error('Error fetching device data:', error);
        alert('无法获取'+error);
    });
}

function toggleDevice(device, currentState) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const action = currentState === 'off' ? 'on' : 'off';
    console.log('Toggle device:', device, action);
    fetch('https://106.52.119.131/hardware/update/info', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": token,
            "update_dict": {
                [device]: action
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Toggle response:', data); 
        if (data.info) {
            alert('更新成功');
            fetchDeviceInfo();
        } else {
            alert('无法更新设备'+data.detail);
        }
    })
    .catch(error => {
        console.error('Error toggling device:', error);
        alert('无法更新设备'+error);
    });
}
