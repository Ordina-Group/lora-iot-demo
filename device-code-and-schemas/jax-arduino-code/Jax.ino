#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 2     // what pin we're connected to

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

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
  attachInterrupt(digitalPinToInterrupt(detectInterval), intervalButtonPressed, CHANGE);
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
