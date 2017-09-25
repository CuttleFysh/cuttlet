var chat = new CuttleChat()

var status_collect = document.getElementById('status_collect');
var ranks_collect = document.getElementsByClassName('ranks_collect');
var text_draft = document.getElementById('text_draft');

var last_char;
var is_add_active = false;
var start_index;
var collecting_word = '';
var timeout_write;

for (var i = 0; i < ranks_collect.length; i++) {
    ranks_collect[i].addEventListener('click', addWord, false);
}
text_draft.addEventListener('keypress', updateStatus, false);
text_draft.addEventListener('keydown', checkBackspace, false);

function caretAtEnd() {
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(text_draft);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

function getCaretPosition() {
    var caretPos = 0;
    var sel;
    var range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == text_draft) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == text_draft) {
            var tempEl = document.createElement("span");
            text_draft.insertBefore(tempEl, text_draft.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}

function checkBackspace(e) {
    var caret_position = getCaretPosition();
    if (e.keyCode === 8) {
        console.log('backspace');
        console.log(collecting_word);
        if (is_add_active) {
            if (collecting_word === '') {
                is_add_active = false;
            } else {
                console.log(caret_position);
                console.log(start_index + collecting_word.length - 1);
                if (caret_position === start_index + collecting_word.length) {
                    collecting_word = collecting_word.slice(0, -1);
                    status_collect.innerHTML = 'Requesting: ' + collecting_word;
                } else {
                    e.preventDefault();
                }
            }
        } else {
            if (caret_position <= start_index + collecting_word.length && collecting_word !== '') {
                e.preventDefault();
            }
        }
    }
}

function updateStatus(e) {
    console.log('starte');
    clearTimeout(timeout_write);
    var caret_position = getCaretPosition();
    var key_pressed = String.fromCharCode(e.which);
    var status = '';
    status = 'Writing...';
    if (is_add_active) {
        if (key_pressed === ' ') {
            is_add_active = false;
            startCollecting();
        } else {
            collecting_word += key_pressed;
        }

    } else {
        if (caret_position <= start_index + collecting_word.length && collecting_word !== '') {
            console.log('lol');
            e.preventDefault();
        }
    }
    if (collecting_word === '') {
        if (key_pressed === '?') {
            status = 'Requesting:';

        }
        if (last_char === '?' && key_pressed !== ' ' && key_pressed !== '?') {
            collecting_word += key_pressed;
            is_add_active = true;
            start_index = getCaretPosition();
            console.log(start_index);
            status = 'Requesting: ' + collecting_word;
        } else {
            timeout_write = setTimeout(function() {
                status_collect.innerHTML = 'Waiting...';
            }, 2000);
        }
    } else {
        status = 'Requesting: ' + collecting_word;
    }
    if (is_add_active && caret_position !== start_index + collecting_word.length - 1) {
        e.preventDefault();
    }
    status_collect.innerHTML = status;
    last_char = key_pressed;
}

function startCollecting() {
    if (collecting_word !== '') {
        for (var i = 0; i < 3; i++) {
            ranks_collect[i].innerHTML = collecting_word + ': ' + i;
        }
    }
}

function addWord(e) {
    var previous_text = text_draft.innerHTML;
    new_text =  previous_text.substr(0, start_index - 1) +
                // '<span class="added_word">' + e.target.dataset.word  + '</span>' +
                e.target.dataset.word +
                previous_text.substr(start_index + collecting_word.length);
    text_draft.innerHTML = new_text;
    collecting_word = '';
    ranks_collect[0].innerHTML = 'First';
    ranks_collect[1].innerHTML = 'Second';
    ranks_collect[2].innerHTML = 'Third';
    caretAtEnd();
}

window.onload = function () {
    text_draft.focus();
}
