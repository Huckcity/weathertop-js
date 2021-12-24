# WeatherTop IoT

#### Student Name: Adam Gibbons Student ID: 20095362

  

The [WeatherTop IoT](https://weathertop-iot.herokuapp.com/) platform is a fully developed iteration of the existing platform that now enables users to **add their own locations** and, using MQTT subscriptions, add **any number of subscriptions from any publicly accessible MQTT broker**. These subscriptions are then tracked and the data stored, including **live real-time updates** through the means of MQTT WebSocket client connection.  

Further, the platform has an area for tracking local network devices, should the user wish to also publish this data to provide info on their local network.  

#### Testing:
To test, please log in with the following details. Feel free to make any changes, and optionally view the dev tools console to see the activity in real time *(all processes will remain live for the near future!)*
> email: adam.p.gibbons@gmail.com
> password: test1

AND/OR
> email: homer@simpson.com
> password: secret

Please also try adding your own broker settings and a subscription of your own, it ***should*** work :)

### A breakdown of the development process:
 

* Install and set up **zigbee2mqtt bridge** on my Pi 400 with the Sonoff Gateway

* Connected all my **sensors** to the gateway for initial testing

* Spun up a **compute instance** (DreamCompute on dreamhost.com) to **host my own MQTT broker**

* Set up **Mosquitto MQTT broker** on the DHC instance (208.113.166.76, port 1883/9001 for MQTT/Websocket respectively)

* **Reconfigured** the **zigbee2mqtt** gateway to use the remote **DHC server** as the **MQTT broker**

* Spent a ***LOT*** of time working on the website to get the websocket connection working

* Finally pushed changes live only to discover I was going to get **mixed content errors** in the browser with an **unsecured broker**

* Set up a subdomain (mqtt.huckcity.ie) to associate with the broker IP in order to **install a Let's Encrypt SSL certificate** (this is configured to auto renew)

* Spent more time trying to determine correct settings for **secure websocket connections**

* Finally succeeded and moved off of hardcoded values to test **user configurable broker** settings on the website

* Great success, the website is now **broker agnostic**!

*  ***LOTS*** more work on the website:

- * Subscribe to topics and receive live updates in the console

- * Turn console updates in to live DOM updates

- * Then figure out how to store the data as it arrives (API POST requests to the server to update the MongoDB without reloading the page)

- * Similarly, retrieve the most recent stored data so that the page is always in a 'live' state even after refresh

* The '**location' page** is **dynamically generated** based on the above processes, and **updates in real time** as long as it is open

* With the use of **QoS settings**,  when the page is not open the **messages remain queued**, and **arrive once the client connects** and subscribes again

* Next was **MAC address tracking**, with the Raspberry Pi 4B running a service that **scans my local network**. This service should be agnostic as well, but the tracking script could be written to be more reusable. Proof of concept though, and **also incorporates live updates**.

* MacStatus script was configured to run headless with **visual feedback** to indicate connected/transmitting/disconnected state

* **Pi400 BrokerCheck service** implemented to allow me to check number of stored messages at any given time at the **push of a button**. This queue can get large when website is not active!

  
  

### Stretch Goals:

-------------

- Provide charting for historical data

- Allow "on/off" type subscriptions to be published back to

- Provide a means to create actionable "rules" e.g. > *if **SENSOR** is "false" && **MAC_ADDRESS** is "online" then email user*

### Alternative Approach:
---
The project was slow to start as I couldn't determine the best tech stack for the website. I knew the Handlebars template engine and static page generation was not ideal, and wanted to go with a complete separation of concerns with a REST API backend and Svelte/Ember.js client, in order to take advantage of data-binding. ([I actually started developing this](https://github.com/Huckcity/weathertop-svelte)) 

I soon realised that this rebuilding of the Weathertop platform would take to long and went with the current approach. This version is in a working but fragile state, and not production ready.


## Tools, Technologies and Equipment

  

### Hardware

  

-  [Raspberry Pi 4B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/)

-  [Raspberry Pi 400](https://www.raspberrypi.com/products/raspberry-pi-400/)

-  [Aqara Temperature/Humidity Sensors](https://www.amazon.co.uk/gp/product/B07D37FKGY/ref=ppx_yo_dt_b_asin_title_o02_s01?ie=UTF8&psc=1)

-  [Sonoff Motion Sensor](https://www.amazon.co.uk/gp/product/B08BCKHSB7/ref=ppx_yo_dt_b_asin_title_o04_s00?ie=UTF8&psc=1)

-  [ADJU Zigbee Smart Plugs](https://www.amazon.co.uk/gp/product/B08CRRKS4K/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1)

-  [Sonoff Zigbee Gateway](https://www.amazon.co.uk/gp/product/B09KXTCMSC/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1)

  

### Software

  

-  [Zigbee2MQTT Bridge](https://www.zigbee2mqtt.io/)

-  [Paho MQTT Python Library for Rpi based connections](https://pypi.org/project/paho-mqtt/)

-  [MQTT.js Websocket Client for browser based connections](https://github.com/mqttjs)

-  [Mosquitto MQTT Broker](https://mosquitto.org/)

-  [Adafruit Character LCD Library](https://circuitpython.readthedocs.io/projects/charlcd/en/latest/api.html)

  
  

## Project Repository

  

This project is split over a few repo's. The main website is all under the IOT branch of the Weathertop JS repo. In particular, the majoroty of the work takes place on the [location.hbs handlebars template file](https://github.com/Huckcity/weathertop-js/blob/iot/views/location.hbs), as all of the websocket activity and live database read/writes take place asyncronously.

  

[WeatherTop IoT Branch Repo(this)](https://github.com/Huckcity/weathertop-js/tree/iot)

  

[BrokerCheck](https://github.com/Huckcity/BrokerCheck)

  

[MacStatus](https://github.com/Huckcity/macstatus)


