const path = require("path");

class ChatBox {
	
	constructor() {
		this.onChat = this.onChat.bind(this);
		this.onEvent = this.onEvent.bind(this);
	}

	expressions ={
		neutral:String.raw`
		/╲/\( ºo ω oº )/\╱\
	`,
		happy:String.raw`
		/╲/\( º^ ω ^º )/\╱\
	`,
		uwu:String.raw`
		/╲/\( ºU ω Uº )/\╱\
	`,
		owo:String.raw`
		/╲/\( ºO ω Oº )/\╱\
	`,
		pwq:String.raw`
		/╲/\( ºp ω qº )/\╱\
	`,
	};

	lastMessage = null;
	
	commandList = {
		
	};
	
	txtEncoder = new TextEncoder();

	deleteMessage(userstate){
		console.log("DELETED", userstate);
		sendToTCP("/chat/delete", userstate["target-msg-id"]);
	}
	
	
	testMe(){
		
	}

	onChat(message){
		
		if(message.message.includes("<iframe") ||
		message.message.includes("<img") ||
		message.message.includes("<video")){
			
			message.respond("I see an HTML media tag, so I probably shouldn't send that to chatbox.");
			return;
		}

		let owo = this.settings.owo;
		if(message.channel != twitch.homeChannel && this.settings.shares[message.channel] != null){
			owo = this.settings.shares[message.channel]?.owo;
		}
		if(owo == true){
			if((message.message.toLowerCase().length == 3 && message.message.toLowerCase().charAt(1)=="w")
			||(message.message.toLowerCase().length == 5 && message.message.toLowerCase().charAt(2)=="w")){
				let eyes = ["?","?"];
				if(message.message.toLowerCase().length == 3 && message.message.toLowerCase().charAt(1)=="w"){
					eyes = [message.message.charAt(0), message.message.charAt(2)];
				}else{
					eyes = [message.message.charAt(0)+message.message.charAt(1), message.message.charAt(3)+message.message.charAt(4)];
				}
				let expression = String.raw`
				/╲/\( º${eyes[0]} ω ${eyes[1]}º )/\╱\
				`
				message.respond(expression);
			}
		}

		

		if(message.message == "!botinchat" && (twitch.chatIsBroadcaster(message) || twitch.chatIsMod(message))){
			if(message.channel != twitch.homeChannel && this.settings.shares[message.channel] != null){
				this.settings.shares[message.channel].botinchat = !this.settings.shares[message.channel].botinchat;
			}else{
				this.settings.botinchat = !this.settings.botinchat;
			}
			
			if(this.settings.botinchat){
				message.respond("I will show in Chatbox "+this.expressions.happy);
			}else{
				message.respond("I will not show in Chatbox "+this.expressions.pwq);
			}
		}

		if(message.message.startsWith("!")){
			return;
		}

		let botInChat = this.settings.botinchat;
		if(message.channel != twitch.homeChannel && this.settings.shares[message.channel] != null){
			botInChat = this.settings.shares[message.channel].botinchat;
		}
		if(botInChat == false){
			if(message.username == message.botUsername){
				return;
			}
		}

		if(message.message == this.lastMessage){
			return;
		}
		this.lastMessage = message.message;
		//console.log(message);
		sendToTCP("/chat/general", JSON.stringify({message:this.txtEncoder.encode(message.message), channel:message.channel, tags:message.tags}));
	}

	onEvent(type, data){
		console.log("ON EVENT",type, data);
		if(type == "messagedeleted" && data.platform == "twitch"){
			this.deleteMessage(data.userstate);
		}
	}
}

module.exports = ChatBox;