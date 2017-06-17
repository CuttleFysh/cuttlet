var chat = new CuttleChat();

var leaderboard = [];

var explanation = document.getElementById('explanation');
var input_answer = document.getElementById('input_answer');
var button_show = document.getElementById('button_show');
var button_start = document.getElementById('button_start');
var button_next_question = document.getElementById('button_next_question');
var container_correctboard = document.getElementById('container_correctboard');
var container_leaderboard = document.getElementById('container_leaderboard');

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

function limitIndex(length, limit) {
    if (length <= limit) {
        return length;
    } else {
        return limit;
    }
}

function updateLeaderboard() {
    var counter = 1;
    container_leaderboard.innerHTML = 'Leaderboard';
    leaderboard.sort(function (a, b) {
        return b.points - a.points;
    });
    for (var i = 0; i < limitIndex(leaderboard.length, 10); i++) {
        var rank_div = document.createElement('div');
        rank_div.className = 'rank_div';
        rank_div.innerHTML = counter + '. ' + leaderboard[i].username + ' = ' + leaderboard[i].points;
        container_leaderboard.appendChild(rank_div);
        counter++;
    }
}

function startReading() {
    var correct_ans = input_answer.value.toLowerCase();
    var saved_ans = [];
    var counter = 1;
    var time_start = new Date();
    chat.open(function (username, message) {
        var found_saved = saved_ans.indexOf(username);
        if (found_saved === -1 && message.toLowerCase()) {
            var time_msg = new Date();
            var date_displayed = new Date(time_msg.getTime()-time_start.getTime());
            var points = Math.round(1/date_displayed.getTime() * (20000 + 10000 / counter));
            saved_ans.push(username);
            console.log('SAVED: ' + message);
            var rank_div = document.createElement('div');
            rank_div.className = 'rank_div';
            rank_div.innerHTML = counter + '. ' + username + ': +' + points;
            container_correctboard.appendChild(rank_div);
            counter++;
            var found_index = leaderboard.findIndex(function (msg) {
                return msg.username === username;
            });
            if (found_index >= 0) {
                leaderboard[found_index].points += points;
            } else {
                leaderboard.push({username: username, points: points})
            }
            updateLeaderboard();
            console.log('LEADERBOARD: ' + JSON.stringify(leaderboard));
            if (saved_ans.length == 10) {
                console.log('reached it: ' + saved_ans);
                chat.close();
            }
        }
    });
    explanation.style.display = 'none';
    button_start.style.display = 'none';
    button_next_question.style.display = 'block';
}

function nextQuestion() {
    chat.close();
    input_answer.value = '';
    container_correctboard.innerHTML = 'Correctboard';
    button_next_question.style.display = 'none';
    button_start.style.display = 'block';
    explanation.style.display = 'block';
}

// TODO: Change all localStorage to Array
