# How to start project locally
The `master` branch contains the code to start the application locally.
## Setup Backend
  - Make sure your Node Version is at least 16.x.x
  - Get Access to .env file somehow and place it in the pwp-backend root folder
  1) cd pwp-backend
  2) `npm install`
  3) `npm install tsoa -g`
  4) `npm run build`
  5) cd pwp-frontend 
  6) `npm install`

## Start the server and client (Frontend)
  - go to backend directory (cd pwp-backend)
  - `npm run dev`

## Documentation Backend
  The Endpoint Documentation is available under http://localhost:4500/docs/

## Documentation Frontend
  Open App on http://localhost:3000/



# How to access deployed application
The `release` branch contains the version of the application that is deployed on the server. It can be accessed via this address:
http://pwp21.medien.ifi.lmu.de/
## Test user
- Username: Jakob; Password: 123456789
- Username: Sebastian; Password: 123456789
## Documentation Backend
http://pwp21.medien.ifi.lmu.de:4500/docs/


# To Do Documentation

## Outlook
Due to the project being very time-limited, naturally there are things that can be enhanced or improved. Hardware-wise the switchbot could also be used to turn on a coffee machine for example. Currently, we are limited to two devices, but there are numerous devices that would generate added value for the users if present in our application. <br>
Having a focus on security we could further improve the process and validation when adding new devices or configuring the existing ones. Additional access right roles regarding hubs and devices might come in handy. The current version of the application only offers the roles "member" and "user". Adding a "guest" role for example would be convenient to accomodate different usage scenarios. Furthermore, preferences per users and different settings per hub could be saved. <br>
It would also be less user-error-prone if a device could be added via the dashboard. Currently it has to be added manually in the hub. The process and needed communication for the improved device adding procedure would require some extensive research for the best approach. <br>
With further functionalities and more devices being added that might have more security sensitive tasks, it seems reasonable to further validate the user's email address. Additionally, we could further restrict the format of the password the user chooses and aid him or her in choosing a secure one. <br>
Not to forget, it is indispensable to replace `http` with `https` in the next version of the hosted application. In the code the necessary changes are mostly present, but would need to be deployed and tested on the server.


