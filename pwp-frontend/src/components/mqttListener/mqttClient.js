import React from 'react';
import mqtt from "mqtt";
import TextBox from '../deviceFeatures/Features';



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
        const  mqttBroker = "ws://localhost:8883";
        const options = {
          clientId: "frontendDashboard"
        };
        this.client = mqtt.connect(mqttBroker, options);
    
        //the connection was successful 
        if(this.client != null){
          this.client.on("connect", () => {
            this.setState({
              connectionStatus: "Connected"
            });
          });

          const topic = "actions"

          if (this.client) {
            this.client.subscribe(topic); 
        }

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




