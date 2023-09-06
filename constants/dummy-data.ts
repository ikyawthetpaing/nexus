import { Post, Reply, User } from "@/types";

const users: User[] = [
  {
    id: "flkajd",
    name: "John Doe",
    username: "johndoe",
    bio: "Exploring new design trends...",
    verified: true,
    avatar: {
      uri: "https://images.unsplash.com/photo-1692606742912-b4f9c7102869?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      path: "fkadjkl",
    },
    email: "some",
  },
  {
    id: "aklfjldjla",
    name: "Jane Smith",
    username: "janesmith",
    bio: "Hello, world!",
    verified: false,
    avatar: {
      uri: "https://images.unsplash.com/photo-1693116379354-46cc79d728e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      path: "kflajdl",
    },
    email: "some",
  },
];

const posts: Post[] = [
  {
    id: "post1",
    authorId: users[0].id,
    content: "Hello, world!",
    images: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1671650124341-1f62adedf78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
        path: "lkfald",
        width: 412,
        height: 274,
      },
      {
        uri: "https://images.unsplash.com/photo-1692316647214-f8dc224626b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=100",
        path: "lkfald",
        width: 412,
        height: 231,
      },
      {
        uri: "https://plus.unsplash.com/premium_photo-1671650124341-1f62adedf78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
        path: "lkfald",
        width: 412,
        height: 274,
      },
      {
        uri: "https://images.unsplash.com/photo-1692316647214-f8dc224626b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=100",
        path: "lkfald",
        width: 412,
        height: 231,
      },
    ],
    repliesCount: 5,
    likesCount: 15,
    repostsCount: 3,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "post2",
    authorId: users[1].id,
    content: "The amazing wallpaper",
    images: [
      {
        uri: "https://images.unsplash.com/photo-1692316647214-f8dc224626b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=100",
        path: "lkfald",
        width: 412,
        height: 231,
      },
      {
        uri: "https://plus.unsplash.com/premium_photo-1675014768031-7bf2773a0b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        path: "lkfald",
        width: 1964,
        height: 2455,
      },
    ],
    repliesCount: 0,
    likesCount: 1500,
    repostsCount: 6,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "post3",
    authorId: users[0].id,
    content: "The amazing wallpaper",
    images: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1675014768031-7bf2773a0b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        path: "lkfald",
        width: 1964,
        height: 2455,
      },
    ],
    repliesCount: 0,
    likesCount: 2500,
    repostsCount: 300,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "post4",
    authorId: users[0].id,
    content: null,
    images: [
      {
        uri: "https://images.unsplash.com/photo-1693223679931-2bbf8bbe9105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1892&q=80",
        path: "lkfald",
        width: 412,
        height: 732,
      },
      {
        uri: "https://plus.unsplash.com/premium_photo-1671650124341-1f62adedf78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
        path: "lkfald",
        width: 412,
        height: 274,
      },
      {
        uri: "https://plus.unsplash.com/premium_photo-1675014768031-7bf2773a0b75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        path: "lkfald",
        width: 1964,
        height: 2455,
      },
    ],
    repliesCount: 0,
    likesCount: 2500,
    repostsCount: 1400,
    createdAt: "2023-07-27T10:00:00Z",
  },
];

const replies: Reply[] = [
  {
    id: "klfjal",
    replyTo: "post1",
    authorId: users[1].id,
    content: "Amazing!",
    images: null,
    repliesCount: 12,
    likesCount: 45,
    repostsCount: 1,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "fkadlj",
    replyTo: "post1",
    authorId: users[0].id,
    content: "What?",
    images: null,
    repliesCount: 12,
    likesCount: 45,
    repostsCount: 1,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "afklaj",
    replyTo: "post1",
    authorId: users[1].id,
    content: "OMG",
    images: null,
    repliesCount: 12,
    likesCount: 45,
    repostsCount: 1,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "fkjla",
    replyTo: "post1",
    authorId: users[0].id,
    content: "LOL",
    images: null,
    repliesCount: 12,
    likesCount: 45,
    repostsCount: 1,
    createdAt: "2023-07-27T10:00:00Z",
  },
  {
    id: "fklja",
    replyTo: "post1",
    authorId: users[1].id,
    content: "(*_*)",
    images: null,
    repliesCount: 12,
    likesCount: 45,
    repostsCount: 1,
    createdAt: "2023-07-27T10:00:00Z",
  },
];

export { users, posts, replies };
