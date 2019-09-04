export default interface Target {
  _id: string;
  displayName: string;
  entries: TargetEntry[];
}

type TargetEntry =
  | WebsiteTargetEntry
  | AndroidAppTargetEntry
  | IOSAppTargetEntry;

interface WebsiteTargetEntry {
  type: 'website';
  url: string;
}

interface AndroidAppTargetEntry {
  type: 'android-app';
  id: string;
}

interface IOSAppTargetEntry {
  type: 'ios-app';
  id: string;
}
