# How to start project locally
The `master` branch contains the code to start the application locally.
## Setup Backend
  - Make sure your Node Version is at least 16.x.x
  - Place the .env file we sent with the project handover email in the pwp-backend root folder
  1) cd pwp-backend
  2) `npm install`
  3) `npm install tsoa -g`
  4) `npm run build`
  5) cd pwp-frontend 
  6) `npm install`

## Start the server and client (Frontend)
### Start backend and frontend together
  - go to backend directory (cd pwp-backend)
  - `npm run dev`
### Start backend only
  - go to backend directory (cd pwp-backend)
  - `npm run server`
### Start frontend only
  - go to frontend directory (cd pwp-frontend)
  - `npm run start`

## Documentation Backend
  The Endpoint Documentation is available under http://localhost:4500/docs/ or https://localhost:4500/docs

## Documentation Frontend
  Open App on http://localhost:3000/



# How to access deployed application
The `release` branch contains the version of the application that is deployed on the server. It can be accessed via this address:
http://pwp21.medien.ifi.lmu.de/
## Test user
- Username: Jakob; Password: 123456789
- Username: Sebastian; Password: 123456789
## Documentation Backend
http://pwp21.medien.ifi.lmu.de:4500/docs/ or https://pwp21.medien.ifi.lmu.de:4500/docs/


# To Do Documentation
## Structure
Frontend (folder) Structure was as follows:
* **public** (html and some picture are defined here)
* **src:**
  * **actions** (Constants, User Actions (registration, logout, login) and Hub actions (get data of the endpoints from hub) 
  * **components:** 
         * **authentification-folder**( login and register functionality),
         * **devices Features - folder**( devices Functionality), 
         * **devices Manager - folder**(overview devices of the hub), 
         * **main - folder**( functionality of all pages), 
         * **mqqttListener - folder**( functionality of mqtt) )
         * **reducer** (reducer functions for hub id, user registration and login, logOut)
         * **utilis** (functions to show proessbar, messages, to set the token, sort the data of dropdown)
  
* **store.js** ( the store is here defined)
* **index.js** (the main functionality of frontend)
* **app.js** (All pages are here defined)
 

The structure of our project part consists of 3 main components - The database, where the users, hubs as well as the devices are stored, the backend and the frontend, that is the actual dashboard. 

But how exactly does the communication between these components work?
There are 3 important parts in our dashboard: the users, the hubs and the devices.
Let's look at the users and hubs first. The frontend communicates with the backend for user actions, such as a user login or editing a hub, by issuing get and post requests, to which the frontend then receives a response. 
The backend in turn interacts with the database by creating or requesting appropriate information and sending it to the frontend as a response. 

Both the backend and the frontend are connected to the MQTT broker of the modes and communications group via their own MQTT client. When new devices are added, the MQTT client in the backend receives the corresponding Thing Description of the device, which can then be stored in the database. Since the various devices are only available in specific hubs, only the respective owner or member of a hub can operate the device via the dashboard. To display the devices that a user has access to, the frontend communicates with the backend as described before.
Through the two MQTT clients in the backend and frontend, the dashboard is also able to receive live status updates of the devices, for example that the mixer is now stirring. Therefore the Mqtt client of the frontend checks the topic under which a message is published. If it matches the device, the updates are displayed in the dashboard. 

Additionally, the frontend communicates with the MQTT broker when an action of a device is selected on the dashboard. The MQTT client then sends a message to the broker under a specific topic that refers to the device and its actions. Of course, only actions specified in the Thing Description of the device can be sent. 
If this action requires an additional input (e.g. InputType is float), a window opens in the Dashboard in which the corresponding values are to be entered, which are then transmitted.

We have also thought about the security. For this reason, for example, only the owner of a hub can edit the respective hub and add or remove members, as well as delete the hub. There is also an authentication for the communication between frontend and backend. Each user receives a token automatically generated during registration, which must be sent with each request in order to authenticate and receive a response. Authentication is also necessary when connecting to the MQTT broker. In addition, the MQTT client in the backend receives all the information from the broker while the MQTT client in the frontend only receives the information for the hub in which it is a member.


## Technologies
### MERN Stack
we decided to use a MERN stack. A MERN stack is a Javascript stack that is used for a simpler and easier development of a full-stack application. <br>
It consists of: <br>
- MongoDB = document database
- Express = node.js web framework
- React = a client-side JavaScript framework
- Node = the premier JavaScript web server

We also used a MQTT Broker. <br>
<br>
These different technologies work together as follows: <br>
The Broker provides necessary information for our environment.MongoDB is the database in which the data is stored. The server consisting of express and node.js communicates with this database. This is where the exchange of information between the frontend and the backend takes place, as well as the data processing.
The data is then displayed with the help of react in the frontend and made available to the user, who has than the possibility to change it through the frontend.
This information then goes back to the server, where it is processed and, if necessary, passed on to the database when data is deleted or added.

## Express Backend
We used Express together with tsoa. The reason for that was, that, for one, we had to use Typescript for the whole application. This made it easier to ensure that all of our Interfaces behave consistent throughout the whole application. Furthermore, tsoa gave us the possibility to autormatically generate a swagger documentation from our source code with minimal additional workload. And third, tsoa made handling errors of any kind and authentication much easier. </br>
Apart from that, we used the following technologies among other things:
* **bcryptjs** to encrypt passwords.
* **dotenv** so that we didn't have to put stuff like the database access into the source code
* **jsonwebtoken** to make sure that only authorized users can make requests to our backend
* **cors** for obvious reasosns
* **eslint and prettier** for better formatted code <br/>

The projects structure was as follows:
* **src**
  * **controllers** (The endpoints and additional information for the documentation are defined here)
  * **db** (Database connection)
  * **functions** (Location of helper functions of any kind)
  * **middleware** (Location of all middlewares)
  * **models** (Location of database and typescript models)
  * **mqtt** (Mqtt Client and certificates)
  * **services** (The functionality for the endpoints)
  * **index.ts** (main file)
* **.env** (Passwords)
* **metadata files**

Interfaces:
* Various API Endpoints, mainly for the Frotend to access and modify the Database (see http://localhost:4500/docs)
* MQTT Client, to receive messages from the Hubs (Communications Group). This includes updated events/properties, as well as new Devices and their thing description to add.
* The Mqtt Client can also Generate sets of usernames and passwords for new Hubs, that can only send/receive messages on certain topics

## Design Decisions
### CARP Design Decisions
Before we started with our implementation we planned how to strcture and design our dashbaord. We decided to use the CARP descion principles. 
CARP contains the following elements:<br>

Contrast <br>
It was important to us to implement a contrast between different Elements. We used different colors for different elements. Each functionality is designed with different colors beause we did not want to distract the user. Besides that we wanted to keep the User Interface as simple as possible and implement an User Experience that is easy o understand. <br>

Alignment <br>
Alignment means to create a well strucutred page that looks organized and "clean. Therfore we used the same width and the same height for the same elements. We aligned all elements and created a well structured page.<br>

Repetition  <br>
We also considered the Rpetition. That means we designed the same things "repetitively". Designing same things similar confuses the user and interrupts the user experience. Also because of the task seperation (everybody worked on different tasks), it is important to use the same scheme for each page. Therefor, we used the same "bin" icon to remove elements and we used the same "arrow button" to go to the previous page. <br>

Proximity <br>
Proximity means to place elements that belong together next to each other. Therefore we places the "hubs you own" seperatly to the "hubs you are member of". Besides that, we placed all devices that belong to one hub on a different subpage next to each other. 


All in all we wanted to have a simple design that is easy in usage and self-explanatory. To implement this, we used signs and icons for different fuinctionalties (+ icon, info-icon, bin-icon etc).

## Design Pyramide
We have oriented ourselves to the design pyramid
Let’s describe the levels of the pyramid from the bottom to the top. Our  focus was initially on functionality
Functionality meets the requirements for the proper work of the App. The design has some purpose and includes the key features  and passes basic  accessibility.  
For example we have improved the registration process, not requiring the same input multiple times, and making the data saved and retained for users to leave and return.Usability must take into account a number of factors that are specific to the audience for which a product is being built. 
People need to be able to figure out how to use our application, and in the modern context, how to use it without having to unlearn or relearn anything. 
We have made the design very simple so that the user can understand and use the app himself. If it were too complex to figure out or required too much effort, i think most people would not use it.

## Style Guide:
He have here our style Guide. We have created our own color palette. Main Palette contains the colors that we used the most for the app and the second palette contains the colors we used for dialog, alerts or for on-press. 
Colors have been chosen that harmonize but stand in strong contrast to the background. We have used the same font on all pages, mostly the font was  black or white and  the frontend is designed with Material UI. For instance, we worked with icons so we had less text and didn't want to describe each button because we wanted to keep it simple.

## Outlook
Due to the project being very time-limited, naturally there are things that can be enhanced or improved. Hardware-wise the switchbot could also be used to turn on a coffee machine for example. Currently, we are limited to two devices, but there are numerous devices that would generate added value for the users if present in our application. <br>
Having a focus on security we could further improve the process and validation when adding new devices or configuring the existing ones. Additional access right roles regarding hubs and devices might come in handy. The current version of the application only offers the roles "member" and "user". Adding a "guest" role for example would be convenient to accomodate different usage scenarios. Furthermore, preferences per users and different settings per hub could be saved. <br>
It would also be less user-error-prone if a device could be added via the dashboard. Currently it has to be added manually in the hub. The process and needed communication for the improved device adding procedure would require some extensive research for the best approach. <br>
With further functionalities and more devices being added that might have more security sensitive tasks, it seems reasonable to further validate the user's email address. Additionally, we could further restrict the format of the password the user chooses and aid him or her in choosing a secure one. <br>
Not to forget, it is indispensable to replace `http` with `https` in the next version of the hosted application. In the code the necessary changes are mostly present, but would need to be deployed and tested on the server.


