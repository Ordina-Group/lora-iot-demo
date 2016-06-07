LoRa-IoT-Server application
===========================
This is the server application for the LoRa-IoT demo!
This server application hosts the web apps (/slotmachine and /booze) as well as the REST endpoints.
This server application also takes care of the LoRa services and provides URL's which data can be posted to in order to receive notifications from sensors/lora enabled devices.
This server can also control an Arduino, this however can only be used when the Arduino is connected to the server machine via USB. When the server is deployed remotely please
use the client application to control the Arduino.

PURPOSE:
--------
Hosts the Booze web application.
Hosts Slotmachine web application.
This application acts as the main hub to hosts both web applications, provides a way for data to be received from the LoRa devices and also provides a websocket for 
webpage/client-server communication.

Available web services:

- [url:port/register](http://localhost:7080/register)
    - GET for more information
    - POST to submit data
- [url:port/pxm/devices](http://localhost:7080/pxm/devices)
    - Lists the devices that have been registered to our Proximus LoRa account
- [url:port/pxm/buttonTrigger](http://localhost:7080/pxm/buttonTrigger)
    - When data is posted to this URL through the Proximus backend, we know a certain LoRa device has been activated/updated its data
    - In this application this endpoint is used to control the /slotmachine application
- [url:port/pxm/levelTrigger/](http://localhost:7080/pxm/levelTrigger/)
    - When data is posted to this URL through the Proximus backend, we know a certain LoRa device has been activated/updated its data
    - In this application this endpoint is used to control the /booze application
- [url:port/booze/levelFull](http://localhost:7080/booze/levelFull)
    - Used to simulate the /booze application to represent a full level of the booze column
- [url:port/booze/levelHigh](http://localhost:7080/booze/levelHigh)
    - Used to simulate the /booze application to represent a high level of the booze column
- [url:port/booze/levelMedium](http://localhost:7080/booze/levelMedium)
    - Used to simulate the /booze application to represent a medium level of the booze column
- [url:port/booze/levelLow](http://localhost:7080/booze/levelLow)
    - Used to simulate the /booze application to represent a low level of the booze column
- [url:port/booze/levelEmpty](http://localhost:7080/booze/levelEmpty)
    - Used to simulate the /booze application to represent an empty level of the booze column
    
There may be other endpoints but they are not actively used. Check the server.js file for the full list of available endpoints.


INSTALLATION:
-------------
Make sure you have at least Node.js V4 installed on your system.

- Make sure you are in the application subfolder (cd lora-iot-server)
- npm install
- npm install forever -g (this can be skipped if already installed)
- Check the /lora-iot-server/resources/config.js file and make changes if required.
- Make sure you are in the root of the project (not the application subfolder, cd ..)
- execute the following command: forever start lora-iot-server/src/startup.js
    - If you do this in the wrong folder no http content can be served (this issue is being looked into)

This will install anything the app needs and start it up.
You can then browse to the app at [localhost:7080/](http://localhost:7080/)

TECHNICAL DETAILS & SCHEMATICS:
-------------------------------
TODO!

CODE:
-----
The code used is derived from the WeatherGenie application, this application can be found here: https://github.com/beele/WeatherGenie

DISCLAIMER:
-----------
This is hacky code, it can be unclean in places, despite efforts to keep it as clean as possible.
If you have constructive criticism please open an issue, or even better fix the code and make a PR.