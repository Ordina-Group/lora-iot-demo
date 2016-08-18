int inputHigh = 2;
int inputMedium = 3;
int inputLow = 4;

int outputLedHigh = 8;
int outputLedMedium = 9;
int outputLedLow = 10;

int outputDataHigh = 11;
int outputDataMedium = 12;
int outputDataLow = 13;

void setup() {
  pinMode(inputHigh,    INPUT);
  pinMode(inputMedium,  INPUT);
  pinMode(inputLow,     INPUT);

  pinMode(outputLedHigh,    OUTPUT);
  pinMode(outputLedMedium,  OUTPUT);
  pinMode(outputLedLow,     OUTPUT);

  pinMode(outputDataHigh,   OUTPUT);
  pinMode(outputDataMedium, OUTPUT);
  pinMode(outputDataLow,    OUTPUT);
}

int highVal, mediumVal, lowVal = 0;

void loop() {
  
  highVal = digitalRead(inputHigh);
  mediumVal = digitalRead(inputMedium);
  lowVal = digitalRead(inputLow);

  if(highVal == 1) {
    highVal = 0;
  } else if(highVal == 0) {
    highVal = 1;
  }
  
  if(mediumVal == 1) {
    mediumVal = 0;
  } else if(mediumVal == 0) {
    mediumVal = 1;
  }

  if(lowVal == 1) {
    lowVal = 0;
  } else if(lowVal == 0) {
    lowVal = 1;
  }

  digitalWrite(outputLedHigh, highVal);
  digitalWrite(outputDataHigh, highVal);

  digitalWrite(outputLedMedium, mediumVal);
  digitalWrite(outputDataMedium, mediumVal);

  digitalWrite(outputLedLow, lowVal);
  digitalWrite(outputDataLow, lowVal);

  delay(500);
}
