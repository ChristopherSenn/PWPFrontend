import { StatusError } from '../models/error.model';
import { IHub, HubDocument, Hub, HubInput } from '../models/hub.model';
export type HubDeleteParams = Pick<IHub, 'hubId'>;
export type AddOrRemoveUserParams = Pick<IHub, 'hubId' | 'memberIds'>;
export type AddOrRemoveDeviceParams = Pick<IHub, 'hubId' | 'deviceIds' | 'ownerId'>;

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

  // TODO: search through all Hubs - check if user is a member
  public async getHubsByUserId(userId: string): Promise<IHub[]> {
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

    if (!memberIds.includes(ownerId)) {
      memberIds.push(ownerId);
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
    const parsedHub: IHub = {
      hubName: newHub.hubName,
      hubId: newHub.hubId,
      ownerId: newHub.ownerId,
      memberIds: newHub.memberIds,
      deviceIds: newHub.deviceIds,
    };
    return parsedHub;
  }

  public async deleteHub(requestBody: HubDeleteParams): Promise<IHub> {
    return new Promise<IHub>((resolve, reject) => {
      Hub.findOneAndDelete({ _id: requestBody.hubId }, (err, res) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (res !== null) {
            const parsedHub: IHub = {
              hubName: res.hubName,
              hubId: res.hubId,
              ownerId: res.ownerId,
              memberIds: res.memberIds,
              deviceIds: res.deviceIds,
            };
            resolve(parsedHub);
          } else {
            reject(new StatusError('Hub not found', 404));
          }
        }
      });
    });
  }

  public async addUser(requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const { hubId, memberIds } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      const toaddUser: string[] = memberIds.filter((memberId) => !hub.memberIds.includes(memberId));
      return new Promise<IHub>((resolve, reject) => {
        Hub.findOneAndUpdate({ _id: hubId }, { $push: { memberIds: toaddUser } }, { new: true }, (err, res) => {
          if (err) {
            reject(new StatusError(err.message, 404));
          } else {
            if (res !== null) {
              const parsedHub: IHub = {
                hubName: res.hubName,
                hubId: res.hubId,
                ownerId: res.ownerId,
                memberIds: res.memberIds,
                deviceIds: res.deviceIds,
              };
              resolve(parsedHub);
            } else {
              reject(new StatusError('Hub not found', 404));
            }
          }
        });
      });
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  // TODO: write correctly
  public async removeUser(requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const { hubId, memberIds } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (memberIds.includes(hub.ownerId.toString())) {
        throw new StatusError('You can not remove the Owner of this Hub', 404);
      }

      const toremoveUser: string[] = memberIds.filter((memberId) => hub.memberIds.includes(memberId));
      console.log(`Removing ${toremoveUser}`);
      return new Promise<IHub>((resolve, reject) => {
        Hub.findByIdAndUpdate({ _id: hubId }, { $pullAll: { memberIds: toremoveUser } }, { new: true }, (err, res) => {
          if (err) {
            reject(new StatusError(err.message, 404));
          } else {
            if (res !== null) {
              const parsedHub: IHub = {
                hubName: res.hubName,
                hubId: res.hubId,
                ownerId: res.ownerId,
                memberIds: res.memberIds,
                deviceIds: res.deviceIds,
              };
              resolve(parsedHub);
            } else {
              reject(new StatusError('Hub not found', 404));
            }
          }
        });
      });
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  public async addDevice(requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const { hubId, deviceIds, ownerId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (ownerId.toString() === hub.ownerId.toString()) {
        const toaddDevice: string[] = deviceIds.filter((deviceId) => !hub.deviceIds.includes(deviceId));
        return new Promise<IHub>((resolve, reject) => {
          Hub.findOneAndUpdate({ _id: hubId }, { $push: { memberIds: toaddDevice } }, { new: true }, (err, res) => {
            if (err) {
              reject(new StatusError(err.message, 404));
            } else {
              if (res !== null) {
                const parsedHub: IHub = {
                  hubName: res.hubName,
                  hubId: res.hubId,
                  ownerId: res.ownerId,
                  memberIds: res.memberIds,
                  deviceIds: res.deviceIds,
                };
                resolve(parsedHub);
              } else {
                reject(new StatusError('Hub not found', 404));
              }
            }
          });
        });
      } else {
        throw new StatusError('Only the owner of this hub can add devces', 404);
      }
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  public async removeDevice(requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const { hubId, deviceIds, ownerId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (ownerId.toString() === hub.ownerId.toString()) {
        const toRemoveDevice: string[] = deviceIds.filter((deviceId) => hub.deviceIds.includes(deviceId));
        return new Promise<IHub>((resolve, reject) => {
          Hub.findByIdAndUpdate(
            { _id: hubId },
            { $pullAll: { memberIds: toRemoveDevice } },
            { new: true },
            (err, res) => {
              if (err) {
                reject(new StatusError(err.message, 404));
              } else {
                if (res !== null) {
                  const parsedHub: IHub = {
                    hubName: res.hubName,
                    hubId: res.hubId,
                    ownerId: res.ownerId,
                    memberIds: res.memberIds,
                    deviceIds: res.deviceIds,
                  };
                  resolve(parsedHub);
                } else {
                  reject(new StatusError('Hub not found', 404));
                }
              }
            }
          );
        });
      } else {
        throw new StatusError('Only the owner of this hub can remove devices', 404);
      }
    } else {
      throw new StatusError('Hub not found', 404);
    }
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
