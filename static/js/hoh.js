var chat = new CuttleChat();

var label_num_questions = document.getElementById('label_num_questions');
var label_percent = document.getElementById('label_percent');

var current_question = document.getElementById('current_question');
var current_username = document.getElementById('current_username');
var container_queue = document.getElementById('container_queue');
var container_timer = document.getElementById('container_timer');

var start_time = 0;
var questions_answered = 0;
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
    current_username.style.display = 'inline-block';
    questions_answered++;
    label_num_questions.innerHTML = 'Answered: ' + questions_answered;
    var i = e.target.dataset.index;
    current_question.innerHTML = saved[i].question;
    current_username.innerHTML = saved[i].username;
    saved.splice(i, 1);
    updateQueue();
}

function removeQuestion(e) {
    e.stopPropagation();
    saved.splice(e.target.dataset.index, 1);
    updateQueue();
}

function updateQueue() {
    container_queue.innerHTML = '';
    if (saved.length === 0) container_queue.innerHTML = 'Waiting for chat to type questions...';
    for (var i = 0; i < limitIndex(saved.length, 9); i++) {
        var span_question = document.createElement('span');
        span_question.className = 'container_question';
        span_question.innerHTML = saved[i].question;
        span_question.dataset.index = i;
        var container = document.createElement('div');
        container.className = 'container_next';
        container.dataset.index = i;
        var button_flag = document.createElement('div');
        button_flag.className = 'button_flag';
        button_flag.innerHTML = '&#x2691'
        button_flag.dataset.index = i;
        button_flag.addEventListener('click', removeQuestion, false);
        container.appendChild(span_question);
        container.appendChild(button_flag);
        container_queue.appendChild(container);
        container.addEventListener('click', selectQuestion, false);
    }
}

window.onload = function () {
    setInterval(updateTime, 1000);
    chat.open(function (username, message) {
        var msg_question = message.substring(0, message.indexOf('?') + 1);
        console.log(msg_question);
        if (msg_question && msg_question !== '?' && saved.length <= 10000) {
            saved.push({username: username, question: msg_question});
            updateQueue();
        }
        if (message.toLowerCase() === 'yes') {
            agree++;
            voters++;
        } else if (message.toLowerCase() === 'no'){
            voters++;
        }
        if (voters > 0) honesty = Math.floor(agree/voters*100) + '%';
        label_percent.innerHTML = 'Honesty at: ' + honesty;
    });
}
