/**
 * Redux store state and action types (inferred from client reducers)
 */

import type { User } from './common';
import type { CRCPermission, CRCLocation, CRCModule, CRCVersion, CRCAccelerometer } from './crc';
import type { FontSizeKey } from './crc';

export interface UserState {
  user: User | null;
  permissions: CRCPermission[];
  accessToken: unknown;
  paired: Array<{ id?: number; [key: string]: unknown }>;
}

export interface FontState {
  fontSize: number;
}

export interface ModuleState {
  modules: CRCModule[];
}

export interface ActivityState {
  locations: CRCLocation[];
  accelerometers: CRCAccelerometer[];
}

export interface VersionState {
  versions: CRCVersion[];
  currentVersion: { id: number; name: string; description: string };
}

export interface RootState {
  user: UserState;
  font: FontState;
  module: ModuleState;
  activity: ActivityState;
  version: VersionState;
}

export type UserAction =
  | { type: 'UPDATE_USER'; value: User | null }
  | { type: 'UPDATE_PERMISSIONS'; value: CRCPermission[] }
  | { type: 'UPDATE_ACCESS_TOKEN'; value: unknown }
  | { type: 'UPDATE_PAIRED'; value: UserState['paired'] };

export type FontAction = { type: 'UPDATE_FONTSIZE'; value: FontSizeKey };

export type ModuleAction =
  | { type: 'UPDATE_MODULES'; value: CRCModule[] }
  | { type: 'CLEAR_MODULES' };

export type ActivityAction =
  | { type: 'UPDATE_LOCATIONS'; value: CRCLocation[] }
  | { type: 'ADD_LOCATION'; value: CRCLocation }
  | { type: 'ADD_LOCATIONS'; value: CRCLocation[] }
  | { type: 'UPDATE_ACCELEROMETERS'; value: CRCAccelerometer[] }
  | { type: 'ADD_ACCELEROMETER'; value: CRCAccelerometer }
  | { type: 'ADD_ACCELEROMETERS'; value: CRCAccelerometer[] };

export type VersionAction =
  | { type: 'UPDATE_VERSIONS'; value: CRCVersion[] }
  | { type: 'UPDATE_CURRENT_VERSION'; value: VersionState['currentVersion'] };

export type RootAction = UserAction | FontAction | ModuleAction | ActivityAction | VersionAction;
