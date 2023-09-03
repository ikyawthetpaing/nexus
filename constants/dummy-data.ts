import { Post, Reply, User } from "@/types";

const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    username: "johndoe",
    bio: "Exploring new design trends...",
    verified: true,
    avatar: require("../assets/images/icon.png"),
    bio: "Web Developer",
    link: "https://example.com/johndoe",
    followers: [],
  },
  {
    id: "user2",
    name: "Jane Smith",
    username: "janesmith",
    bio: "Hello, world!",
    verified: false,
    avatar: require("../assets/images/icon.png"),
    bio: "Designer",
    link: "https://example.com/janesmith",
    followers: [],
  },
  // Add more users...
];

const replies: Reply[] = [
  {
    id: "reply1",
    author: users[0], // John Doe
    content: "Great post!",
    likes: 10,
    createdAt: "2023-07-27T12:00:00Z",
  },
  {
    id: "reply2",
    author: users[1], // Jane Smith
    content: "I agree with you!",
    likes: 5,
    createdAt: "2023-07-27T13:30:00Z",
  },
  // Add more replies...
];

const posts: Post[] = [
  {
    id: "post1",
    author: users[0], // John Doe
    content: "Hello, world!",
    image: require("../assets/images/icon.png"),
    replies: [replies[0], replies[1]],
    repliesCount: 2,
    likesCount: 15,
    mention: true,
    mentionUser: users[1], // Jane Smith
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "post2",
    author: users[1], // Jane Smith
    content: "Coding is fun!",
    likesCount: 8,
    repliesCount: 0,
    createdAt: "2023-07-27T11:30:00Z",
    mentionUser: users[1], // Jane Smith
  },
  {
    id: "post3",
    author: users[0], // Another user
    content: "Just had a great time at the beach!",
    image: require("../assets/images/icon.png"),
    replies: [],
    repliesCount: 0,
    likesCount: 12,
    createdAt: "2023-07-28T14:00:00Z",
    mentionUser: users[1], // Jane Smith
  },
  {
    id: "post4",
    author: users[0], // John Doe
    content: "New coding project in the works!",
    likesCount: 20,
    repliesCount: 3,
    createdAt: "2023-07-29T09:30:00Z",
    mentionUser: users[1], // Jane Smith
  },
  {
    id: "post5",
    author: users[1], // Jane Smith
    content: "Exploring new design trends...",
    image: require("../assets/images/icon.png"),
    replies: [replies[0]],
    repliesCount: 1,
    likesCount: 6,
    createdAt: "2023-07-30T16:45:00Z",
    mentionUser: users[1], // Jane Smith
  },
];

export { users, posts, replies };
