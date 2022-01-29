/**
 * Enum to make it easier to controll the passed Categories.
 * This will make sure that one can't try to update some category that doesn't exist in the db
 */
enum CategoryTypes {
  Properties = 'properties',
  Events = 'events',
  Undefined = 'undefined',
}

/**
 * Interface that represents mqtt messages
 */
interface IMqttMessage {
  hubId: string;
  deviceId: string; // The ID of the sending device
  category: CategoryTypes; // TODO: Make this typesafe
  topic: string; // The topic (specific property or event) of the message
  message: string; // The actual value that is sent
}

export { CategoryTypes, IMqttMessage };
