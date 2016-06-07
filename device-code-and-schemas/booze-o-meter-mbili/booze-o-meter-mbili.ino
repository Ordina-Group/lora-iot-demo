#include <Wire.h>
#include <ATT_LoRa_IOT.h>
#include <MicrochipLoRaModem.h>
#include "keys.h"

#define SERIAL_BAUD 57600

int digitalInputLowValuePin = 20;
int digitalInputMediumValuePin = 19;
int digitalInputHighValuePin = 18;

int lowValue = 0;
int prevLowValue = 0;
int mediumValue = 0;
int prevMediumValue = 0;
int highValue = 0;
int prevHighValue = 0;

//Create modem and device instances!
MicrochipLoRaModem Modem(&Serial1);
ATTDevice Device(&Modem);

void setup() {
  //Set up inputs
  pinMode(digitalInputLowValuePin, INPUT);             
  pinMode(digitalInputMediumValuePin, INPUT);  
  pinMode(digitalInputHighValuePin, INPUT);   

  //Serial comms
  Serial.begin(SERIAL_BAUD);                    // USB serial comm                 
  Serial1.begin(Modem.getDefaultBaudRate());    // Between Mbili and LoRa modem
  
  while(!Device.Connect(DEV_ADDR, APPSKEY, NWKSKEY)) {
    //Waiting for device connection!
  }
  //Device ready, perform init
	Serial.println("retrying...");
  Device.SetMaxSendRetry(0);
  Device.SetMinTimeBetweenSend(0);
  Serial.println("Ready to send data");               
}

void serialEvent1(){
  Device.Process();
}

void loop() {
  lowValue = digitalRead(digitalInputLowValuePin);
  mediumValue = digitalRead(digitalInputMediumValuePin);
  highValue = digitalRead(digitalInputHighValuePin);

  bool sendUpdate = false;
  if(lowValue != prevLowValue) {
    sendUpdate = true; 
    prevLowValue = lowValue;   
  }
  if(mediumValue != prevMediumValue) {
    sendUpdate = true;
    prevMediumValue = mediumValue;
  }
  if(highValue != prevHighValue) {
    sendUpdate = true;
    prevHighValue = highValue;
  }

  //Send the values combined in a single int, the values will all be either 0 or 1
  //The single int has the highVale at the 10^2 position, the mediumValue at the 10^1 position and the lowValue at the 10^0 postion.
  if(sendUpdate) {
    Serial.println("Value changed!");
    Serial.println(highValue * 100 + mediumValue *10 + lowValue);  
    sendValue((float) highValue * 100 + mediumValue *10 + lowValue);
  }

  //Only do this every 5 seconds, this prevents too many messages being sent!
  delay(5000);
}

bool sendValue(float val){
  Serial.print("Data: ");
  Serial.println(val);
  
  bool res = Device.Send(val, LIGHT_SENSOR);
  if(res == false) {
    Serial.println("Data was not sent! Please try again (maybe wait 10-15 seconds)..."); 
  }
  return res;
}

