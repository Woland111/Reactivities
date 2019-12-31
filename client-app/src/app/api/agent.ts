import axios, { AxiosResponse } from "axios";
import { IActivity, IActivitiesEnvelope } from "../models/activity";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";
import { IProfile, IPhoto } from "../models/profile";
import { request } from "http";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error!");
  }
  const { status, config, data, headers } = error.response;
  if (
    status === 404 ||
    (status === 400 && config.method === "get" && data.errors["id"])
  ) {
    history.push("/notfound");
  } else if (
    status === 401 &&
    headers["www-authenticate"] ===
      'Bearer error="invalid_token", error_description="The token is expired"'
  ) {
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.error("Your session has expired - please log in again.");
  } else if (status === 500) {
    toast.error("Uuuggh");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    const formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" }
      })
      .then(responseBody);
  }
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios.get("/activities", { params: params }).then(responseBody),
  details: (id: string): Promise<IActivity> =>
    requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  notattend: (id: string) => requests.del(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", user),
  fblogin: (accessToken: string) =>
    requests.post("/user/facebook", { accessToken })
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (file: Blob): Promise<IPhoto> =>
    requests.postForm("/photos", file),
  setMainImage: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  delete: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) => {
    requests.put("/profiles", {
      displayName: profile.displayName,
      bio: profile.bio
    });
  },
  getActivities: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
};

const Following = {
  follow: (username: string) =>
    requests.post(`/profiles/${username}/following`, {}),
  unfollow: (username: string) =>
    requests.del(`/profiles/${username}/following`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/following?predicate=${predicate}`)
};

export default {
  Activities,
  User,
  Profiles,
  Following
};
