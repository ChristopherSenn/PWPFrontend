import { StatusError } from '../models/status.model';
import { IHub, HubDocument, Hub, HubInput } from '../models/hub.model';
import { Device } from '../models/device.model';
import { Types } from 'mongoose';
import { generatePassword } from '../functions/generatePassword';
import { addAccount, removeAccount } from '../mqtt/mqtt';

export type HubDeleteParams = Pick<IHub, 'hubId'>;
export type HubCreationParams = Pick<IHub, 'hubName' | 'ownerId' | 'memberIds'>;
export type AddOrRemoveUserParams = { hubId: string; memberIds: string[]; userId: string };

export class HubService {
  /**
   * @returns parsedHubs: IHub[] - Array of all Hubs
   */
  public async getHubs(): Promise<IHub[]> {
    const hubs: HubDocument[] = await Hub.find().exec();

    const parsedHubs: IHub[] = hubs.map((hub) => {
      return {
        hubName: hub.hubName,
        hubId: hub._id,
        ownerId: hub.ownerId,
        memberIds: hub.memberIds,
        password: hub.password,
      };
    });

    return parsedHubs;
  }

  /**
   * @param userId ID of the user
   * @returns parsedHubs: IHub[] - Array of all hubs the user is a memeber of
   */
  public async getHubsByUserId(userId: string): Promise<IHub[]> {
    const hubs: HubDocument[] = await Hub.find().exec();

    const matchedhubs = hubs.filter((hub) => hub.memberIds.includes(userId));

    const parsedHubs: IHub[] = matchedhubs.map((hub) => {
      return {
        hubName: hub.hubName,
        hubId: hub._id,
        ownerId: hub.ownerId,
        memberIds: hub.memberIds,
        password: hub.password,
      };
    });

    return parsedHubs;
  }

  /**
   * @param requestBody description of the request body
   * @returns parsedHub: IHub: new Hub Object
   */
  public async createHub(requestBody: HubCreationParams): Promise<IHub> {
    const { hubName, ownerId, memberIds } = requestBody;

    if (hubName === '') {
      throw new StatusError('Hubname must not be an empty string', 404);
    }

    if (!memberIds.includes(ownerId)) {
      memberIds.push(ownerId);
    }
    const password: string = generatePassword(20);

    const hubInput: HubInput = {
      hubName,
      ownerId,
      memberIds,
      password,
    };

    const hubSchema = new Hub(hubInput);
    const newHub: HubDocument = await hubSchema.save();
    const parsedHub: IHub = {
      hubName: newHub.hubName,
      hubId: newHub._id,
      ownerId: newHub.ownerId,
      memberIds: newHub.memberIds,
      password: newHub.password,
    };
    // Add the account to the mqtt broker
    addAccount(newHub._id, newHub.password);
    return parsedHub;
  }

  /**
   * @param requestBody description of the request body
   * @returns Promise
   */
  public async deleteHub(requestBody: HubDeleteParams): Promise<IHub> {
    return new Promise<IHub>((resolve, reject) => {
      Hub.findOneAndDelete({ _id: requestBody.hubId }).exec((err, res) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (res !== null) {
            const parsedHub: IHub = {
              hubName: res.hubName,
              hubId: res._id,
              ownerId: res.ownerId,
              memberIds: res.memberIds,
              password: res.password,
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
            removeAccount(requestBody.hubId || '');
            resolve(parsedHub);
          } else {
            reject(new StatusError('Hub not found', 404));
          }
        }
      });
    });
  }

  /**
   * @param requestBody description of the request body
   * @returns Promise<IHub> updated hub object
   */
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
                  password: res.password,
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

  /**
   * @param requestBody description of the request body
   * @returns Promise<IHub> updated hub object
   */
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
                    password: res.password,
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
                  password: res.password,
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

  /**
   * @param hubId ID of the hub
   * @returns hub password
   */
  public async getPassword(hubId: string): Promise<string> {
    const hub: HubDocument | null = await Hub.findById(hubId).exec();

    if (hub) {
      return hub.password;
    } else {
      throw new StatusError('Hub not found', 404);
    }
  }
}
