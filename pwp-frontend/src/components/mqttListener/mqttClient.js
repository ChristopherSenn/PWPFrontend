import React from "react";
import mqtt from "mqtt";
import TextBox from '../deviceFeatures/Features';
import { useSelector, useDispatch } from "react-redux";
import keyFile from './client_frontend.key';
import certFile from './client_frontend.pem'
import {getDeviceDetails} from './DeviceInterface'







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









  // fetch(keyFile)
  // .then(r => r.text())
  // .then(textKey => {
  //   console.log(textKey);
  //   fetch(certFile)
  //   .then(r => r.text())
  //   .then(textCert => {
  //   console.log(textCert)
  // });
    
  // });

fetch(certFile)
  .then(r => r.text())
  .then(text => {
    //cert = text;
  });



class MQTTClient extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            client:null,
            connectionStatus: "Disconnected",
            data: [],
            title: "",
            status: [],
            securityMode: "",
            actions: [],
        };
    }

    

    componentDidMount() {

      console.log(getDeviceDetails("uuid-prototype-1.0.1-mixer"));

      

      const connectionOptions = {
        port: 1883,
        clientId: 'PWP_PUBLIC_FRONTEND_CLIENT ' + Math.random().toString(16).substr(2, 8),
        clean: true,
        key: key,
        cert: cert,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
      };

        this.client = mqtt.connect('mqtt://pwp21.medien.ifi.lmu.de:1883', connectionOptions);

        
    
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
            if (topic === "actions"){
                const actions = this.state.actions;
                const action = message.toString();
                const newactions = actions.concat([action]);
                this.setState({actions: newactions});
            }
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
                    actions={this.state.actions}   
                  ></TextBox>
                </header>
              </div>
          );
      }
}

export default function Features() {

    return(
        <div className="Features">
          
            <MQTTClient>
            </MQTTClient> 
         
        </div>
    );
}




