const path = require("path");

class ChatBox {
	
	constructor() {
		this.onChat = this.onChat.bind(this);
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
	
	
	testMe(){
		
	}

	//onEvent(eventData){}
	
	
	onChat(message){
		
		if(message.message.includes("<iframe") ||
		message.message.includes("<img") ||
		message.message.includes("<video")){
			
			message.respond("I see an HTML media tag, so I probably shouldn't send that to chatbox.");
			return;
		}

		if(this.settings.owo){
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

		

		if(message.message == "!botinchat" && (chatIsBroadcaster(message) || chatIsMod(message))){
			this.settings.botinchat = !this.settings.botinchat;
			if(this.settings.botinchat){
				message.respond("I will show in Chatbox "+this.expressions.happy);
			}else{
				message.respond("I will not show in Chatbox "+this.expressions.pwq);
			}
		}

		if(message.message.startsWith("!")){
			return;
		}

		if(!this.settings.botinchat){
			if(message.username == botUsername){
				return;
			}
		}

		if(message.message == this.lastMessage){
			return;
		}
		this.lastMessage = message.message;
		
		sendToTCP("/chat/general", JSON.stringify({message:this.txtEncoder.encode(message.message), channel:message.channel, tags:message.tags}));
	}
}

module.exports = ChatBox;