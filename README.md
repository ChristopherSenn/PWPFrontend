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

## Outlook
Due to the project being very time-limited, naturally there are things that can be enhanced or improved. Hardware-wise the switchbot could also be used to turn on a coffee machine for example. Currently, we are limited to two devices, but there are numerous devices that would generate added value for the users if present in our application. <br>
Having a focus on security we could further improve the process and validation when adding new devices or configuring the existing ones. Additional access right roles regarding hubs and devices might come in handy. The current version of the application only offers the roles "member" and "user". Adding a "guest" role for example would be convenient to accomodate different usage scenarios. Furthermore, preferences per users and different settings per hub could be saved. <br>
It would also be less user-error-prone if a device could be added via the dashboard. Currently it has to be added manually in the hub. The process and needed communication for the improved device adding procedure would require some extensive research for the best approach. <br>
With further functionalities and more devices being added that might have more security sensitive tasks, it seems reasonable to further validate the user's email address. Additionally, we could further restrict the format of the password the user chooses and aid him or her in choosing a secure one. <br>
Not to forget, it is indispensable to replace `http` with `https` in the next version of the hosted application. In the code the necessary changes are mostly present, but would need to be deployed and tested on the server.


