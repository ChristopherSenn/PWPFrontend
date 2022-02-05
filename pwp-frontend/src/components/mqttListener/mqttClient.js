import React from "react";
import mqtt from "mqtt";
import TextBox from '../deviceFeatures/Features';
import {getDeviceDetails} from './DeviceInterface';
import { useLocation } from "react-router-dom";
import {getHubPassword} from './DeviceInterface';


class MQTTClient extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            client:null,
            username: "",
            password: "",
            connectionStatus: "Disconnected",
            data: [],
            deviceId:"",
            deviceName: 'Your Device',
            events: [],
            properties: [],
            securityMode: "",
            actions: [],
        };
    }

    //connect to the broker for communication
    connect(){

      //get username and password which are needed for the connection authentification
      const username = JSON.parse(localStorage.getItem('hubClicked'));
      const password = this.state.password;

      const connectionOptions = {
        port: 8091,
        clientId: 'PWP_PUBLIC_FRONTEND_CLIENT ' + Math.random().toString(16).substr(2, 8),
        clean: true,
        username: username,
        password: password,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      };

        //connect to Broker
        this.client = mqtt.connect('wss://pwp21.medien.ifi.lmu.de:8091', connectionOptions);

    
        //the connection was successfull
        if(this.client != null){
          this.client.on("connect", () => {
            console.log("Connected");
            this.setState({
              connectionStatus: "Connected"
            });
          });


          //subscribe to all topics on which the broker will publish 
          const baseTopic = "#"
          if (this.client) {
            this.client.subscribe(baseTopic); 
        }


        const deviceId = this.state.deviceId;

          //client receives a message 
          this.client.on("message", (topic, message) => {
            const splittedTopic = topic.split("/");
            const updatedDeviceId = splittedTopic[2];
            //check if the selected device equals the deviceId which was sent by the broker (if not ignore the message)
            if (updatedDeviceId === deviceId){

              //a property update
              if (splittedTopic[3] === "properties"){
                const property = splittedTopic[4];

                //an updated accessmode 
                if (property === "accessmode"){
                  const updatedSecurityMode = this.checkSecurityMode(message.toString());
                  this.setState({securityMode: updatedSecurityMode});
                } else {
                  const propertyPayload = {property, message: message.toString()};
                  const properties = this.state.properties;
                  properties[0] = propertyPayload;
                  this.setState({properties: properties})
                }

              //an action update
              } else if(splittedTopic[3] === "actions"){
                  const event = splittedTopic[4];
                  const actionPayload = {event, message: message.toString()};
                  const events = this.state.events;
                  events[0] = actionPayload;
                  this.setState({events: events})

              //an event update
              } else if(splittedTopic[3] === "events"){
                  const event = splittedTopic[4];
                  const eventPayload = {event, message: message.toString()};
                  const events = this.state.events;
                  events[0] = eventPayload;
                  this.setState({events: events})
              }
            }
           
          });
        }
      };

    //process device name
    getDeviceName(data){

      const deviceName = data.deviceName;
      this.setState({deviceName: deviceName});
      
    };

    //process security mode/state
    getSecurityMode(data){

      
      const properties = data.properties;
      for (const property of properties){
        if (property.name === "accessmode"){
           const securityMode = this.checkSecurityMode(property.dataValue);
           this.setState({securityMode: securityMode});
        }
      }
    };

    //get the right input string for each security mode
    checkSecurityMode(securityMode){

      let updatedSecurityMode = "";

      if (securityMode === "MODE_OFFLINE"){
        updatedSecurityMode = "No Connection";
      } else if (securityMode === "MODE_AP_ONLY"){
        updatedSecurityMode = "Access Point";
      } else if (securityMode === "MODE_HUB_LOCAL"){
        updatedSecurityMode = "Local Network";
      } else if (securityMode === "MODE_HUB_INTERNET"){
        updatedSecurityMode = "Full Internet Access";
      } else {
        updatedSecurityMode = securityMode;
      }
      return(updatedSecurityMode);
    };

    //process actions
    getActions(data){

      const actions = data.actions;

      for (const action of actions){
        const actionName = action.name;
        const inputType = action.inputType;
        const href = this.getHref(action.href);
        const payload = {actionName, inputType, href};
        const actionsInState = this.state.actions;
        const newActionsInState = actionsInState.concat([payload]);
        this.setState({actions: newActionsInState})

      }

    };

    //process href 
    //href is the topic on which a message will be sent to the broker in case of an clicked device
    getHref(href){

      const splittedHref = href.split("/");
      let hrefTopic = "";
      for (var i = 3; i < splittedHref.length - 1; i++){
        hrefTopic = hrefTopic + splittedHref[i] + "/";
      }
      hrefTopic = hrefTopic + splittedHref[splittedHref.length -1];
      return(hrefTopic);

    }

    //process password for authetification
    getPassword(hubPassword){

      const hubId = JSON.parse(localStorage.getItem('hubClicked'));
      this.setState({username: hubId});
      this.setState({password: hubPassword});

      this.connect();
    }

    //publish a message on a specific topic
    publishAction(topic, message){
      if (this.client) {
        this.client.publish(topic, message); 
    }
    }

    //disconneczt from the broker
    handleDisconnection = () => {
      if (this.client) {
        this.client.end( () => {
          this.setState({
            client: null,
            connectionStatus: "Disconnected"
          });
        });
      }
    };
    

    componentDidMount() {

      const deviceId = this.props.deviceClicked;
      this.setState({deviceId: deviceId});


      //get all device details for the selected device
       getDeviceDetails(deviceId).then(deviceDetails => {
        const data = deviceDetails.data;
        this.getDeviceName(data);
        this.getSecurityMode(data);
        this.getActions(data);
        
      });
      
      const hubId = JSON.parse(localStorage.getItem('hubClicked'));
      this.setState({username: hubId});

      //get the password for the connection
      getHubPassword(hubId).then(hubPassword => {
        const password = hubPassword.data;

        this.getPassword(password);
        
      }) 

    }

      render(){
          return(
              <div className='MQTTClient'>
                <header className="Features-header">
                  <TextBox
                    deviceName = {this.state.deviceName}
                    securityMode = {this.state.securityMode} 
                    actions = {this.state.actions}
                    deviceId = {this.state.deviceId}
                    properties = {this.state.properties}
                    events = {this.state.events}
                    publishAction = {(topic, message) => this.publishAction(topic, message)}
                    handleDisconnection = {() => this.handleDisconnection()}
                  ></TextBox>
                </header>
              </div>
          );
      }
}

export default function Features() {

//deviceId of the selected device 
const { state } = useLocation();

    return(
        <div className="Features"> 
          
            <MQTTClient
            deviceClicked={state}
            >
            </MQTTClient> 
         
        </div>
    );
}




