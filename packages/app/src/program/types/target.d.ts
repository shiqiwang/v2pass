export interface Target {
  id: string;
  displayName: string;
  entries: TargetEntry[];
}

export type TargetEntry =
  | WebsiteTargetEntry
  | AndroidAppTargetEntry
  | IOSAppTargetEntry;

interface WebsiteTargetEntry {
  id: string;
  type: 'website URL';
  value: string;
}

interface AndroidAppTargetEntry {
  id: string;
  type: 'android-app ID';
  value: string;
}

interface IOSAppTargetEntry {
  id: string;
  type: 'ios-app ID';
  value: string;
}
