var chat = new CuttleChat()

var status_collect = document.getElementById('status_collect');
var ranks_collect = document.getElementsByClassName('ranks_collect');
var text_draft = document.getElementById('text_draft');

var last_char;
var is_add_active = false;
var start_index;
var collecting_word = '';
var timeout_write;

var array_users = [];
var array_words = [];

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
    if (window.getSelection && window.getSelection().getRangeAt) {
         var range = window.getSelection().getRangeAt(0);
         var selectedObj = window.getSelection();
         var rangeCount = 0;
         var childNodes = selectedObj.anchorNode.parentNode.childNodes;
         for (var i = 0; i < childNodes.length; i++) {
              if (childNodes[i] == selectedObj.anchorNode) {
                  break;
              }
              if (childNodes[i].outerHTML)
                   rangeCount += childNodes[i].outerHTML.length;
              else if (childNodes[i].nodeType == 3) {
                   rangeCount += childNodes[i].textContent.length;
              }
         }
         return range.startOffset + rangeCount;
   }
   return -1;
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
                    status_collect.innerHTML = 'Requesting:&thinsp;&thinsp;' + collecting_word +
                            '&thinsp;&thinsp;<span class="status_explanation">(click \'space\' to start)</span>';
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
    if (e.keyCode === 13) {
      document.execCommand('insertHTML', false, '<br><br>');
      e.preventDefault();
    }
}

function updateStatus(e) {
    clearTimeout(timeout_write);
    var caret_position = getCaretPosition();
    var key_pressed = String.fromCharCode(e.which);
    var status = '';
    status = 'Writing...' +
            '&thinsp;&thinsp;<span class="status_explanation">(type \'?\' + \'type of word\' to ask chat for a word)</span>';
    if (is_add_active) {
        if (key_pressed === ' ') {
            is_add_active = false;
            startCollecting();
        } else {
            collecting_word += key_pressed;
        }

    } else {
        if (caret_position <= start_index + collecting_word.length - 1 && collecting_word !== '') {
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
            status = 'Requesting:&thinsp;&thinsp;' + collecting_word +
                    '&thinsp;&thinsp;<span class="status_explanation">(click \'space\' to start)</span>';
        } else {
            timeout_write = setTimeout(function() {
                status_collect.innerHTML = 'Waiting...';
            }, 2000);
        }
    } else {
        if (is_add_active) {
            status = 'Requesting:&thinsp;&thinsp;' + collecting_word +
                    ' <span class="status_explanation">(click \'space\' to start)</span>';
        } else {
            status = 'Requesting: ' + collecting_word +
                    '&thinsp;&thinsp;<span class="status_explanation">(Waiting for chat choices)</span>';
        }
    }
    if (is_add_active && caret_position !== start_index + collecting_word.length - 1) {
        e.preventDefault();
    }
    if (key_pressed === ' ') {
          document.execCommand('insertHTML', false, '&thinsp;&thinsp;');
          e.preventDefault();
    }
    status_collect.innerHTML = status;
    last_char = key_pressed;
}

function indexOfMessage(message, array) {
    for(var i = 0; i < array.length; i++) {
        if (array[i][0] === message) {
            return i;
        }
    }
    return -1;
}

function startCollecting() {
    if (collecting_word !== '') {
        chat.open(function (username, message) {
            console.log(message);
            console.log(array_words);
            if (array_users.indexOf(username) === -1) {
                array_users.push(username);
                var index_word = indexOfMessage(message, array_words);
                if (index_word > -1) {
                    array_words[index_word][1] = array_words[index_word][1] + 1;
                } else {
                    array_words.push([message, 1, username]);
                }
                array_words.sort(function (a,b) {
                    if (a[1] === b[1]) {
                        return 0;
                    } else {
                        return (a[1] > b[1]) ? -1 : 1;
                    }
                });
                for (var i = 0; i < 3; i++) {
                    if (array_words[i]) {
                        ranks_collect[i].style.display = 'inline-block';
                        ranks_collect[i].dataset.word = array_words[i][0];
                        ranks_collect[i].dataset.user = array_words[i][2];
                        ranks_collect[i].innerHTML = array_words[i][0] +
                                                    ': ' + array_words[i][1];
                    }
                }
            }
        });

    }
}

function addWord(e) {
    chat.close();
    var previous_text = text_draft.innerHTML;
    new_text =  previous_text.substr(0, start_index - 1) +
                '<span class="added_word" contenteditable="false" data-user="' +
                e.target.dataset.user + ': ">' + e.target.dataset.word  + '</span>' +
                previous_text.substr(start_index + collecting_word.length);
    text_draft.innerHTML = new_text;
    collecting_word = '';
    for (var i = 0; i < 3; i++) {
        ranks_collect[i].style.display = 'none';
    }
    caretAtEnd();
}

window.onload = function () {
    text_draft.focus();
}
