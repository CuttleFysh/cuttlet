// FIXME: Revise all style.display = 'block', so that they agree with our style
var header_is_live = document.getElementById('header_is_live');
var button_start_array = document.getElementsByClassName('button_start');
var button_offline_array = document.getElementsByClassName('button_start_offline');

function completeAndSubmitForm(params, form) {
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

function toggleDivsInArrays(array_show, array_hide) {
    for (var i = 0; i < array_show.length; i++) {
        array_show[i].style.display = 'inline';
    }
    for (var i = 0; i < array_hide.length; i++) {
        array_hide[i].style.display = 'none';
    }
}

function updateButtonsAvailable() {
    if (header_is_live.dataset.streamid) {
        toggleDivsInArrays(button_start_array, button_offline_array);
    } else {
        toggleDivsInArrays(button_offline_array, button_start_array);
    }
    setTimeout(updateWaysAvailable, 3000);
}

function isJuiceEnough(required_juice, callback) {
    var xhr = new XMLHttpRequest();
    var url = '/?';
    var params = 'q=juice';
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.getResponseHeader('Content-Type') == 'application/json') {
                console.log(xhr.response);
                var response = JSON.parse(xhr.response);
                var result = false;
                console.log(response.juice);
                if (required_juice <= response.juice) {
                    result = true;
                }
                callback.apply(result);
            }
        }
    };
    xhr.send(null);
}

// This post request has to be made through a form, if it is a plain XMLHttpRequest
// the response wont be registered in the global instance.
function startWay(url, cost) {
    isJuiceEnough(cost, function () {
        if (this) {
            var form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action', url);
            var params = {
                'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
            };
            completeAndSubmitForm(params, form);
        }
    });
}

window.onload = function () {
    if (header_is_live) updateButtonsAvailable();
}
