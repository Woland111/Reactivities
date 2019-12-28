import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { history } from "../..";
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
      var user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action logout = () => {
    this.user = null;
    this.rootStore.commonStore.setToken(null);
    history.push("/")
  }

  @action getUser = async () => {
    try {
      var result = await agent.User.current();
      runInAction(() => {
        this.user = result;
      })
    } catch (error) {
      console.log(error);
    }
  }

  @action register = async (values: IUserFormValues) => {
    try {
      var result = await agent.User.register(values);
      this.rootStore.commonStore.setToken(result.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  }

  @action fclogin = async (response: any) => {
    console.log(response);
  }
}
