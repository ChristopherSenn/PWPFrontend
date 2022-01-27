import { StatusError } from '../models/status.model';
import { IHub, HubDocument, Hub, HubInput } from '../models/hub.model';
import { Device } from '../models/device.model';
import { Types } from 'mongoose';
import createCertificate from '../functions/createCertificate';

export type HubDeleteParams = Pick<IHub, 'hubId'>;
export type HubCreationParams = Pick<IHub, 'hubName' | 'ownerId' | 'memberIds'>;
export type AddOrRemoveUserParams = { hubId: string; memberIds: string[]; userId: string };

export class HubService {
  public async getHubs(): Promise<IHub[]> {
    const hubs: HubDocument[] = await Hub.find().exec();

    const parsedHubs: IHub[] = hubs.map((hub) => {
      return {
        hubName: hub.hubName,
        hubId: hub._id,
        ownerId: hub.ownerId,
        memberIds: hub.memberIds,
        cert: hub.cert,
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
        hubId: hub._id,
        ownerId: hub.ownerId,
        memberIds: hub.memberIds,
        cert: hub.cert,
      };
    });

    return parsedHubs;
  }

  public async createHub(requestBody: HubCreationParams): Promise<IHub> {
    const { hubName, ownerId, memberIds } = requestBody;

    if (hubName === '') {
      throw new StatusError('Hubname must not be an empty string', 404);
    }

    if (!memberIds.includes(ownerId)) {
      memberIds.push(ownerId);
    }
    const cert: string = createCertificate();

    const hubInput: HubInput = {
      hubName,
      ownerId,
      memberIds,
      cert,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = {
      hubName: newHub.hubName,
      hubId: newHub._id,
      ownerId: newHub.ownerId,
      memberIds: newHub.memberIds,
      cert: newHub.cert,
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
              cert: res.cert,
            };

            const hubId = new Types.ObjectId(requestBody.hubId);
            Device.find({ hubIds: hubId }, (err, result) => {
              if (err) {
                throw new StatusError(err.message, 404);
              } else {
                result.forEach((dev) => {
                  Device.findByIdAndUpdate(dev._id, { $pull: { hubIds: hubId } }).exec();
                });
              }
            });

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
                  hubId: res._id,
                  ownerId: res.ownerId,
                  memberIds: res.memberIds,
                  cert: res.cert,
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
                    hubId: res._id,
                    ownerId: res.ownerId,
                    memberIds: res.memberIds,
                    cert: res.cert,
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
                  hubId: res._id,
                  ownerId: res.ownerId,
                  memberIds: res.memberIds,
                  cert: res.cert,
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

  // TODO: write correctly - add token!
  public async showIDandToken(hubId: string): Promise<string> {
    const hub: HubDocument | null = await Hub.findById(hubId).exec();

    if (hub) {
      return hub.cert;
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }
}
