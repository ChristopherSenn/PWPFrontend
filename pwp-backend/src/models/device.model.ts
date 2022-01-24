import mongoose, { Schema, Model, Document } from 'mongoose';


interface IDevice {
    thingDescription: string;
    deviceId: string;
    hubId : string;
    deviceName: string;
    actions: Array<{
      name: string;
      href: string;
      inputs: string;
    }>;
    events: Array<{
      name: string;
      href: string;
      type: string;
      value: boolean;
    }>;
  }

  type DeviceDocument = Document & {
    thingDescription: string;
    deviceId: string;
    hubId : string;
    deviceName: string;
    actions: Array<{
      name: string;
      href: string;
      inputs: string;
    }>;
    events: Array<{
      name: string;
      href: string;
      type: string;
      value: boolean;
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
            required: true,
          },
         href: {
           type: Schema.Types.String,
           required: true
          },
          type: {
            type: Schema.Types.Array,
            required: true,
          },
        
      }],
      events: [{
        
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