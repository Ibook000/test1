document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    fetch('https://106.52.119.131/bs/reg', { 
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
        if(data.info && data.info === "Successfully!") { 
            window.location.href = 'login.html';
        } else {
            if(data.detail) {
                alert("注册请求失败：" + data.detail);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("注册请求失败：" + error);
    });
});