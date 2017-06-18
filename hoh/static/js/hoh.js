var chat = new CuttleChat();

var current_question = document.getElementById('current_question');
var current_username = document.getElementById('current_username');
var container_queue = document.getElementById('container_queue');
var container_timer = document.getElementById('container_timer');

var start_time = 0;
var saved = [];
var answered = 0;

function updateTime() {
    var minutes = Math.floor(start_time / 60);
    var seconds = start_time % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    start_time++;
    container_timer.innerHTML = minutes + ':' + seconds;
}

function limitIndex(length, limit) {
    return length <= limit ? length : limit;
}

function selectQuestion(e) {
    var i = e.target.dataset.index;
    current_question.innerHTML = saved[i].question;
    current_username.innerHTML = saved[i].username;
    saved.splice(i, 1);
    updateQueue();
}

function updateQueue() {
    container_queue.innerHTML = '';
    for (var i = 0; i < limitIndex(saved.length, 9); i++) {
        var container = document.createElement('div');
        container.className = 'container_next';
        container.dataset.index = i;
        container.addEventListener('click', selectQuestion, false);
        var span_question = document.createElement('span');
        span_question.className = 'container_question';
        span_question.innerHTML = saved[i].question;
        var span_username = document.createElement('span');
        span_username.className = 'container_username';
        span_username.innerHTML = saved[i].username;
        container.appendChild(span_question);
        container.appendChild(span_username);
        container_queue.appendChild(container);
    }
}

window.onload = function () {
    setInterval(updateTime, 1000);
    chat.open(function (username, message) {
        if (message.toLowerCase()) {
            console.log('SAVED: ' + message + ' : ' + username);
            saved.push({username: username, question: message});
            console.log(saved);
            updateQueue();
        }
    });
}
