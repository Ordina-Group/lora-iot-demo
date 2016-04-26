LoRa-IoT-Client application
===========================
This is the client application for the LoRa-IoT-demo!
This client acts as a bridge to controll the Arduino (and the LEDs and Button connected to it).
Data from and to the Arduino is relayed via the websocket that is hosted by the server application.

PURPOSE:
--------
Control the Arduino when the Server application does not have control over the Arduino device. This is done by connecting to the server side provided websocket.
Messages are received from the websocket, analysed and processed (and respective actions are taken to change the LED strip state)
Messages are also sent when the state of the button is changed (pressed or released).

INSTALLATION:
-------------
Make sure you have at least Node.js V4 installed on your system.

- Make sure you are in the application subfolder (cd lora-iot-client)
- npm install
- npm install forever -g (this can be skipped if already installed)
- Check the /lora-iot-client/resources/config.js file and make changes if required.
- Make sure you are in the root of the project (not the application subfolder, cd ..)
- Make sure that the server has already been started! This will NOT work when the server is not up (or the connection to the websocket fails)!!!
- Make sure that you have the Arduino connected via usb and the serial port is not being used by any other program (like the Arduino IDE)!!!
- execute the following command: forever start lora-iot-client/src/startup.js

This will install anything the app needs and start it up.

DISCLAIMER:
-----------
This is hacky code, it can be unclean in places, despite efforts to keep it as clean as possible.
If you have constructive criticism please open an issue, or even better fix the code and make a PR.