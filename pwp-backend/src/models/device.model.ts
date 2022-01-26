import mongoose, { Schema, Model, Document } from 'mongoose';
import { JsonObject } from 'swagger-ui-express';


interface IDevice {
    thingDescription: any;
    deviceId: string;
    hubId : string;
    deviceName: string;
    actions: Array<{
      name: string;
      href: string;
      actionType: string;
      inputType: string;
    }>;
    events: Array<{
      name: string;
      href: string;
      dataType: string;
    }>;
  }

  type DeviceDocument = Document & {
    thingDescription: any;
    deviceId: string;
    hubId : string;
    deviceName: string;
    actions: Array<{
      name: string;
      href: string;
      actionType: string;
      inputType: string;
    }>;
    events: Array<{
      name: string;
      href: string;
      dataType: string;
    }>;
  };

  type DeviceInput = {
    thingDescription: DeviceDocument['thingDescription'];
    deviceId: DeviceDocument['deviceId'];
    hubId: DeviceDocument['hubId'];
    deviceName: DeviceDocument['deviceName'];
    actions: DeviceDocument['actions'];
    events: DeviceDocument['events'];
    
  };

  const deviceSchema = new Schema(
    {
      thingDescription: {
        type: Schema.Types.String,
        required: true,
      },
    
      deviceId: {
        type: Schema.Types.String,
        required: true
      
    },
    hubId: {
      type: Schema.Types.String,
      required: true
  
    },
      deviceName:{
        type: Schema.Types.String,
        required: true
      },
      actions: [{
          name: {
            type: Schema.Types.String,
            required: true
          },
         href: {
           type: Schema.Types.String,
           required: true
          },
          actionType: {
            type: Schema.Types.String,
            required: true
          },
          inputType: {
            type: Schema.Types.String,
            required: true
          },
        
      }],
      events: [{
        
          name: {
            type: Schema.Types.String,
            required: true
          },
          href: {
            type: Schema.Types.String,
            required: true
          },
          dataType: {
            type: Schema.Types.String,
            required: true
          },
      }],
    },
    {
      collection: 'devices',
      timestamps: true,
    } 
  );
const Device: Model<DeviceDocument> = mongoose.model<DeviceDocument>('Device', deviceSchema);

export { Device, DeviceInput, DeviceDocument, IDevice };