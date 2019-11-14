import { observable, computed, action, runInAction } from "mobx";
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
      var result = await agent.User.login(values);
      runInAction(() => {
        this.user = result;
        console.log(result);
      });
    } catch (error) {
      console.log(error);
    }
  };
}
