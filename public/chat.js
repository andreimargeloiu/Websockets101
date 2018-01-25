var socket = io.connect("http://localhost:3000/");


var message = document.getElementById("message"),
    handle = document.getElementById("handle"),
    output = document.getElementById("output"),
    btn = document.getElementById("send"),
    feedback = document.getElementById("feedback");

var previousEmittedTyping = 0;
var previousReceivedTyping = 0;

btn.addEventListener("click", () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });

    message.innerText="";
});

message.addEventListener("keypress", () => {
    var currentTime = Date.now();

    /*
        Reduce the numbers of request to the server by sending an event just when we didn't send one in the last two seconds
     */
    if (currentTime - previousEmittedTyping > 2000) {
        socket.emit("typing", handle.value);
        console.log("Typing event emitted");
        previousEmittedTyping = currentTime;
    }
});

// receive message
socket.on('chat', (data) => {
    console.log(data);

    feedback.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>';
});

// feel that someone is typing
socket.on('typing', (data) => {
    console.log("Typing event received");
    previousReceivedTyping = Date.now();

    feedback.innerHTML = '<p>' + data + ' is typing a message...' + '</p>';

    // if we didn't receive a typing event in the last three seconds, clear the typing
    setTimeout(() => {
        var currentTime = Date.now();

        if (currentTime - previousReceivedTyping > 2800) {
            feedback.innerHTML = "";
        }
    }, 3000);
});