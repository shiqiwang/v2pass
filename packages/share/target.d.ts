/**
 * 使用Target接口时，前端和后端都需要引入_id，user
 */
export default interface Target {
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
