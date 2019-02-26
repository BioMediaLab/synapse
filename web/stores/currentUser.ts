import { createContext } from "react";
import { decorate, observable, action } from "mobx";

export interface ICurrentUserStore {
  user: object;
  setUser(user: object): void;
}

export class CurrentUserStore implements ICurrentUserStore {
  user = {};

  setUser = user => {
    this.user = user;
  };
}

decorate(CurrentUserStore, {
  user: observable,
  setUser: action,
});

export default createContext(new CurrentUserStore());
