import { createContext } from "react";
import { decorate, observable, action } from "mobx";

export interface IMeStore {
  me: object;
  setMe(user: object): void;
}

export class MeStore implements IMeStore {
  me = {};

  setMe = user => {
    this.me = user;
  };
}

decorate(MeStore, {
  me: observable,
  setMe: action,
});

export default createContext(new MeStore());
