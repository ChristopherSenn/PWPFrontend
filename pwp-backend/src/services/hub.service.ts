import { StatusError } from '../models/error.model';
import { IHub, HubDocument, Hub, HubInput } from '../models/hub.model';

export class HubService {
  public async getHubs(): Promise<IHub[]> {
    const hubs: HubDocument[] = await Hub.find().exec();

    const parsedHubs: IHub[] = hubs.map((hub) => {
      return {
        hubName: hub.hubName,
        hubId: hub.hubId,
        ownerId: hub.ownerId,
        memberIds: hub.memberIds,
        deviceIds: hub.deviceIds,
      };
    });

    return parsedHubs;
  }

  public async createHub(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    if (hubName === '') {
      throw new StatusError('Hubname must not be an empty string', 404);
    }

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async deleteHub(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async addUser(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async removeUser(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async addDevice(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async removeDevice(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }

  // TODO: write correctly
  public async showIDandToken(requestBody: IHub): Promise<IHub> {
    const { hubName, hubId, ownerId, memberIds, deviceIds } = requestBody;

    const hubInput: HubInput = {
      hubName,
      hubId,
      ownerId,
      memberIds,
      deviceIds,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = newHub;
    return parsedHub;
  }
}
