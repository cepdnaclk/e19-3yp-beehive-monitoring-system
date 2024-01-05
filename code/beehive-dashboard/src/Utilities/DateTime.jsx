export const timeTo12Hour = (dateTime) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  
    return new Intl.DateTimeFormat("en-US", options).format(dateTime);
  };