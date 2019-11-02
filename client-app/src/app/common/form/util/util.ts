export const combinedDateAndTime = (date: Date, time: Date) => {
    let timeString = `${time.getHours()}:${time.getMinutes()}:00`;
    let dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    return new Date(`${dateString} ${timeString}`);
}
