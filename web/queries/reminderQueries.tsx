import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

export const CREATE_REMINDER = gql`
  mutation($message: String!, $targetTime: String!) {
    createReminder(msg: $message, triggerTime: $targetTime) {
      id
    }
  }
`;

export const DELETE_REMINDER = gql`
  mutation($reminder: String) {
    deleteReminder(id: $reminder) {
      id
    }
  }
`;

export const VIEW_REMINDERS = gql`
  query {
    reminders {
      id
      msg
      add_data
      triggerTime
    }
  }
`;

export class DeleteReminderMutation extends Mutation<
  { id: string },
  { reminder: string }
> {}

export class ReminderMutationComp extends Mutation {}

export class ReminderQueryComp extends Query {}
