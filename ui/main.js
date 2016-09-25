console.log('Loaded!');

//Change the text of the main-text division

/*var element = document.getElementById('main-text');
element.innerHTML = 'New Value that is generated through javascript.'; */

//Animation of picture
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 1;
    img.style.marginLeft= marginLeft + 'px';
}
var img = document.getElementById('img');
img.onclick = function() {
    var interval = setInterval(moveRight, 50);
}

//Counter Code
var button = document.getElementById("counter");
button.onclick = function(){
    
    // Make a request to the counter endpoint
    
    //Capture the response and store it in a variable
    
    //Render the variable in the correct span
    counter = counter + 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();
}




