function CuttleChat(){switch(document.getElementById("header_info_stream").dataset.acctype){case "twitch":this.chat=new twitchChat(sessionStorage.getItem("streamid"));break;case "youtube":this.chat=new youtubeChat(sessionStorage.getItem("streamid"))}}CuttleChat.prototype.open=function(a){this.chat.is_open=!0;this.chat.callback=a;this.chat.open()};CuttleChat.prototype.close=function(){this.is_open=!1;this.chat.close()};
var twitchChat=function(a){this.channel="#"+a;this.username="cuttlebay";this.password="oauth:lvflu1lbn7ewjo3qx2na7jyvc8a9yh";this.server="irc-ws.chat.twitch.tv";this.port=443};twitchChat.prototype.open=function(){this.webSocket=new WebSocket("wss://"+this.server+":"+this.port+"/","irc");this.webSocket.onmessage=this.onMessage.bind(this);this.webSocket.onerror=this.onError.bind(this);this.webSocket.onclose=this.onClose.bind(this);this.webSocket.onopen=this.onOpen.bind(this)};
twitchChat.prototype.onError=function(a){};twitchChat.prototype.onMessage=function(a){null!==a&&(a=this.parseMessage(a.data))&&a.message.startsWith("?")&&this.callback(a.username,a.message.substring(1))};twitchChat.prototype.onOpen=function(){var a=this.webSocket;null!==a&&1===a.readyState&&(a.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"),a.send("PASS "+this.password),a.send("NICK "+this.username),a.send("JOIN "+this.channel))};
twitchChat.prototype.onClose=function(){this.is_open&&this.open()};twitchChat.prototype.close=function(){this.is_open=!1;this.webSocket&&this.webSocket.close()};
twitchChat.prototype.parseMessage=function(a){var b={message:null,tags:null,command:null,original:a,channel:null,username:null};if("@"===a[0]){var c=a.indexOf(" "),d=a.indexOf(" ",c+1),e=a.indexOf(" ",d+1),f=a.indexOf(" ",e+1),g=a.indexOf(":",f+1);b.tags=a.slice(0,c);b.username=a.slice(c+2,a.indexOf("!"));b.command=a.slice(d+1,e);b.channel=a.slice(e+1,f);b.message=a.slice(g+1)}"PRIVMSG"!==b.command&&(b=null);return b};var youtubeChat=function(a){this.id=a;this.chat_id="none";this.next_token=""};
youtubeChat.prototype.open=function(){this.is_open=!0;var a=this,b=new XMLHttpRequest;b.open("GET","https://www.googleapis.com/youtube/v3/videos?"+("id="+this.id+"&part=liveStreamingDetails&key="+YOUTUBE_API_KEY));b.onreadystatechange=function(c){4==b.readyState&&200==b.status&&(c=JSON.parse(b.response),a.chat_id=c.items[0].liveStreamingDetails.activeLiveChatId,a.listMessages(a.next_token))};b.send(null)};youtubeChat.prototype.close=function(){this.is_open=!1};
youtubeChat.prototype.listMessages=function(a){if(this.is_open){var b=this,c=new XMLHttpRequest;c.open("GET","https://www.googleapis.com/youtube/v3/liveChat/messages?"+("liveChatId="+this.chat_id+"&part=snippet,authorDetails&profileImageSize=16&pageToken="+a+"&key="+YOUTUBE_API_KEY));c.onreadystatechange=function(d){4==c.readyState&&(200==c.status?(d=JSON.parse(c.response),0<d.pageInfo.totalResults&&""!==a&&b.parseMessages(d.items),b.next_token=d.nextPageToken,setTimeout(function(){b.listMessages(b.next_token)},
d.pollingIntervalMillis+10)):setTimeout(function(){b.listMessages(a)},1E4))};c.send(null)}};youtubeChat.prototype.parseMessages=function(a){function b(){setTimeout(function(){d.is_open&&a[c].snippet.displayMessage&&a[c].snippet.displayMessage.startsWith("?")&&d.callback(a[c].authorDetails.displayName,a[c].snippet.displayMessage.substring(1));c++;c<a.length&&b()},100)}var c=0,d=this;b()};
