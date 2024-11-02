document.getElementById('changePasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    
    fetch('https://106.52.119.131/bs/forget/passwd', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "key": "ZJ", 
            "username": username,
            "old_passwd": oldPassword,
            "new_passwd": newPassword
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if(data.info === "Successfully") {
            window.location.href = 'login.html';
        }else{
            alert("修改密码失败：" + data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("修改密码请求失败：" + error.message);
    });
});