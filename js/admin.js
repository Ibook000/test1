document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('没有token请重新登录');
        window.location.href = 'login.html';
        return;
    }

    fetchUsers(token);
});

function fetchUsers(token) {
    fetch('https://106.52.119.131/system/get/users', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "token": token })
    })
    .then(response => response.json())
    .then(data => {
        const userInfoContainer = document.getElementById('userInfo');
        userInfoContainer.innerHTML = '';

        if (data && typeof data === 'object') {
            const userListElement = document.createElement('div');
            userListElement.classList.add('user-list');
            
            Object.values(data).forEach(user => {
                const userItemElement = document.createElement('div');
                userItemElement.classList.add('user-item');

                // 获取设备状态
                fetchDeviceStatus(token, user.username)
                    .then(status => {
                        // 创建设备状态的动态HTML
                        let deviceStatusHTML = '';
                        Object.entries(status.info).forEach(([device, state]) => {
                            deviceStatusHTML += `
                                <div class="device">
                                    ${device.charAt(0).toUpperCase() + device.slice(1)}: 
                                    <span class="status ${state === 'on' ? 'on' : 'off'}">${state}</span>
                                </div>`;
                        });

                        // 生成用户信息和设备状态的 HTML
                        userItemElement.innerHTML = `
                            <div class="user-info">
                            <div class="user-id">ID: ${user.id}</div>
                            <img src="img/admin.png" alt="用户管理图标" class="user-icon">
                            <div class="user-username">用户名: ${user.username}</div>
                                <button class="delete-button" onclick="confirmDeleteUser('${user.username}')">
                                    <img src="img/delete.png" alt="删除图标" class="delete-icon">删除
                                </button>
                            </div>
                            <div class="device-status">${deviceStatusHTML}</div>
                            <input class="update-password" type="password" placeholder="新的密码" id="new-password-${user.username}">
                            <button class="update-button" onclick="updatePassword('${user.username}')">修改密码
                                <img src="img/update.png" alt="修改密码" class="update-password-icon">
                            </button>
                        `;
                    });

                userListElement.appendChild(userItemElement);
            });
            userInfoContainer.appendChild(userListElement);
        } else {
            userInfoContainer.textContent =data.detail;
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        alert('获取失败', error);
    });
}

function fetchDeviceStatus(token, username) {
    return fetch('https://106.52.119.131/system/select/hardware/info', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": token,
            "user": username
        })
    })
    .then(response => response.json())
    .then(data => {
        return data; 
    })
    .catch(error => {
        console.error('Error fetching device status for user:', username, error);
        return { info: { light: 'unknown', robot: 'unknown', rvc: 'unknown' } }; 
    });
}

function updatePassword(username) {
    const token = localStorage.getItem('token');
    const newPassword = document.getElementById(`new-password-${username}`).value;

    if (!token) {
        alert('没有token 请重新登录');
        window.location.href = 'login.html';
        return;
    }

    if (!newPassword) {
        alert('请输入新密码');
        return;
    }

    fetch('https://106.52.119.131/system/update/passwd', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": token,
            "user": username,
            "passwd": newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.Info === 'Successfully') {
            alert('密码更新成功');
        } else {
            alert("更新失败:" + data.detail);
        }
    })
    .catch(error => {
        console.error('Error updating password for user:', username, error);
        alert('.');
    });
}

function confirmDeleteUser(username) {
    if (confirm(`是否要删除"${username}"?`)) {
        deleteUser(username);
    }
}

function deleteUser(username) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('token不存在 请重新登录');
        window.location.href = 'login.html';
        return;
    }

    fetch('https://106.52.119.131/system/delete/user', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "token": token, "user": username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.Info === 'Successfully') {
            alert('删除成功');
            window.location.reload();
        } else {
            alert("登录失败：" + data.detail);
        }

    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert('删除用户失败',error);
    });
}
