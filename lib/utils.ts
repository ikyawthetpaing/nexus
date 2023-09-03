export function timeAgo(date: string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const elapsedMs = now.getTime() - targetDate.getTime();
  
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (days >= 1) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours >= 1) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes >= 1) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export const calColor = (color: string, transparent: number) => {
  // Parse the HSL values from the input color string
  const hslValues = color.match(/\d+/g);
  if (!hslValues || hslValues.length !== 3) {
    throw new Error('Invalid HSL color string');
  }

  const [hue, saturation, lightness] = hslValues;

  // Calculate the HSLA color string with the provided transparency
  const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${transparent})`;
  return hslaColor;
};

