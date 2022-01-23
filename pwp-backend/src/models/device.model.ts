import mongoose, { Schema, Model, Document } from 'mongoose';


interface IDevice {
    thingDescription: string;
    deviceName: string;
    action: string;
    events: string;
    state: string;
    hubId : string;
    id?: string;
    token?: string;
  }

  type DeviceDocument = Document & {
    thingDescription: string;
    deviceName: string;
    action: string;
    events: string;
    state: string;
    hubId: string;
  };

  type DeviceInput = {
    thingDescription: DeviceDocument['thingDescription'];
    deviceName: DeviceDocument['deviceName'];
    action: DeviceDocument['action'];
    events: DeviceDocument['events'];
    state: DeviceDocument['state'];
    hubId: DeviceDocument['hubId'];
  };

  const deviceSchema = new Schema(
    {
      thingDescription: {
        type: Schema.Types.String,
        required: true,
      },
      deviceName:{
        type: Schema.Types.String,
        required: true
      },
      action: {
        type: Schema.Types.String,
        required: true
      },
      events: {
        type: Schema.Types.String,
        required: true
      },
      state: {
        type: Schema.Types.String,
        required: true
      } ,
      hubId: {
        type: Schema.Types.String,
        required: true
      } 
    },
    {
      collection: 'devices',
      timestamps: true,
    } 
  );
const Device: Model<DeviceDocument> = mongoose.model<DeviceDocument>('Device', deviceSchema);

export { Device, DeviceInput, DeviceDocument, IDevice };