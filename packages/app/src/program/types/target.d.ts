export default interface Target {
  _id: string;
  displayName: string;
  entries: TargetEntry[];
}

export type TargetEntry =
  | WebsiteTargetEntry
  | AndroidAppTargetEntry
  | IOSAppTargetEntry;

interface WebsiteTargetEntry {
  _id: string;
  type: 'website URL';
  value: string;
}

interface AndroidAppTargetEntry {
  _id: string;
  type: 'android-app ID';
  value: string;
}

interface IOSAppTargetEntry {
  _id: string;
  type: 'ios-app ID';
  value: string;
}
