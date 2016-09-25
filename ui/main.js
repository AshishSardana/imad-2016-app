console.log('Loaded!');

//Change the text of the main-text division
var element = document.getElementById('main-text');
element.innerHTML = 'New Value that is generated through javascript.';

var img = document.getElementById('img');
img.onclick = function() {
    img.style.marginLeft = 100px;
}