function setBackgroundImage() {
    var bgImage = new Image();
    bgImage.onload = function() {
        // 将图片设置为背景，并应用模糊效果
        document.body.style.backgroundImage = 'url(' + bgImage.src + ')';
        //document.body.style.filter = 'blur(10px)'; // 这里的10px是模糊程度，可以根据需要调整
    };
    bgImage.src = 'https://bing.ee123.net/img/4k'; // 确保URL是正确的，移除了错误的HTML实体
}

document.addEventListener('DOMContentLoaded', function() {
    setBackgroundImage();
});