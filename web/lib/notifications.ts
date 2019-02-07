import { ApolloClient } from "apollo-boost";
export enum NoteType {
  INFORMATIVE = "INFORMATIVE",
  NEW_COURSE = "NEW_COURSE",
  COURSE_MESSAGE = "COURSE_ANNOUNCEMENT",
}

export interface INotification {
  id: string;
  msg: string;
  add_data: any;
  createdAt: string;
  notify_type: NoteType;
  __typename?: string;
}

export const whenNotificationRecieved = (
  notification: INotification,
  client: ApolloClient<any>,
) => {
  switch (notification.notify_type) {
    case NoteType.COURSE_MESSAGE:
      throw new Error("unimpl...");
      break;
    case NoteType.NEW_COURSE:
      throw new Error("unimpl...");
      break;
  }
};
