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
			
			sayInChat("I ate that bug. It was delicious "+this.expressions.happy);
			return;
		}

		if(this.settings.owo){
			if((message.message.toLowerCase().length == 3 && message.message.toLowerCase().charAt(1)=="w")
			||(message.message.toLowerCase().length == 5 && message.message.toLowerCase().charAt(2)=="w")){
				let eyes = message.message.split(/[wW]/g);
				let expression = String.raw`
				/╲/\( º${eyes[0]} ω ${eyes[1]}º )/\╱\
				`
				sayInChat(expression);
			}
		}

		if(message.message == "!botInChat"){
			this.settings.botinchat = !this.settings.botinchat;
			if(this.settings.botinchat){
				sayInChat("I will show in Chatbox "+this.expressions.happy);
			}else{
				sayInChat("I will not show in Chatbox "+this.expressions.pwq);
			}

			
		}

		if(!this.settings.botinchat){
			if(message.username == username){
				return;
			}
		}
		
		sendToTCP("/chat/general", JSON.stringify({message:this.txtEncoder.encode(message.message), tags:message.tags}));
	}
}

module.exports = ChatBox;