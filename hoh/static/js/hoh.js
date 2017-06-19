var chat = new CuttleChat();

var container_percent = document.getElementById('container_percent');
var current_question = document.getElementById('current_question');
var current_username = document.getElementById('current_username');
var container_queue = document.getElementById('container_queue');
var container_timer = document.getElementById('container_timer');

var start_time = 0;
var saved = [];
var honesty = '';
var agree = 0;
var voters = 0;

function updateTime() {
    if (start_time == 900) document.getElementById('quarter_hoh').innerHTML = '1/4 HoH: ' + honesty;
    if (start_time == 1800) document.getElementById('half_hoh').innerHTML = '1/2 HoH: ' + honesty;
    if (start_time == 3600) document.getElementById('one_hoh').innerHTML = 'Completed: ' + honesty;
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
    container_queue.innerHTML = 'Questions';
    for (var i = 0; i < limitIndex(saved.length, 9); i++) {
        var container = document.createElement('div');
        container.className = 'container_next';
        var span_question = document.createElement('span');
        span_question.className = 'container_question';
        span_question.innerHTML = saved[i].question;
        span_question.dataset.index = i;
        span_question.addEventListener('click', selectQuestion, false);
        var span_username = document.createElement('span');
        span_username.className = 'container_username';
        span_username.innerHTML = saved[i].username;
        span_username.dataset.index = i;
        span_username.addEventListener('click', selectQuestion, false);
        container.appendChild(span_question);
        container.appendChild(span_username);
        container_queue.appendChild(container);
    }
}

window.onload = function () {
    setInterval(updateTime, 1000);
    chat.open(function (username, message) {
        var lowercase = message.toLowerCase();
        if (lowercase) {
            console.log('SAVED: ' + message + ' : ' + username);
            saved.push({username: username, question: message});
            console.log(saved);
            updateQueue();
        }
        if (lowercase.charAt(0) == 'l') {
            agree++;
            voters++;
        } else if (lowercase.charAt(0) == 'm'){
            voters++;
        }
        if (voters > 0) honesty = Math.floor(agree/voters*100) + '%';
        container_percent.innerHTML = honesty;
    });
}
