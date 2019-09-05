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
  type: 'website URL';
  value: string;
}

interface AndroidAppTargetEntry {
  type: 'android-app ID';
  value: string;
}

interface IOSAppTargetEntry {
  type: 'ios-app ID';
  value: string;
}
