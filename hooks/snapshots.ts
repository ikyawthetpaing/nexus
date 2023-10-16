import { useEffect, useState } from "react";
import { ChatMessage, Follow, Post, User } from "@/types";
import {
  and,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  QueryCompositeFilterConstraint,
  QueryNonFilterConstraint,
  where,
} from "firebase/firestore";

import { FIREBASE_DB, FIRESTORE_COLLECTIONS } from "@/firebase/config";
import {
  chatMessageConverter,
  followConverter,
  likeConverter,
  mergeFollowId,
  mergeLikeId,
  postConverter,
  userConverter,
} from "@/firebase/firestore";

export function usePostsFeedSnapshot() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.POSTS),
      where("replyToId", "==", null),
      limit(25)
    ).withConverter(postConverter);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Post[] = [];
        querySnapshot.forEach((doc) => {
          data.unshift(doc.data());
        });
        setPosts(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return { posts, loading, error };
}

// user related snapshot
export function useUserSnapshot(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      const userRef = doc(
        FIREBASE_DB,
        FIRESTORE_COLLECTIONS.USERS,
        userId
      ).withConverter(userConverter);

      const userUnsubscribe = onSnapshot(
        userRef,
        (doc) => {
          setUser(doc.data() || null);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => {
        userUnsubscribe();
      };
    }
  }, [userId]);

  return { user, loading, error };
}

export function useUserPostsSnapshot(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const postsQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.POSTS),
      and(where("authorId", "==", userId), where("replyToId", "==", null))
    ).withConverter(postConverter);

    const postsUnsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const _posts: Post[] = [];
        querySnapshot.forEach((doc) => {
          _posts.unshift(doc.data());
        });

        setPosts(_posts);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    console.log("fetch user posts");

    return () => {
      postsUnsubscribe();
    };
  }, [userId]);

  return { posts, loading, error };
}

export function useUserLikedSnapshot(postId: string, userId: string) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const likedUnsubscribe = onSnapshot(
      doc(
        FIREBASE_DB,
        FIRESTORE_COLLECTIONS.LIKES,
        mergeLikeId({ postId, userId })
      ).withConverter(likeConverter),
      (doc) => {
        if (doc.exists()) {
          setLiked(true);
          setLoading(false);
        } else {
          setLiked(false);
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      likedUnsubscribe();
    };
  }, [postId, userId]);

  return { liked, loading, error };
}

// post related snapshot
export function usePostSnapshot(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const userRef = doc(
      FIREBASE_DB,
      FIRESTORE_COLLECTIONS.POSTS,
      postId
    ).withConverter(postConverter);

    const userUnsubscribe = onSnapshot(
      userRef,
      (doc) => {
        setPost(doc.data() || null);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      userUnsubscribe();
    };
  }, [postId]);

  return { post, loading, error };
}

export function usePostLikeCountSnapshot(postId: string) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const likeCountQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.LIKES),
      where("postId", "==", postId)
    ).withConverter(likeConverter);

    const likeCountUnsubscribe = onSnapshot(
      likeCountQuery,
      (querySnapshot) => {
        setLikeCount(querySnapshot.size);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      likeCountUnsubscribe();
    };
  }, [postId]);

  return { likeCount, loading, error };
}

export function usePostReplyCountSnapshot(postId: string) {
  const [replyCount, setReplyCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const replyCountQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.POSTS),
      where("replyToId", "==", postId)
    ).withConverter(likeConverter);

    const replyCountUnsubscribe = onSnapshot(
      replyCountQuery,
      (querySnapshot) => {
        setReplyCount(querySnapshot.size);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      replyCountUnsubscribe();
    };
  }, [postId]);

  return { replyCount, loading, error };
}

export function usePostRepliesSnapshot(postId: string) {
  const [replies, setReplies] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const repliesQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.POSTS),
      where("replyToId", "==", postId)
    ).withConverter(postConverter);
    const repliesUnsubscribe = onSnapshot(
      repliesQuery,
      (querySnapshot) => {
        const _replies: Post[] = [];
        querySnapshot.forEach((doc) => {
          _replies.push(doc.data());
        });

        setReplies(_replies);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => {
      repliesUnsubscribe();
    };
  }, [postId]);

  return { replies, loading, error };
}

// follow
export function useUserFollowersCountSnapshot(userId: string) {
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const followersCountQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.FOLLOWS),
      where("followingId", "==", userId)
    ).withConverter(followConverter);

    const likeCountUnsubscribe = onSnapshot(
      followersCountQuery,
      (querySnapshot) => {
        setFollowersCount(querySnapshot.size);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      likeCountUnsubscribe();
    };
  }, [userId]);

  return { followersCount, loading, error };
}

export function useUserFollowingCountSnapshot(userId: string) {
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const followersCountQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.FOLLOWS),
      where("followerId", "==", userId)
    ).withConverter(followConverter);

    const likeCountUnsubscribe = onSnapshot(
      followersCountQuery,
      (querySnapshot) => {
        setFollowingCount(querySnapshot.size);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      likeCountUnsubscribe();
    };
  }, [userId]);

  return { followingCount, loading, error };
}

export function useUserFollowedSnapshot({ followerId, followingId }: Follow) {
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const followUnsubscribe = onSnapshot(
      doc(
        FIREBASE_DB,
        FIRESTORE_COLLECTIONS.FOLLOWS,
        mergeFollowId({ followerId, followingId })
      ).withConverter(followConverter),
      (doc) => {
        if (doc.exists()) {
          setFollowed(true);
          setLoading(false);
        } else {
          setFollowed(false);
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      followUnsubscribe();
    };
  }, []);

  return { followed, loading, error };
}

/**
 * Custom React hook to retrieve chat messages between a sender and a receiver.
 * @param {Object} params - Object containing receiverId and senderId.
 * @returns {Object} - An object containing messages, loading state, and potential error.
 */
export function useChatMessageSnapshot(
  compositeFilter: QueryCompositeFilterConstraint,
  ...queryConstraints: QueryNonFilterConstraint[]
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const messagesQuery = query(
      collection(FIREBASE_DB, FIRESTORE_COLLECTIONS.MESSAGES),
      compositeFilter,
      ...queryConstraints
    ).withConverter(chatMessageConverter);

    const messagesUnsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const fetchedMessages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push(doc.data());
        });

        setMessages(fetchedMessages);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      messagesUnsubscribe();
    };
  }, []);

  return { messages, loading, error };
}
