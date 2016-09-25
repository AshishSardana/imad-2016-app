console.log('Loaded!');

//Change the text of the main-text division
var element = document.getElementById('main-text');
element.innerHTML = 'New Value that is generated through javascript.';

var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 1;
    img.style.marginLeft= marginLeft + 'px';
}
var img = document.getElementById('img');
img.onclick = function() {
    var interval = setInterval(moveRight, 50);
}