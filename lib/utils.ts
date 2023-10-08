import { AddPost } from "@/types";
import cuid from "cuid";
import { Timestamp } from "firebase/firestore";

export function timeAgo(createdAt: Timestamp): string {
  const now = new Date();
  const targetDate = new Date(createdAt.seconds * 1000);
  const elapsedMs = now.getTime() - targetDate.getTime();

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // Rough estimation
  const years = Math.floor(days / 365);

  // if (years >= 1) {
  //   return years === 1 ? "1 year ago" : `${years} years ago`;
  // } else if (months >= 1) {
  //   return months === 1 ? "1 month ago" : `${months} months ago`;
  // } else if (weeks >= 1) {
  //   return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  // } else if (days >= 1) {
  //   return days === 1 ? "1 day ago" : `${days} days ago`;
  // } else if (hours >= 1) {
  //   return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  // } else if (minutes >= 1) {
  //   return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  // } else {
  //   return seconds <= 1 ? "just now" : `${seconds} seconds ago`;
  // }

  if (years >= 1) {
    return `${years}y`;
  } else if (months >= 1) {
    return `${months}m`;
  } else if (weeks >= 1) {
    return `${weeks}w`;
  } else if (days >= 1) {
    return `${days}d`;
  } else if (hours >= 1) {
    return `${hours}h`;
  } else if (minutes >= 1) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export function formatDate(inputDate: Timestamp): string {
  const date = new Date(inputDate.seconds * 1000);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear().toString().slice(-2);

  return `${day} ${month} ${year}`;
}

export function formatHour(inputDate: Timestamp): string {
  const date = new Date(inputDate.seconds * 1000);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

export function formatCount(count: number) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "m";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  } else {
    return count.toString();
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
  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

export function isPostsHasEmptyContent(posts: AddPost[]): boolean {
  const isEmptyPost = (post: AddPost): boolean => {
    return !post.content && post.images.length === 0;
  };

  return posts.some((post) => isEmptyPost(post));
}

/**
 * Combines two strings with a hyphen in between.
 * @param prefix - The first part of the merged string.
 * @param suffix - The second part of the merged string.
 * @returns The merged string with a hyphen in between the prefix and suffix.
 */
export function mergeStrings(prefix: string, suffix: string): string {
  return `${prefix}-${suffix}`;
}

/**
 * Generates a unique slug using the cuid library.
 * @returns {string} Unique slug string.
 */
export function getUniqueString() {
  const uniqueSlug = cuid();
  return uniqueSlug;
}
