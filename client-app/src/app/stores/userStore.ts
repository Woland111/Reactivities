import { observable, computed, action } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { createContext } from "react";
import { RootStore } from "./rootStore";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
  }
  
  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      this.user = await agent.User.login(values);
    } catch (error) {
      console.log(error);
    }
  };
}
