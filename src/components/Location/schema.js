export const LocationSchema = {
  name: 'Location',
  properties: {
    id: 'int',
    latitude: 'double',
    longitude: 'double',
    accuracy: 'double',
    altitude: 'double',
    altitudeAccuracy: 'double',
    heading: 'double',
    speed: 'double',
    timestamp: 'bigint',
  },
  primaryKey: 'id',
}