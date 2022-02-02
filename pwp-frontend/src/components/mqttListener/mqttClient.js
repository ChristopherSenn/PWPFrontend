import React from "react";
import mqtt from "mqtt";
import TextBox from '../deviceFeatures/Features';
import keyFile from './client_frontend.key';
import certFile from './client_frontend.pem'
import {getDeviceDetails} from './DeviceInterface'
import { useLocation } from "react-router-dom";







let key = "";
let cert="";

function readKeyFile(){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", keyFile, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                key = allText;
                
            }
        }
    }
    rawFile.send(null);}

    function readCertFile(){
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", certFile, false);
      rawFile.onreadystatechange = function ()
      {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                  var allText = rawFile.responseText;
                  cert = allText;
                  
              }
          }
      }
      rawFile.send(null);}

readKeyFile();
readCertFile();









class MQTTClient extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            client:null,
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

    getDeviceName(data){

      const deviceName = data.deviceName;
      this.setState({deviceName: deviceName});
      
    };

    getSecurityMode(data){

      
      const properties = data.properties;
      for (const property of properties){
        if (property.name === "acessmode"){
           const securityMode = property.dataValue;
           this.setState({securityMode: securityMode});
        }
      }


    };

    getActions(data){

      const actions = data.actions;

      console.log(actions);

      

      for (const action of actions){
        const actionName = action.name;
        const inputType = action.inputType;
        const payload = {actionName, inputType};
        const actionsInState = this.state.actions;
        const newActionsInState = actionsInState.concat([payload]);
        this.setState({actions: newActionsInState})

      }

      const test = this.state.actions;
      console.log(test);

    

    };


    

    componentDidMount() {

      const deviceId = this.props.deviceClicked;
      this.setState({deviceId: deviceId});



       getDeviceDetails(deviceId).then(deviceDetails => {
        const data = deviceDetails.data;

        

        this.getDeviceName(data);
        this.getSecurityMode(data);
        this.getActions(data);
        
      });
      
      
     

      //hubId : username
      //password: /gethub 
      

      const connectionOptions = {
        port: 8091,
        clientId: 'PWP_PUBLIC_FRONTEND_CLIENT ' + Math.random().toString(16).substr(2, 8),
        clean: true,
        key: key,
        cert: cert,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      };

        this.client = mqtt.connect('wss://pwp21.medien.ifi.lmu.de:8091', connectionOptions);


        
    
        //the connection was successful 
        if(this.client != null){
          this.client.on("connect", () => {
            console.log("Connected");
            this.setState({
              connectionStatus: "Connected"
            });
          });

          const topic = "actions"

          if (this.client) {
            this.client.subscribe(topic); 
        }


        //check: deviceId, properties, events, actions
          //client receives a message 
          this.client.on("message", (topic, message) => {
            console.log("gotmessage")
            console.log(topic);
            console.log(message);
            // if (topic === "actions"){
            //     const actions = this.state.actions;
            //     const action = message.toString();
            //     const newactions = actions.concat([action]);
            //     this.setState({actions: newactions});
            // }
            const data = this.state.data;
            const payload = {topic, message: message.toString()};
            if (payload.topic) {
              const newData = data.concat([payload]);
              this.setState({data: newData})
    
            }
          });
        }
      };

      render(){
          return(
              <div className='MQTTClient'>
                <header className="Features-header">
                  <TextBox
                    deviceName = {this.state.deviceName}
                    securityMode = {this.state.securityMode} 
                    actions = {this.state.actions}
                    deviceId = {this.state.deviceId}
                  ></TextBox>
                </header>
              </div>
          );
      }
}

export default function Features() {


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




