import { StatusError } from '../models/status.model';
import { IHub, HubDocument, Hub, HubInput, HubCredentials } from '../models/hub.model';
export type HubDeleteParams = Pick<IHub, 'hubId'>;
export type AddOrRemoveUserParams = { hubId: string; memberIds: string[]; userId: string };
export type AddOrRemoveDeviceParams = { hubId: string; deviceIds: string[]; userId: string };

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

    const matchedhubs = hubs.filter((hub) => hub.memberIds.includes(userId));

    const parsedHubs: IHub[] = matchedhubs.map((hub) => {
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
    const { hubId, memberIds, userId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (userId === hub.ownerId.toString()) {
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
        throw new StatusError('Only the owner can add new user to this hub', 404);
      }
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  public async removeUser(requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const { hubId, memberIds, userId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (memberIds.includes(hub.ownerId.toString())) {
        throw new StatusError('You can not remove the owner of this Hub', 404);
      }
      if (userId === hub.ownerId.toString()) {
        const toremoveUser: string[] = memberIds.filter((memberId) => hub.memberIds.includes(memberId));
        return new Promise<IHub>((resolve, reject) => {
          Hub.findByIdAndUpdate(
            { _id: hubId },
            { $pullAll: { memberIds: toremoveUser } },
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
      } else if (memberIds.includes(userId) && userId !== hub.ownerId) {
        return new Promise<IHub>((resolve, reject) => {
          Hub.findByIdAndUpdate({ _id: hubId }, { $pullAll: { memberIds: [userId] } }, { new: true }, (err, res) => {
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
        throw new StatusError('You are neither a member nor the owner of this hub. You can not remove user', 404);
      }
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  public async addDevice(requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const { hubId, deviceIds, userId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (userId === hub.ownerId.toString()) {
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
        throw new StatusError('Only the owner of this hub can add devices', 404);
      }
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }

  public async removeDevice(requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const { hubId, deviceIds, userId } = requestBody;

    const hub: HubDocument | null = await Hub.findById(hubId).exec();
    if (hub) {
      if (userId === hub.ownerId.toString()) {
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

  // TODO: write correctly - add token!
  public async showIDandToken(hubId: string): Promise<HubCredentials> {
    const hub: HubDocument | null = await Hub.findById(hubId).exec();

    if (hub) {
      return {
        hubId: hub.hubId,
        token: '1234',
      };
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }
}
