export type TaskObject = {
  id: number;
  time: string | undefined;
  text: string;
  done: boolean;
  delete: boolean;
  edited: boolean;
  editedTime: string | undefined;
  selected: boolean;
};
