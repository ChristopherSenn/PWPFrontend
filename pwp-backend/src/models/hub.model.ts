import mongoose, { Schema, Model, Document } from 'mongoose';

interface IHub {
  hubName: string;
  hubId?: string;
  ownerId: string;
  memberIds: Array<string>;
  token?: string;
}

type HubDocument = Document & {
  hubName: string;
  ownerId: string;
  memberIds: Array<string>;
};

type HubInput = {
  hubName: HubDocument['hubName'];
  ownerId: HubDocument['ownerId'];
  memberIds: HubDocument['memberIds'];
};

type HubCredentials = {
  hubId: string;
  token: string;
};

const hubSchema = new Schema(
  {
    hubName: {
      type: Schema.Types.String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    collection: 'hubs',
    timestamps: true,
  }
);

const Hub: Model<HubDocument> = mongoose.model<HubDocument>('Hub', hubSchema);

export { Hub, HubInput, HubDocument, IHub, HubCredentials };
