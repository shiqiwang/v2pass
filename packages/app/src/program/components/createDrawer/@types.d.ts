type Status = 'success' | 'error' | undefined;

export interface DrawerProps {
  visible: boolean;
  title?: string;
  onClose(): void;
}

export interface IValidate {
  status: Status;
  help: string;
}
