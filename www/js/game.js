$(document).ready(function(){
	var machine1 = $("#machine1").slotMachine({
		active	: 1,
		delay	: 300
	});
	
	var machine2 = $("#machine2").slotMachine({
		active	: 1,
		delay	: 300
	});
	
	var machine3 = $("#machine3").slotMachine({
		active	: 1,
		delay	: 300
	});
	
	function onComplete(active){
		switch(this.element[0].id){
			case 'machine1':
				$("#machine1Result").text("Index: "+this.active);
				break;
			case 'machine2':
				$("#machine2Result").text("Index: "+this.active);
				break;
			case 'machine3':
				$("#machine3Result").text("Index: "+this.active);
				break;
		}
	}
	
	$("#slotMachineButton1").click(function(){
		
		machine1.shuffle(5, onComplete);
		
		setTimeout(function(){
			machine2.shuffle(5, onComplete);
		}, 500);
		
		setTimeout(function(){
			machine3.shuffle(5, onComplete);
		}, 1000);
		
	})
});