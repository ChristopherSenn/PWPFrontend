import mongoose, { Schema, Model, Document } from 'mongoose';

interface IDevice {
  id?: string;
  thingDescription: any;
  deviceId: string;
  hubIds: Array<string>;
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
    dataValue: string;
  }>;
  properties: Array<{
    name: string;
    href: string;
    dataType: string;
    dataValue: string;
  }>;
}

type DeviceDocument = Document & {
  thingDescription: any;
  deviceId: string;
  hubIds: Array<string>;
  deviceName: string;
  properties: Array<{
    name: string;
    href: string;
    dataType: string;
    dataValue: string;
  }>;
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
    dataValue: string;
  }>;
};

type DeviceInput = {
  thingDescription: DeviceDocument['thingDescription'];
  deviceId: DeviceDocument['deviceId'];
  hubIds: DeviceDocument['hubIds'];
  deviceName: DeviceDocument['deviceName'];
  properties: DeviceDocument['properties'];
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
      required: true,
    },
    hubIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Hub',
      },
    ],
    deviceName: {
      type: Schema.Types.String,
      required: true,
    },
    properties: [
      {
        name: {
          type: Schema.Types.String,
          required: true,
        },
        href: {
          type: Schema.Types.String,
          required: true,
        },
        dataType: {
          type: Schema.Types.String,
          required: true,
        },
        dataValue: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
    actions: [
      {
        name: {
          type: Schema.Types.String,
          required: true,
        },
        href: {
          type: Schema.Types.String,
          required: true,
        },
        actionType: {
          type: Schema.Types.String,
          required: true,
        },
        inputType: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
    events: [
      {
        name: {
          type: Schema.Types.String,
          required: true,
        },
        href: {
          type: Schema.Types.String,
          required: true,
        },
        dataType: {
          type: Schema.Types.String,
          required: true,
        },
        dataValue: {
          type: Schema.Types.String,
          required: true,
        },
      },
    ],
  },
  {
    collection: 'devices',
    timestamps: true,
  }
);
const Device: Model<DeviceDocument> = mongoose.model<DeviceDocument>('Device', deviceSchema);

export { Device, DeviceInput, DeviceDocument, IDevice };
