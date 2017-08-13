var chat = new CuttleChat();

var leaderboard = [];

var explanation = document.getElementById('explanation');
var input_answer = document.getElementById('input_answer');
var button_show = document.getElementById('button_show');
var button_start = document.getElementById('button_start');
var button_next_question = document.getElementById('button_next_question');
var content_correctboard = document.getElementById('content_correctboard');
var content_leaderboard = document.getElementById('content_leaderboard');

button_show.addEventListener('click', toggleViewAnswer, false);
button_start.addEventListener('click', startReading, false);
button_next_question.addEventListener('click', nextQuestion, false);

function toggleViewAnswer() {
    if (input_answer.type === 'text') {
        input_answer.type = 'password';
        button_show.innerHTML = 'SHOW';
    } else {
        input_answer.type = 'text';
        button_show.innerHTML = 'HIDE';
    }
}

function limitIndex(length, limit) {
    return length <= limit ? length : limit;
}

function updateLeaderboard() {
    var counter = 1;
    content_leaderboard.innerHTML = '';
    leaderboard.sort(function (a, b) {
        return b.points - a.points;
    });
    for (var i = 0; i < limitIndex(leaderboard.length, 5); i++) {
        var rank_user = document.createElement('span');
        rank_user.className = 'rank_user';
        rank_user.innerHTML = counter + '. ' + leaderboard[i].username;
        var rank_points = document.createElement('span');
        rank_points.className = 'rank_points';
        rank_points.innerHTML = leaderboard[i].points;
        content_leaderboard.appendChild(rank_user);
        content_leaderboard.appendChild(rank_points);
        counter++;
    }
}

function startReading() {
    if (input_answer.value === '') {
        input_answer.placeholder = 'Please write the correct answer';
    } else {
        input_answer.type = 'password';
        input_answer.readOnly = true;
        button_show.innerHTML = 'SHOW';
        var correct_ans = input_answer.value.toLowerCase();
        var saved_ans = [];
        var counter = 1;
        var time_start = new Date();
        chat.open(function (username, message) {
            var already_saved = saved_ans.indexOf(username);
            message = message.toLowerCase();
            if (already_saved === -1 && message == correct_ans) {
                var time_msg = new Date();
                var time_elapsed = time_msg.getTime()-time_start.getTime();
                var points = Math.round(300000/time_elapsed + 1000/counter);
                saved_ans.push(username);
                var rank_user = document.createElement('span');
                rank_user.className = 'rank_user';
                rank_user.innerHTML = counter + '. ' + username;
                var rank_points = document.createElement('span');
                rank_points.className = 'rank_points';
                rank_points.innerHTML = points;
                content_correctboard.appendChild(rank_user);
                content_correctboard.appendChild(rank_points);
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
                if (saved_ans.length == 5) {
                    explanation.innerHTML = 'Fastest responses found!';
                    chat.close();
                }
            }
        });
        explanation.innerHTML = 'Waiting for correct responses';
        button_start.style.display = 'none';
        button_next_question.style.display = 'inline-block';
    }
}

function nextQuestion() {
    chat.close();
    input_answer.value = '';
    input_answer.placeholder = 'Write the correct answer';
    input_answer.readOnly = false;
    input_answer.type = 'password';
    button_show.innerHTML = 'SHOW';
    content_correctboard.innerHTML = '';
    button_next_question.style.display = 'none';
    button_start.style.display = 'inline-block';
    explanation.innerHTML = 'Think of a question';
}

// TODO: Change all localStorage to Array
