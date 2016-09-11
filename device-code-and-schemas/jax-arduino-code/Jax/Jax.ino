#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 8
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const byte interruptPinSingle = 2;
const byte interruptPinInterval = 3;

volatile boolean detectSingleValue = false;
volatile boolean detectInterval = false;

void setup() {
  Serial.begin(57600);
  dht.begin();
  
  pinMode(interruptPinSingle, INPUT_PULLUP);
  pinMode(interruptPinInterval, INPUT_PULLUP);
  
  attachInterrupt(digitalPinToInterrupt(interruptPinSingle), singleButtonPressed, CHANGE);
  attachInterrupt(digitalPinToInterrupt(interruptPinInterval), intervalButtonPressed, CHANGE);
}

void loop() {
  //Wait 500ms (250 required to read the values, and then some processing)
  delay(500);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Read temperature as Celsius (the default)
  float temp = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(temp)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  if(detectSingleValue) {
     detectSingleValue = false; 
     Serial.println(temp);
  }
  
  if(detectInterval) {
      Serial.println(temp);
  }
}

void singleButtonPressed() {
    detectSingleValue = true;
    detectInterval = false;
}

void intervalButtonPressed() {
    detectSingleValue = false;
    detectInterval = !detectInterval;
}
