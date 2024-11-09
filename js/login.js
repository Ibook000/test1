document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    // 发送登录请求到后端API
    fetch('https://106.52.119.131/bs/login', { // 确保URL格式正确
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "key": "ZJ",
            "username": username,
            "password": password
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.info === "Login Successfully!") {
            // 保存token到localStorage
            localStorage.setItem('token', data.token);
            // 检查是否为管理员账号
            if(username === "ZJUSER") {
                // 重定向到管理员页面
                window.location.href = 'admin.html';
            } else {
                // 重定向到普通用户的功能页面
                window.location.href = 'function.html'; 
            }
        } else {
            alert("登录失败：" + data.detail);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("登录请求失败：" + error);
    });
});
