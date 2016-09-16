#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 8
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

const byte interruptPinSingle = 2;
const byte interruptPinInterval = 3;

const byte outputPinLedSingle = 6;
const byte outputPinLedInterval = 7;

volatile unsigned long lastInterrupt = 0;
volatile boolean detectSingleValue = false;
volatile boolean detectInterval = false;

void setup() {
  Serial.begin(57600);
  dht.begin();

  pinMode(interruptPinSingle, INPUT_PULLUP);
  pinMode(interruptPinInterval, INPUT_PULLUP);

  pinMode(outputPinLedSingle, OUTPUT);
  pinMode(outputPinLedInterval, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(interruptPinSingle), singleButtonPressed, FALLING);
  attachInterrupt(digitalPinToInterrupt(interruptPinInterval), intervalButtonPressed, FALLING);
}

void loop() {
  //Send a sensor reading each second.
  delay(100);

  //Set LEDs
  digitalWrite(outputPinLedSingle, LOW);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Read temperature as Celsius (the default)
  float temp = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(temp)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  if (detectSingleValue) {
    detectSingleValue = false;
    Serial.println(temp);
  }

  if (detectInterval) {
    Serial.println(temp);
  }
}

void singleButtonPressed() {
  digitalWrite(outputPinLedSingle, HIGH);
  digitalWrite(outputPinLedInterval, LOW);

  //Prevent bouncy buttons
  if (millis() - lastInterrupt > 10) {
    detectSingleValue = true;
    detectInterval = false;

    lastInterrupt = millis();
  }
}

void intervalButtonPressed() {
  digitalWrite(outputPinLedSingle, LOW);

  //Prevent bouncy buttons
  if (millis() - lastInterrupt > 10) {
    detectSingleValue = false;
    detectInterval = !detectInterval;
    lastInterrupt = millis();

    if (detectInterval) {
      digitalWrite(outputPinLedInterval, HIGH);
    } else {
      digitalWrite(outputPinLedInterval, LOW);
    }
  }
}
