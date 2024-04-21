var txtDecoder = new TextDecoder();
var urlParams = new URLSearchParams(window.location.search);
var targetChannel = urlParams.get("channel");

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

window.onresize = (e=>{
	scrollToBottom();
})

function scrollToBottom(){
	
	document.querySelector(".chatbox-main").scrollTo(0,document.querySelector(".chatbox-main").scrollHeight);
}

onConnect = () =>{

	let windowColor = hexToRgb(pluginSettings.windowcolor);
	let borderColor = hexToRgb(pluginSettings.bordercolor);
	let windowStyle = "rgba("+windowColor.r+", "+windowColor.g+", "+windowColor.b+", "+pluginSettings.windowopacity/100+")";
	let borderStyle = "rgba("+borderColor.r+", "+borderColor.g+", "+borderColor.b+", "+pluginSettings.borderopacity/100+")";
	let useImage = pluginSettings.useimage;
	let backgroundImage = pluginSettings.backgroundimage;
	let bgOpacity = pluginSettings.bgopacity;
	let bgFill = pluginSettings.bgfill;
	let tileBG = pluginSettings.tilebg;
	let tileBGSize = pluginSettings.tilebgsize;
	let tileScrollX = pluginSettings.scrollbgx;
	let tileScrollY = pluginSettings.scrollbgy;
	let tileScrollSpeed = pluginSettings.scrollspeed;
	let fullWidth = pluginSettings.windowmode=="fwidth" || pluginSettings.windowmode=="fheight";
	let fullHeight = pluginSettings.windowmode=="fheight";
	let defaultFont = pluginSettings.defaultfont;
	let customFontURL = pluginSettings.customfonturl;
	let borderUseImage = pluginSettings.border_useimage;
	let borderImage = pluginSettings.border_image;
	let borderImageSlice = pluginSettings.border_image_slice;
	let borderImageWidth = pluginSettings.border_image_width;
	let borderImageMargin = pluginSettings.border_image_margin;

	if(targetChannel != null){
		if(pluginSettings.shares[targetChannel] != null){
			windowColor = hexToRgb(pluginSettings.shares[targetChannel].windowcolor);
			borderColor = hexToRgb(pluginSettings.shares[targetChannel].bordercolor);
			windowStyle = "rgba("+windowColor.r+", "+windowColor.g+", "+windowColor.b+", "+pluginSettings.shares[targetChannel].windowopacity/100+")";
			borderStyle = "rgba("+borderColor.r+", "+borderColor.g+", "+borderColor.b+", "+pluginSettings.shares[targetChannel].borderopacity/100+")";
			useImage = pluginSettings.shares[targetChannel].useimage;
			backgroundImage = pluginSettings.shares[targetChannel].backgroundimage;
			bgFill = pluginSettings.shares[targetChannel].bgfill;
			bgOpacity = pluginSettings.shares[targetChannel].bgopacity;
			tileBG = pluginSettings.shares[targetChannel].tilebg;
			tileBGSize = pluginSettings.shares[targetChannel].tilebgsize;
			tileScrollX = pluginSettings.shares[targetChannel].scrollbgx;
			tileScrollY = pluginSettings.shares[targetChannel].scrollbgy;
			tileScrollSpeed = pluginSettings.shares[targetChannel].scrollspeed;
			fullWidth = pluginSettings.shares[targetChannel].windowmode=="fwidth" || pluginSettings.shares[targetChannel].windowmode=="fheight";
			fullHeight = pluginSettings.shares[targetChannel].windowmode=="fheight";
			defaultFont = pluginSettings.shares[targetChannel].defaultfont;
			customFontURL = pluginSettings.shares[targetChannel].customfonturl;
			borderUseImage = pluginSettings.shares[targetChannel].border_useimage;
			borderImage = pluginSettings.shares[targetChannel].border_image;
			borderImageSlice = pluginSettings.shares[targetChannel].border_image_slice;
			borderImageWidth = pluginSettings.shares[targetChannel].border_image_width;
			borderImageMargin = pluginSettings.shares[targetChannel].border_image_margin;
		}
	}

	if(fullWidth == true){
		document.body.classList.add("fwidth");
	}
	if(fullHeight == true){
		document.body.classList.add("fheight");
		document.body.classList.add("fwidth");
	}
	document.documentElement.style.setProperty("--chatbox-font", defaultFont);
	document.documentElement.style.setProperty("--custom-font", "url("+customFontURL+")");
	document.documentElement.style.setProperty("--background-color", windowStyle);
	document.documentElement.style.setProperty("--border-color", borderStyle);
	if(useImage){
		document.documentElement.style.setProperty("--background-image", "url('"+getAssetPath(backgroundImage)+"')");
		document.documentElement.style.setProperty("--background-image-opacity", bgOpacity);
		if(tileBG){
			document.documentElement.style.setProperty("--background-size", tileBGSize+"px");
			document.documentElement.style.setProperty("--background-scroll-x", (tileBGSize*parseInt(tileScrollX))+"px");
			document.documentElement.style.setProperty("--background-scroll-y", (tileBGSize*parseInt(tileScrollY))+"px");
			document.documentElement.style.setProperty("--background-scroll-speed", (parseInt(tileScrollSpeed))+"s");
		}else{
			document.documentElement.style.setProperty("--background-size", bgFill);
		}
	}

	if(borderUseImage){
		document.documentElement.style.setProperty("--border-image", "url('"+getAssetPath(borderImage)+"')");
		document.documentElement.style.setProperty("--border-image-slice", borderImageSlice+"%");
		document.documentElement.style.setProperty("--border-image-width", borderImageWidth+"px");
		document.documentElement.style.setProperty("--border-image-margin", borderImageMargin+"px");
		document.querySelector(".chatbox-main").classList.add("border-image");
	}
}

function makeChatLine(message, user, emotes){

	let thisSettings = pluginSettings;
	if(targetChannel != null && pluginSettings.shares[message.channel] != null){
		thisSettings = pluginSettings.shares[message.channel];
	}
	
	//Numbers and chat commands will not show
	if(message.startsWith("!") || !isNaN(message)){
		return;
	}

	let userBadges = [];
	let windowBadges = [];

	if(user.badges){
		userBadges = Object.keys(user.badges);
	}

	if(user.mod == 1){userBadges.push("mod");}
	if(user.turbo == 1){userBadges.push("turbo");}
	if(user.firstMsg == 1){windowBadges.push("firstMsg");}
	if(user.discord == 1) {userBadges.push("discord");}
	
	let chatEl = document.createElement("div");
	chatEl.id = "c"+user.messageId;
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
	if(thisSettings.usernamecolor == false || user["color"] == "" || user["color"] == null){
		user["color"] = thisSettings.defaultnamecolor;
	}
	if(user.discord == 1){
		user["name"] = user["name"]+" #"+user["dChannel"];
	}
	chatLine += "<span class='message-content' style='color:"+thisSettings.textcolor+"'><span class='message-name "+userBadges.join(" ")+"' style='color:"+user["color"]+"'>"+user["name"]+":</span>";
	
	if(emotes.length > 0){
		
		emotes = emotes.sort(function(a,b){
			return a.start - b.start;
		});
		if(emotes.length == 1 && ((emotes[0].end+1)-emotes[0].start) == message.length){
			chatLine += getEmoteImage(emotes[0].id, 4.0);
		}else{
			for(let e in emotes){
				chatLine += message.substring(tPos, emotes[e].start);
				chatLine += getEmoteImage(emotes[e].id, 2.0);
				tPos = emotes[e].end+1;
				
			}
			chatLine += message.substring(tPos);
		}
		
	}else{
		chatLine += message;
	}
	chatLine += "</span>";
	chatEl.innerHTML = chatLine;
	
	
	if(document.body.classList.contains("fheight")){
		document.querySelector(".chatbox-main").prepend(chatEl);
	}else{
		document.querySelector(".chatbox-main").append(chatEl);
	}
	chatEl.ghostOut = () => {
		chatEl.style.animationName = "heightOut";
		chatEl.style.animationDuration = "0.5s";
		chatEl.style.animationIterationCount = 1;
		chatEl.addEventListener("animationend", function(){
			chatEl.remove();
		});
	}
	if(document.querySelector(".chatbox-main").children.length>parseInt(thisSettings.maxmessages)){
		if(document.body.classList.contains("fheight")){
			document.querySelector(".chatbox-main").lastElementChild.remove();
		}else{
			document.querySelector(".chatbox-main").firstElementChild.remove();
		}
	}
	if(thisSettings.messagetimeout != "0"){
		setTimeout( chatEl.ghostOut, parseInt(thisSettings.messagetimeout)*1000);
	}
	setTimeout(scrollToBottom, 200);
	//scrollToBottom();
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
	let scale = img.getAttribute("scale");
	var emoteID = img.getAttribute("emote");
	if(img.src.includes("animated")){
		img.src = "https://static-cdn.jtvnw.net/emoticons/v2/"+emoteID+"/static/light/"+scale;
	}else{
		console.log("EMOTE NOT FOUND");
	}
	
}

function getEmoteImage(id, scale){
	var url = "https://static-cdn.jtvnw.net/emoticons/v2/"+id+"/animated/light/"+scale+".0";
	let tag = "<img src='"+url+"' onerror='onEmoteError(this)' scale='"+scale+".0' emote='"+id+"'/>";
	return tag;
}

function deleteMessage(id){
	let chatEl = document.querySelector(".chatbox-main #c"+id+"");
	console.log("DELETE", id);
	chatEl.style.animationName = "heightOut";
	chatEl.style.animationDuration = "0.5s";
	chatEl.style.animationIterationCount = 1;
	chatEl.addEventListener("animationend", function(){
		chatEl.remove();
	});
}

function getOSCMessage(message){
	
	var address = message.address.split("/");
	
	switch(address[1]){
		case 'chat':
			switch(address[2]){
				case 'general':
					let messageData = JSON.parse(message.args[0]);
					if(targetChannel != null){
						if(messageData.channel != targetChannel){
							return;
						}
					}
					console.log(messageData.tags);
					makeChatLine(txtDecoder.decode(Uint8Array.from(Object.values(messageData.message))), 
					{messageId:messageData.tags.id, name:messageData.tags.displayName,color:messageData.tags.color, badges:messageData.tags.badges, 
						mod:messageData.tags.mod, subscriber:messageData.tags.subscriber, turbo:messageData.tags.turbo,
						firstMsg:messageData.tags["first-msg"], discord:messageData.tags.discord, dChannel:messageData.channelname}, 
					messageData.tags.emotes);
				break;
				case 'delete':
					let deleteId = message.args[0];
					console.log("DELETE", deleteId);
					deleteMessage(deleteId);
				break;
			}
		
		
		case 'settings':
			
		break;
	}
}