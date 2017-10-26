// Handles a canceled or error request
if (location.search) {
    window.location.replace('/');
}

var query_string = location.hash.substring(1);

var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(query_string)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    requestChannelInfo(params);
}

function decodeJwt(jwt) {
    var base64Url = jwt.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function requestChannelInfo(params) {
    if (params['id_token'] && params['scope']) {
        var user_id = decodeJwt(params['id_token']).sub;
        if (user_id) {
            var xhr = new XMLHttpRequest();
            api_endpoint = 'https://api.twitch.tv/kraken/channels/' + user_id;
            xhr.open('GET', api_endpoint);
            xhr.setRequestHeader("Accept", 'application/vnd.twitchtv.v5+json');
            xhr.setRequestHeader("Client-ID", 'dyjm5o0cd24spkozqiyy3gue584olj');
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (xhr.responseText) {
                        var channel_id = JSON.parse(xhr.response)._id;
                        var channel_name = JSON.parse(xhr.response).name;
                        var thumbnail_url = JSON.parse(xhr.response).logo;
                        if (!thumbnail_url) thumbnail_url = '';
                        loginTwitchChannel(channel_id, channel_name, thumbnail_url);
                    }
                }
            };
            xhr.send(null);
        }
    }
}
// function requestChannelId(params) {
//     if (params['access_token'] && params['scope']) {
//         var xhr = new XMLHttpRequest();
//         api_endpoint = 'https://api.twitch.tv/kraken/user?client_id=dyjm5o0cd24spkozqiyy3gue584olj';
//         xhr.open('GET', api_endpoint);
//         xhr.setRequestHeader("Authorization", "OAuth " + params['access_token']);
//         xhr.onreadystatechange = function (e) {
//             if (xhr.readyState == 4 && xhr.status == 200) {
//                 if (xhr.responseText) {
//                     var channel_id = JSON.parse(xhr.response)._id;
//                     var channel_name = JSON.parse(xhr.response).name;
//                     var thumbnail_url = JSON.parse(xhr.response).logo;
//                     if (!thumbnail_url) thumbnail_url = '';
//                     loginTwitchChannel(channel_id, channel_name, thumbnail_url);
//                 }
//             }
//         };
//         xhr.send(null);
//     }
// }

function loginTwitchChannel(channel_id, channel_name, thumbnail_url) {
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
