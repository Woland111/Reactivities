import { IActivity, IAttendee } from "../../../models/activity";
import { IUser } from "../../../models/user";

export const combinedDateAndTime = (date: Date, time: Date) => {
  let timeString = `${time.getHours()}:${time.getMinutes()}:00`;
  let dateString = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`;
  return new Date(`${dateString} ${timeString}`);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(a => a.username === user.username);
  activity.isHost = activity.attendees.some(
    a => a.username === user.username && a.isHost
  );
};

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        username: user.username,
        isHost: false,
        image: user.image!
    }
}
