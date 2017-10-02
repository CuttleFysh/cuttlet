function CuttleChat() {
    var is_open = false;
    var header_info_stream = document.getElementById('header_info_stream');
    switch(header_info_stream.dataset.acctype){
        case 'twitch':
            this.chat = new twitchChat(sessionStorage.getItem('streamid'));
            break;
        case 'youtube':
            this.chat = new youtubeChat(sessionStorage.getItem('streamid'));
            break;
    }
}

CuttleChat.prototype.open = function open(callback) {
    this.chat.is_open = true;
    this.chat.callback = callback;
    this.chat.open();
}

CuttleChat.prototype.close = function close() {
    this.is_open = false;
    this.chat.close();
}

// Twitch starts here
// ------------------
// ------------------
// ------------------
// ------------------

var twitchChat = function twitchChat(channel) {
    this.channel = '#' + channel;

    this.username = 'cuttlebay';
    this.password = 'oauth:lvflu1lbn7ewjo3qx2na7jyvc8a9yh';
    this.server = 'irc-ws.chat.twitch.tv';
    this.port = 443;
}

twitchChat.prototype.open = function open() {
    this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');

    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
}

twitchChat.prototype.onError = function onError(message) {
    // console.log('Error: ' + message);
}

twitchChat.prototype.onMessage = function onMessage(message) {
    if(message !== null) {
        var parsed = this.parseMessage(message.data);
        // if (parsed) checks for null, undefined, emptystring, nan, 0, false
        if(parsed) {
            this.callback(parsed.username, parsed.message.substring(1));
            // if (parsed.message.startsWith('?')) {
            //     this.callback(parsed.username, parsed.message.substring(1));
            // }
        }
    }
}

twitchChat.prototype.onOpen = function onOpen() {
    var socket = this.webSocket;

    if (socket !== null && socket.readyState === 1) {
        socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        socket.send('PASS ' + this.password);
        socket.send('NICK ' + this.username);
        socket.send('JOIN ' + this.channel);
    }
}

twitchChat.prototype.onClose = function onClose() {
    if(this.is_open) {
        this.open();
    }
}

twitchChat.prototype.close = function close() {
    this.is_open = false;
    if(this.webSocket) {
        this.webSocket.close();
    }
}

twitchChat.prototype.parseMessage = function parseMessage(rawMessage) {
    var parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if(rawMessage[0] === '@') {
        var tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        parsedMessage.tags = rawMessage.slice(0, tagIndex);
        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
    }

    if(parsedMessage.command !== 'PRIVMSG') parsedMessage = null;

    return parsedMessage;
}

// YoutubeChat starts here
// ---------------------
// ---------------------
// ---------------------
// ---------------------

var youtubeChat = function youtubeChat(id) {
    this.id = id;
    this.chat_id = 'none';
    this.next_token = '';
}

youtubeChat.prototype.open = function open() {
    this.is_open = true;
    var self = this;
    var xhr = new XMLHttpRequest();
    var url = 'https://www.googleapis.com/youtube/v3/videos?';
    var params =    'id=' + this.id + "&" +
                    'part=liveStreamingDetails' + '&' +
                    'key=' + YOUTUBE_API_KEY;
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var r = JSON.parse(xhr.response);
            self.chat_id = r.items[0].liveStreamingDetails.activeLiveChatId;
            self.listMessages(self.next_token);
        }
    }
    xhr.send(null);
}

youtubeChat.prototype.close = function close() {
    this.is_open = false;
}

youtubeChat.prototype.listMessages = function listMessages(page_token) {
    if (this.is_open) {
        var self = this;
        var xhr = new XMLHttpRequest();
        var url = 'https://www.googleapis.com/youtube/v3/liveChat/messages?';
        var params =    'liveChatId=' + this.chat_id + "&" +
                        'part=snippet,authorDetails' + '&' +
                        'profileImageSize=16' + '&' +
                        'pageToken=' + page_token + '&' +
                        'key=' + YOUTUBE_API_KEY;
        xhr.open('GET', url + params);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var r = JSON.parse(xhr.response);
                    if (r.pageInfo.totalResults > 0 && page_token !== '') {
                        self.parseMessages(r.items);
                    }
                    self.next_token = r.nextPageToken;
                    setTimeout(function () {
                        self.listMessages(self.next_token);
                    }, r.pollingIntervalMillis + 10);
                } else {
                    setTimeout(function () {
                        self.listMessages(page_token);
                    }, 10000);
                }
            }
        }
        xhr.send(null);
    }
}

youtubeChat.prototype.parseMessages = function parseMessages(items) {
    var i = 0;
    var self = this;
    function loopMsg () {
        setTimeout(function () {
            if (self.is_open && items[i].snippet.displayMessage) {
                self.callback(items[i].authorDetails.displayName, items[i].snippet.displayMessage);
                // if (items[i].snippet.displayMessage.startsWith('?')) {
                //     self.callback(items[i].authorDetails.displayName, items[i].snippet.displayMessage.substring(1));
                // }
            }
            i++;
            if (i < items.length) loopMsg();
        }, 100);
    }
    loopMsg();
}
