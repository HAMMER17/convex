

const Time = (times: any) => {
  const date = new Date(times);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;
  return time
}

export default Time
