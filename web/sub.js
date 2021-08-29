var mqtt;
var reconnectTimeout = 2000;
var host=location.host; //change this
var port=9001;

function onFailure(message) {
  console.log("Connection Attempt to Host "+host+"Failed");
  setTimeout(MQTTconnect, reconnectTimeout);
    }
function onMessageArrived(msg){
  
  out_msg="Message received "+msg.payloadString+"<br>";
  if (msg.destinationName == "/tutorteknik/suhu"){
        document.getElementById("suhu").innerHTML = ""+msg.payloadString;
  }

  if (msg.destinationName == "/tutorteknik/kelembaban"){
    document.getElementById("kelembaban").innerHTML = ""+msg.payloadString;
    }   
  
}

 function onConnect() {
console.log("Connected ");
mqtt.subscribe("/tutorteknik/#");
}

function MQTTconnect() {
console.log("connecting to "+ host +" "+ port);
var x=Math.floor(Math.random() * 10000); 
var cname="orderform-"+x;
mqtt = new Paho.MQTT.Client(host,port,cname);
var options = {
  timeout: 3,
  onSuccess: onConnect,
  onFailure: onFailure,
   };
mqtt.onMessageArrived = onMessageArrived

mqtt.connect(options); 
}

function nyalaLampu(){
  var pesankirim = new Paho.MQTT.Message("0");
  pesankirim.destinationName = "/tutorteknik/relay";
  mqtt.send(pesankirim); 
}

function matiLampu(){
    var pesankirim = new Paho.MQTT.Message("1");
    pesankirim.destinationName = "/tutorteknik/relay";
    mqtt.send(pesankirim); 
}
