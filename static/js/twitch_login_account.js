var query_string = location.hash.substring(1);
var query_string = location.hash.substring(1);

var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(query_string)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    requestChannelId(params);
}

function requestChannelId(params) {
    if (params['access_token']) {
        var xhr = new XMLHttpRequest();
        api_endpoint = 'https://api.twitch.tv/kraken/user?client_id=dyjm5o0cd24spkozqiyy3gue584olj';
        xhr.open('GET', api_endpoint);
        xhr.setRequestHeader("Authorization", "OAuth " + params['access_token']);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var channel_id = JSON.parse(xhr.response)._id;
                var channel_name = JSON.parse(xhr.response).name;
                var thumbnail_url = JSON.parse(xhr.response).logo;
                if (!thumbnail_url) thumbnail_url = '';
                loginTwitchChannel(channel_id, channel_name, thumbnail_url);
            }
        };
        xhr.send(null);
    } else {
        console.log('no access_token found');
    }
}

function loginTwitchChannel(channel_id, channel_name, thumbnail_url) {
    console.log(thumbnail_url);
    var xhr = new XMLHttpRequest();
    var url = window.location.href;
    var params =
            'twitch_id=' + channel_id + '&' +
            'channel_name=' + channel_name + '&' +
            'thumbnail_url=' + thumbnail_url + '&' +
            'csrfmiddlewaretoken=' + document.getElementsByName('csrfmiddlewaretoken')[0].value;
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Removes access_token from url and prevents back button action
            window.location.replace('/');
        }
    };
    xhr.send(params);
}
