var chat = new CuttleChat()

var status_collect = document.getElementById('status_collect');
var ranks_collect = document.getElementsByClassName('ranks_collect');
var textarea_draft = document.getElementById('textarea_draft');

var is_add_active = false;
var collecting_word = '';
var timeout_write;

for (var i = 0; i < ranks_collect.length; i++) {
    ranks_collect[i].addEventListener('click', addWord, false);
}
textarea_draft.addEventListener('keypress', updateStatus, false);

function updateStatus(e) {
    clearTimeout(timeout_write);
    var key_pressed = String.fromCharCode(e.which);
    var status = '';
    console.log(key_pressed);
    status = 'Writing...';
    if (is_add_active) {
        if (key_pressed === ' ') {
            is_add_active = false;
            startCollecting();
        } else {
            collecting_word += key_pressed;
        }

    }
    if (collecting_word === '') {
        if (key_pressed === '?') {
            status = 'Requesting:';

        }
        if (textarea_draft.value.substr(textarea_draft.value.length - 1) === '?' && key_pressed !== ' ') {
            collecting_word += key_pressed;
            is_add_active = true;
            status = 'Requesting: ' + collecting_word;
        } else {
            timeout_write = setTimeout(function() {status_collect.innerHTML = 'Waiting...' }, 3000);
        }
    } else {
        status = 'Requesting: ' + collecting_word;
    }
    status_collect.innerHTML = status;
}

function startCollecting() {
    if (collecting_word !== '') {
        for (var i = 0; i < 3; i++) {
            ranks_collect[i].innerHTML = collecting_word + ': ' + i;
        }
    }
}

function addWord() {
    collecting_word = '';
    ranks_collect[0].innerHTML = 'First';
    ranks_collect[1].innerHTML = 'Second';
    ranks_collect[2].innerHTML = 'Third';
    console.log('adding');
    textarea_draft.focus();
}

window.onload = function() {
    textarea_draft.focus();
}
