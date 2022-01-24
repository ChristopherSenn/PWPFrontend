import mongoose, { Schema, Model, Document } from 'mongoose';


interface IDevice {
    thingDescription: string;
    deviceId: string;
    hubId : string;
    deviceName: string;
    action: Array<{
      name: string;
      href: string;
      inputs: string;
    }>;
    properties: Array<{
      name: string;
      href: string;
      inputs: string;
      value: boolean;
    }>;
  }

  type DeviceDocument = Document & {
    thingDescription: string;
    deviceId: string;
    hubId : string;
    deviceName: string;
    action: Array<{
      name: string;
      href: string;
      inputs: string;
    }>;
    properties: Array<{
      name: string;
      href: string;
      inputs: string;
      value: boolean;
    }>;
  };

  type DeviceInput = {
    thingDescription: DeviceDocument['thingDescription'];
    deviceId: DeviceDocument['deviceId'];
    hubId: DeviceDocument['hubId'];
    deviceName: DeviceDocument['deviceName'];
    action: DeviceDocument['action'];
    properties: DeviceDocument['properties'];
    
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
      action: [{
        type: Schema.Types.String,
        required: true,
          name: {
            type: Schema.Types.String,
            required: true,
          },
         href: {
           type: Schema.Types.String,
           required: true
          },
          inputs: {
            type: Schema.Types.Array,
            required: true
          },
        
      }],
      properties: [{
        type: Schema.Types.String,
        required: true,
          name: {
            type: Schema.Types.String,
            required: true,
          },
          href: {
            type: Schema.Types.String,
            required: true,
          },
          inputs: {
            type: Schema.Types.String,
            required: true,
          },
          value: {
            type: Schema.Types.Boolean,
            required: true,
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