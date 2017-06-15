var chat = new CuttleChat();

var explanation = document.getElementById('explanation');
var input_answer = document.getElementById('input_answer');
var button_show = document.getElementById('button_show');
var button_start = document.getElementById('button_start');
var button_next_question = document.getElementById('button_next_question');

button_show.addEventListener('click', toggleViewAnswer, false);
button_start.addEventListener('click', startReading, false);
button_next_question.addEventListener('click', nextQuestion, false);

function toggleViewAnswer() {
    console.log(input_answer.type);
    if (input_answer.type === 'text') {
        input_answer.type = 'password';
    } else {
        input_answer.type = 'text';
    }
}

function startReading() {
    var correct_ans = input_answer.value.toLowerCase();
    var saved_ans = [];
    chat.open(function (username, message) {
        if (message.toLowerCase() === correct_ans) {
            saved_ans.push({username: username, message: message});
            console.log('SAVED: ' + message);
            if (saved_ans.length = 1) {
                console.log('reached it: ' + JSON.stringify(saved_ans));
            }
        }
    });
    explanation.style.display = 'none';
    button_start.style.display = 'none';
    button_next_question.style.display = 'block';
}

function nextQuestion() {
    input_answer.value = '';
    button_next_question.style.display = 'none';
    button_start.style.display = 'block';
    explanation.style.display = 'block';
}

// TODO: Change all localStorage to Array
