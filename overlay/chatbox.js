var oscConnected = false;

var txtDecoder = new TextDecoder();

var testUser = {
	"name":"GreyBoiGaming",
	"color":"#FF0000",
	"mod":"0",
	"subscriber":"0",
	"firstMsg":"0",
	"badges":{}
}

var testEmote = [
        {
          "id": "emotesv2_e0276ad25377439eb77862ecc5d72005",
          "start": 6,
          "end": 21
        },
        {
          "id": "555555584",
          "start": 28,
          "end": 29
        },
        {
          "id": "emotesv2_7b316222884b49eab03546dd056d66a0",
          "start": 38,
          "end": 44
        }
      ];
	
var testMessage = "Hello goodgr8BeanHeart I am <3 da boi HeyGuys";
var longTestMessage = "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley";

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

onOSCOpen = () =>{
	
	let windowColor = hexToRgb(pluginSettings.windowcolor);
	let borderColor = hexToRgb(pluginSettings.bordercolor);
	let windowStyle = "rgba("+windowColor.r+", "+windowColor.g+", "+windowColor.b+", "+pluginSettings.windowopacity/100+")";
	let borderStyle = "rgba("+borderColor.r+", "+borderColor.g+", "+borderColor.b+", "+pluginSettings.borderopacity/100+")";
	document.querySelector(".chatbox-main").style.backgroundColor = windowStyle;
	document.querySelector(".chatbox-main").style.borderColor = borderStyle;
}

function makeChatLine(message, user, emotes){
	
	//Numbers and chat commands will not show
	if(message.startsWith("!") || !isNaN(message)){
		return;
	}

	let userBadges = [];
	let windowBadges = [];

	if(user){
		userBadges = Object.keys(user.badges);
	}

	if(user.mod == 1){userBadges.push("mod");}
	if(user.subscriber == 1){userBadges.push("subscriber");}
	if(user.turbo == 1){userBadges.push("turbo");}
	if(user.firstMsg == 1){console.log("FIRST MESSAGE"); windowBadges.push("firstMsg");}
	
	let chatEl = document.createElement("div");
	chatEl.className = "chatbox-message "+windowBadges.join(" ");
	
	let chatLine = "";
	
	if(user == null){
		user = {
			name:"Anon",
			color:"#000000"
		}
	}
	
	let tPos = 0;
	if(emotes == null){emotes = [];}
	console.log("MESSAGE", message, emotes);
	if(pluginSettings.usernamecolor == false || user["color"] == "" || user["color"] == null){
		user["color"] = pluginSettings.defaultnamecolor;
	}
	chatLine += "<span class='message-content' style='color:"+pluginSettings.textcolor+"'><span class='message-name "+userBadges.join(" ")+"' style='color:"+user["color"]+"'>"+user["name"]+":</span>";
	if(emotes.length > 0){
		emotes = emotes.sort(function(a,b){
			console.log(a.start, b.start);
			return a.start - b.start;
		});
		
		for(let e in emotes){
			chatLine += message.substring(tPos, emotes[e].start);
			chatLine += getEmoteImage(emotes[e].id, 1.0);
			tPos = emotes[e].end+1;
			
		}
		chatLine += message.substring(tPos);
	}else{
		chatLine += message;
	}
	chatLine += "</span>";
	chatEl.innerHTML = chatLine;
	
	document.querySelector(".chatbox-main").append(chatEl);
	
	setTimeout(() => {
		chatEl.style.animationName = "ghostout";
		chatEl.style.animationDuration = "0.5s";
		chatEl.style.animationIterationCount = 1;
		chatEl.addEventListener("animationend", function(){
			chatEl.remove();
		});
	}, 30000);
}

function testChatLine(customMsg){
	if(customMsg == null){
		if(Math.round(Math.random()) == 1){
			makeChatLine(testMessage, testUser, testEmote);
		}else{
			makeChatLine(longTestMessage, testUser, null);
		}
	}else{
		if(Math.round(Math.random()) == 1){
			makeChatLine(customMsg, testUser, testEmote);
		}else{
			makeChatLine(customMsg, testUser, null);
		}
	}
	
}

function onEmoteError(img){
	console.log(img);
	var emoteID = img.getAttribute("emote");
	if(img.src.includes("animated")){
		img.src = "https://static-cdn.jtvnw.net/emoticons/v2/"+emoteID+"/static/light/1.0";
	}else{
		console.log("EMOTE NOT FOUND");
	}
	
}

function getEmoteImage(id, scale){
	var url = "https://static-cdn.jtvnw.net/emoticons/v2/"+id+"/animated/light/1.0";
	let tag = "<img src='"+url+"' onerror='onEmoteError(this)' emote='"+id+"'/>";
	return tag;
}

function getOSCMessage(message){
	
	console.log("I HEARD SOMETHING",message);
	
	var address = message.address.split("/");
	
	switch(address[1]){
		case 'chat':
		let messageData = JSON.parse(message.args[0]);
			
			makeChatLine(txtDecoder.decode(Uint8Array.from(Object.values(messageData.message))), 
			{name:messageData.tags.displayName,color:messageData.tags.color, badges:messageData.tags.badges, 
				mod:messageData.tags.mod, subscriber:messageData.tags.subscriber, turbo:messageData.tags.turbo,
				firstMsg:messageData.tags.firstMsg}, 
			messageData.tags.emotes);
		break;
		case 'settings':
			
		break;
	}
}