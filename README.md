SLOTMACHINE
===========================================================

PURPOSE:
-----------------------------------------------------------
Slotmachine web application for use at devoxx 2015!

Available web services:

- [localhost:8080/register](http://localhost:8080/register)
    - GET for more information
    - POST to submit data
- Web socket at port 8081. This can be used to receive messages from the Arduino.
    - When the button is pressed a JSON message is sent to all listeners: {"buttonPressed": "true"}
    - When the button is released a JSON message is sent to all listeners: {"buttonPressed": "false"}


INSTALLATION:
-----------------------------------------------------------
Make sure you have at least Node.js V4 installed on your system.

- npm install
- npm start

This will install anything the app needs and start it up.
You can then browse to the app at [localhost:8080/](http://localhost:8080/)


ARDUINO:
-----------------------------------------------------------
To use your arduino with this project it needs to have a specialised firmware.
Normally the standard firmata firmware would suffice, but since we would like to use some adafruit pixels a custom firmware is required!

- Make sure you have the Arduino IDE installed
- Download the following project: [node-pixel](https://github.com/ajfisher/node-pixel)
- Open a command prompt in the unzipped folder of the downloaded project
- Install grunt by typing: "npm install -g grunt-cli" This may have to be done as admin!
- Compile the Arduino code by typing: "grunt build"
- Go to the "/firmware/build/node_pixel_firmata" folder and open the "node_pixel_firmate.ino" file in the Arduino IDE
- Upload the script to your Arduino and close the Arduino IDE
