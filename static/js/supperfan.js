var chat = new CuttleChat();

var leaderboard = [];

var textarea_topic = document.getElementById('textarea_topic');
var textarea_question = document.getElementById('textarea_question');
var button_chat_choose = document.getElementById('button_chat_choose');
var overlay_choose = document.getElementById('overlay_choose');
var overlay_choose_close = document.getElementById('overlay_choose_close');
var input_answer = document.getElementById('input_answer');
var button_show = document.getElementById('button_show');
var button_start = document.getElementById('button_start');
var button_next_question = document.getElementById('button_next_question');
var content_correctboard = document.getElementById('content_correctboard');
var content_leaderboard = document.getElementById('content_leaderboard');
var button_collect = document.getElementById('button_collect');
var height_calc = document.getElementById('height_calc');

var array_choices = [];

textarea_topic.addEventListener('focus', handleFocus, false);
textarea_topic.addEventListener('keydown', modifyTextarea, false);
textarea_question.addEventListener('focus', handleFocus, false);
textarea_question.addEventListener('keydown', modifyTextarea, false);
button_show.addEventListener('click', toggleViewAnswer, false);
button_start.addEventListener('click', startReading, false);
button_next_question.addEventListener('click', nextQuestion, false);
button_collect.addEventListener('click', collectChoices, false);


textarea_topic.addEventListener('focus', function () {
    button_chat_choose.style.display = 'inline-block';
}, false);

textarea_topic.addEventListener('blur', function () {
    button_chat_choose.style.display = 'none';
    if (this.value == '') this.placeholder = 'NO-TOPIC';
}, false);

textarea_question.addEventListener('blur', function () {
    if (this.value == '') this.placeholder = '?';
}, false);

button_chat_choose.addEventListener('mousedown', function () {
    overlay_choose.style.display = 'block';
}, false);

overlay_choose_close.addEventListener('click', function () {
    overlay_choose.style.display = 'none';
    for (var i = 0; i < 5; i++) {
        document.getElementsByClassName('input_choice')[i].readOnly = false;
        document.getElementsByClassName('input_choice')[i].value = '';
        document.getElementsByClassName('votes_choice')[i].innerHTML = 'Votes:';
    }
    button_collect.innerHTML = 'Start collecting chat choices';
    array_choices = [];
    participants = [];
}, false);

function limitIndex(length, limit) {
    return length <= limit ? length : limit;
}

function handleFocus() {
    this.placeholder = '';
}

function modifyTextarea() {
    height_calc.style.fontSize = getComputedStyle(this).fontSize;
    height_calc.style.lineHeight = getComputedStyle(this).lineHeight;
    height_calc.style.textTransform = getComputedStyle(this).textTransform;
    height_calc.innerHTML = this.value + ' x';
    this.style.height = height_calc.scrollHeight + 'px';
}

function openOverlay() {

}

function toggleViewAnswer() {
    if (input_answer.type === 'text') {
        input_answer.type = 'password';
        button_show.innerHTML = 'SHOW';
    } else {
        input_answer.type = 'text';
        button_show.innerHTML = 'HIDE';
    }
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
                    textarea_question.value = 'Fastest responses found!';
                    chat.close();
                }
            }
        });
        textarea_question.value = 'Waiting for correct responses';
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
    textarea_question.value = 'Click to write a question';
}

function compareArray(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] < b[1]) ? -1 : 1;
    }

}

function collectChoices() {
    if (array_choices.length <= 0) {
        var one = document.getElementById('choice_one');
        var two = document.getElementById('choice_two');
        var three = document.getElementById('choice_three');
        var four = document.getElementById('choice_four');
        var five = document.getElementById('choice_five');
        for (var i = 0; i < 5; i++) {
            document.getElementsByClassName('input_choice')[i].readOnly = true;
        }
        array_choices =[[one.value, 0],
                        [two.value, 0],
                        [three.value, 0],
                        [four.value, 0],
                        [five.value, 0]];
        var participants = [];
        button_collect.dataset.choice = one.value;
        button_collect.innerHTML = 'Waiting';
        chat.open(function (username, message) {
            var options = '12345';
            var choice = message.charAt(0);
            var is_not_first = participants.indexOf(username);
            if (options.indexOf(choice) > -1 && is_not_first === -1) {
                array_choices[choice - 1][1] += 1;
                var votes_index = document.getElementsByClassName('votes_choice')[choice - 1];
                votes_index.innerHTML = 'Votes: ' + array_choices[choice -1][1];
                array_choices.sort(compareArray);
                participants.push(username);
                button_collect.dataset.choice = array_choices[4][0];
                button_collect.innerHTML = 'Choose: ' + array_choices[4][0];
            }
        });
    } else {
        chat.close();
        textarea_topic.value = button_collect.dataset.choice;
        overlay_choose.style.display = 'none';
        for (var i = 0; i < 5; i++) {
            document.getElementsByClassName('input_choice')[i].readOnly = false;
            document.getElementsByClassName('input_choice')[i].value = '';
            document.getElementsByClassName('votes_choice')[i].innerHTML = 'Votes:';
        }
        button_collect.innerHTML = 'Start collecting chat choices';
        array_choices = [];
        participants = [];
    }
}
