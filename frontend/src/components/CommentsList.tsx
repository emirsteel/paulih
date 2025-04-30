// src/components/CommentsList.tsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Smile, TrendingUp, Calendar, AtSign, Heart, Send } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  toggleCommentLike,
  addReply,
  fetchReplyUserInfo,
  toggleReplyLike,
  addReplyToReply,
} from "../services/api";
import { useNavigate, Link } from "react-router-dom";

// Helper to format date/time
function formatDate(dateValue: string | { $date: string }): string {
  const dateString =
    typeof dateValue === "string" ? dateValue : dateValue.$date;
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface IdObject {
  $oid: string;
}

export interface User {
  _id: string | IdObject;
  name: string;
  username: string; // ✅ ADD THIS LINE
  profileImage?: string;
  friends?: (string | IdObject)[];
}

export interface Reply {
  _id: string | IdObject;
  user: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: Reply[]; // 🔥 burada recursive tanımlıyoruz
}

export interface Comment {
  _id: string | IdObject;
  user: string | IdObject | User;
  content: string;
  createdAt: string | { $date: string };
  likes?: string[];
  replies?: Reply[]; // 🔥 buraya da yeni Reply interface'ini koyuyoruz
}

export interface CommentsListProps {
  postId: string;
  comments: Comment[];
  user: User;
  commentInput: string;
  handleCommentInputChange: (postId: string, value: string) => void;
  submitComment: (postId: string) => void;
  getProfileImageUrl?: (path?: string) => string;
}

// Extracts a string ID from various shapes
function getId(id: string | IdObject | User | undefined): string {
  if (!id) return "";
  if (typeof id === "string") return id;
  if ("$oid" in id) return id.$oid;
  if ("_id" in id) return getId((id as any)._id);
  return "";
}

// Type guard for populated User objects
function isPopulatedUser(u: string | IdObject | User | null): u is User {
  return u !== null && typeof u === "object" && "name" in u;
}

// Highlights @mentions
function highlightMentions(content: string): (string | JSX.Element)[] {
  const regex = /@([\w]+)/g;
  const parts: (string | JSX.Element)[] = [];
  let last = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const [mention, username] = match;
    const start = match.index;

    if (start > last) parts.push(content.slice(last, start));

    parts.push(
      <Link
        key={start}
        to={`/profile/${username}`}
        className="bg-blue-50 text-blue-600 rounded px-1 hover:underline"
      >
        {mention}
      </Link>
    );

    last = regex.lastIndex;
  }

  if (last < content.length) parts.push(content.slice(last));

  return parts;
}

const fixCommentsUsers = async (
  commentsToFix: Comment[]
): Promise<Comment[]> => {
  const fixedComments = await Promise.all(
    commentsToFix.map(async (comment) => {
      let userData = comment.user;
      if (!isPopulatedUser(userData)) {
        try {
          const info = await fetchReplyUserInfo(getId(comment.user));
          userData = {
            _id: info._id,
            name: info.name,
            username: info.username, // 🛠 ADD THIS
            profileImage: info.profileImage,
          };
        } catch (error) {
          console.error("Failed to fetch comment user info:", error);
        }
      }
      // Fix replies too if necessary
      const fixedReplies = comment.replies
        ? await Promise.all(
            comment.replies.map(async (reply) => {
              let replyUserData = reply.user;
              if (!reply.user.name) {
                try {
                  const info = await fetchReplyUserInfo(reply.user._id);
                  replyUserData = {
                    _id: info._id,
                    name: info.name,
                    username: info.username,
                    profileImage: info.profileImage,
                  };
                } catch (error) {
                  console.error("Failed to fetch reply user info:", error);
                }
              }
              return {
                ...reply,
                user: replyUserData,
              };
            })
          )
        : [];

      return {
        ...comment,
        user: userData,
        replies: fixedReplies.length ? fixedReplies : comment.replies,
      };
    })
  );
  return fixedComments;
};

const CommentsList: React.FC<CommentsListProps> = ({
  postId,
  comments,
  user,
  commentInput,
  handleCommentInputChange,
  submitComment,
  getProfileImageUrl,
}) => {
  const navigate = useNavigate();

  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [sortMode, setSortMode] = useState<"popular" | "latest">("popular");
  const [showMentions, setShowMentions] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [animateLikes, setAnimateLikes] = useState<Record<string, boolean>>({});
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [replyingToReplyId, setReplyingToReplyId] = useState<string | null>(
    null
  );

  // Sync new props
  useEffect(() => {
    (async () => {
      const fixed = await fixCommentsUsers(comments);
      setLocalComments(fixed);
    })();
  }, [comments]);

  const handleSubmitComment = async () => {
    try {
      await submitComment(postId); // Submit comment

      const res = await fetch(`http://localhost:5001/api/posts/${postId}`);
      const postData = await res.json();
      const updatedComments = postData.comments;

      // ✅ Before setting comments, fix user info
      const fixedComments = await fixCommentsUsers(updatedComments);

      setLocalComments(fixedComments); // ✅ Now names & avatars stay correct
      handleCommentInputChange(postId, ""); // clear input
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Fetch reply authors
  useEffect(() => {
    const toFetch: { cIdx: number; rIdx: number; userId: string }[] = [];
    localComments.forEach((c, ci) =>
      c.replies?.forEach((r, ri) => {
        if (typeof r.user !== "object" || !("name" in r.user)) {
          toFetch.push({
            cIdx: ci,
            rIdx: ri,
            userId: typeof r.user === "string" ? r.user : (r.user as any)._id,
          });
        }
      })
    );
    if (!toFetch.length) return;

    (async () => {
      const updated = [...localComments];
      for (const { cIdx, rIdx, userId } of toFetch) {
        try {
          const info = await fetchReplyUserInfo(userId);
          updated[cIdx].replies![rIdx].user = {
            _id: info._id,
            name: info.name,
            username: info.username,
            profileImage: info.profileImage,
          };
        } catch (err) {
          console.error("Failed to fetch reply user:", err);
        }
      }
      setLocalComments(updated);
    })();
  }, [localComments]);
  // Fetch friend list for mentions
  useEffect(() => {
    if (!user.friends?.length) return;
    (async () => {
      const fids = user.friends!.map((f) => getId(f));
      const loaded: User[] = [];
      for (const fid of fids) {
        try {
          const res = await fetch(`http://localhost:5001/api/users/${fid}`);
          loaded.push(await res.json());
        } catch {}
      }
      setFriends(loaded);
    })();
  }, [user.friends]);

  // Show mentions dropdown if input contains "@"
  useEffect(() => {
    setShowMentions(commentInput.includes("@"));
  }, [commentInput]);

  // Emoji picker outside‐click
  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    handleCommentInputChange(postId, commentInput + emojiData.emoji);
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      )
        setShowEmojiPicker(false);
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handler);
    else document.removeEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojiPicker]);

  const currentAvatar =
    user.profileImage && getProfileImageUrl
      ? getProfileImageUrl(user.profileImage)
      : "/default-avatar.png";

  // Like toggle
  const handleLike = async (cid: string) => {
    try {
      const data = await toggleCommentLike(postId, cid, getId(user._id));
      setLocalComments((prev) =>
        prev.map((c) =>
          getId(c._id) === cid ? { ...c, likes: data.likes } : c
        )
      );
      setAnimateLikes((a) => ({ ...a, [cid]: true }));
      setTimeout(() => setAnimateLikes((a) => ({ ...a, [cid]: false })), 500);
    } catch {}
  };

  // Like toggle for replies
  const handleReplyLike = async (commentId: string, replyId: string) => {
    try {
      const updatedLikes = await toggleReplyLike(
        postId,
        commentId,
        replyId,
        getId(user._id)
      );
      setLocalComments((prevComments) =>
        prevComments.map((comment) => {
          if (getId(comment._id) !== commentId) return comment;

          const updatedReplies =
            comment.replies?.map((reply) => {
              if (getId(reply._id) !== replyId) return reply;
              return { ...reply, likes: updatedLikes };
            }) || [];

          return { ...comment, replies: updatedReplies };
        })
      );
      setAnimateLikes((prev) => ({ ...prev, [replyId]: true }));
      setTimeout(
        () => setAnimateLikes((prev) => ({ ...prev, [replyId]: false })),
        500
      );
    } catch (error) {
      console.error("Error liking reply:", error);
    }
  };

  // Reply submit
  const handleReply = async (cid: string) => {
    const body = replyInputs[cid]?.trim();
    if (!body) return;
    try {
      const res = await addReply(postId, cid, getId(user._id), body);
      const updatedComment = res.post.comments.find(
        (c: any) => c._id.toString() === cid
      );
      const reps = await Promise.all(
        (updatedComment?.replies || []).map(async (r: any) => {
          let fullUser = r.user;
          // If user data is missing, fetch it
          if (!r.user.name) {
            try {
              const info = await fetchReplyUserInfo(r.user._id);
              fullUser = {
                _id: info._id,
                name: info.name,
                username: info.username,
                profileImage: info.profileImage,
              };
            } catch (error) {
              console.error(
                "Failed to fetch reply user info after reply:",
                error
              );
            }
          }
          return {
            _id: r._id,
            user: fullUser,
            content: r.content,
            createdAt: r.createdAt,
            likes: r.likes,
          };
        })
      );

      setLocalComments((prev) =>
        prev.map((c) => (getId(c._id) === cid ? { ...c, replies: reps } : c))
      );
      setReplyInputs((r) => ({ ...r, [cid]: "" }));
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Reply to a Reply
  const handleReplyToReply = async (commentId: string, replyId: string) => {
    const body = replyInputs[replyId]?.trim();
    if (!body) return;

    try {
      const res = await addReplyToReply(
        postId,
        commentId,
        replyId,
        getId(user._id),
        body
      ); // ✅ doğru
      const updatedComment = res.post.comments.find(
        (c: any) => c._id.toString() === commentId
      );

      const reps = await Promise.all(
        (updatedComment?.replies || []).map(async (r: any) => {
          let fullUser = r.user;
          if (!r.user.name) {
            try {
              const info = await fetchReplyUserInfo(r.user._id);
              fullUser = {
                _id: info._id,
                name: info.name,
                username: info.username,
                profileImage: info.profileImage,
              };
            } catch (error) {
              console.error(
                "Failed to fetch reply user info after reply:",
                error
              );
            }
          }
          return {
            _id: r._id,
            user: fullUser,
            content: r.content,
            createdAt: r.createdAt,
            likes: r.likes,
            replies: r.replies || [], // ✅ Eğer multi-reply varsa replies boş olmayacak
          };
        })
      );

      setLocalComments((prev) =>
        prev.map((c) =>
          getId(c._id) === commentId ? { ...c, replies: reps } : c
        )
      );

      setReplyInputs((r) => ({ ...r, [replyId]: "" }));
      setReplyingTo(null);
      setReplyingToReplyId(null);
    } catch (error) {
      console.error("Error replying to reply:", error);
    }
  };

  // Sorted view
  const displayed = useMemo(() => {
    const arr = [...localComments];
    if (sortMode === "latest")
      arr.sort(
        (a, b) =>
          new Date(
            typeof b.createdAt === "string" ? b.createdAt : b.createdAt.$date
          ).getTime() -
          new Date(
            typeof a.createdAt === "string" ? a.createdAt : a.createdAt.$date
          ).getTime()
      );

    // If we are NOT inside /post/:postId, only show 5 comments
    if (!window.location.pathname.startsWith("/post/")) {
      return arr.slice(0, 5);
    }

    return arr;
  }, [localComments, sortMode]);

  const loggedId = getId(user._id);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-lg max-w-[700px] mx-auto p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-500 text-sm">
          Yorumlar ({localComments.length})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortMode("popular")}
            className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full border ${sortMode === "popular" ? "border-blue-500 text-blue-500 bg-white" : "border-gray-200 text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
          >
            {" "}
            <TrendingUp size={14} className="mr-1" />
            Popüler
          </button>
          <button
            onClick={() => setSortMode("latest")}
            className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full border ${sortMode === "latest" ? "border-blue-500 text-blue-500 bg-white" : "border-gray-200 text-gray-600 bg-gray-100 hover:bg-gray-200"}`}
          >
            {" "}
            <Calendar size={14} className="mr-1" />
            En Yeni
          </button>
        </div>
      </div>
      {/* New comment */}
      <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 mb-4 relative">
        <img
          src={currentAvatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <textarea
          rows={1}
          value={commentInput}
          onChange={(e) => handleCommentInputChange(postId, e.target.value)}
          placeholder="Yorum yaz..."
          className="flex-1 text-sm bg-transparent resize-none outline-none placeholder-gray-400"
          style={{ caretColor: "blue" }}
        />
        <div className="flex items-center space-x-3 text-gray-400">
          <button
            type="button"
            onClick={() => {
              handleCommentInputChange(postId, commentInput + "@");
            }}
          >
            <AtSign size={16} />
          </button>
          <div className="relative" ref={emojiRef}>
            <button type="button" onClick={() => setShowEmojiPicker((v) => !v)}>
              <Smile size={16} />
            </button>
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute z-20 top-8 right-0">
                <EmojiPicker onEmojiClick={onEmojiClick} />
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="mt-2 px-2 py-1 bg-gray-300 text-sm rounded"
                >
                  Kapat
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!commentInput}
            className={`p-2 rounded-full ${commentInput ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      {/* Comments + Replies */}
      <div className="space-y-4">
        {displayed.map((c) => {
          const cid = getId(c._id);
          // determine display name/avatar
          let name = "Bilinmeyen Kullanıcı",
            avatar = "/default-avatar.png";
          if (isPopulatedUser(c.user)) {
            name = c.user.name;
            if (c.user.profileImage && getProfileImageUrl)
              avatar = getProfileImageUrl(c.user.profileImage);
          } else if (getId(c.user) === loggedId) {
            name = user.name;
            avatar = currentAvatar;
          }
          return (
            <div key={cid} className="space-y-2">
              {/* comment */}
              <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                <img
                  src={avatar}
                  alt={name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-1 space-x-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {highlightMentions(c.content)}
                  </p>
                  <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
                    <button
                      onClick={() => handleLike(cid)}
                      className="flex items-center space-x-1"
                    >
                      <Heart
                        size={18}
                        className={`${c.likes?.includes(loggedId) ? "text-red-500 fill-current" : "text-gray-500 fill-none"} ${animateLikes[cid] ? "animate-like" : ""}`}
                      />
                      <span>{c.likes?.length || 0}</span>
                    </button>

                    {/* Vertical divider */}
                    <div className="h-4 w-px bg-gray-300"></div>

                    <span
                      onClick={() => setReplyingTo(cid)}
                      className="cursor-pointer hover:underline"
                    >
                      Cevapla
                    </span>
                  </div>
                </div>
              </div>

              {/* replies */}
              {/* replies */}
              <div className="relative ml-12 space-y-2">
                {c.replies
                  ?.slice(
                    0,
                    !window.location.pathname.startsWith("/post/") &&
                      !showAllReplies[cid]
                      ? 3
                      : c.replies.length
                  )
                  .map((r, rIdx) => {
                    const rid = getId(r._id);
                    const replyUser = isPopulatedUser(r.user)
                      ? r.user
                      : {
                          name: "Bilinmeyen",
                          username: "unknown",
                          profileImage: undefined,
                        };
                    const imgSrc = replyUser.profileImage
                      ? getProfileImageUrl
                        ? getProfileImageUrl(replyUser.profileImage)
                        : `http://localhost:5001/${replyUser.profileImage}`
                      : "/default-avatar.png";

                    return (
                      <div
                        key={rid}
                        className="relative flex items-start space-x-3"
                      >
                        {replyingTo === cid && replyingToReplyId === rid && (
                          <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 ml-16 mt-2 relative bg-white">
                            <img
                              src={currentAvatar}
                              alt="avatar"
                              className="w-7 h-7 rounded-full object-cover mr-2"
                            />
                            <textarea
                              rows={1}
                              placeholder="Cevabınızı yazın..."
                              value={replyInputs[rid] || ""}
                              onChange={(e) =>
                                setReplyInputs((r) => ({
                                  ...r,
                                  [rid]: e.target.value,
                                }))
                              }
                              className="flex-1 text-sm bg-transparent resize-none outline-none placeholder-gray-400"
                              style={{ caretColor: "blue" }}
                            />
                            <div className="flex items-center space-x-3 text-gray-400">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyInputs((r) => ({
                                    ...r,
                                    [rid]: (r[rid] || "") + "@",
                                  }));
                                }}
                              >
                                <AtSign size={16} />
                              </button>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowEmojiPicker((v) => !v)}
                                >
                                  <Smile size={16} />
                                </button>
                                {showEmojiPicker && (
                                  <div
                                    ref={emojiPickerRef}
                                    className="absolute z-20 top-8 right-0"
                                  >
                                    <EmojiPicker
                                      onEmojiClick={(emojiData) =>
                                        setReplyInputs((r) => ({
                                          ...r,
                                          [rid]:
                                            (r[rid] || "") + emojiData.emoji,
                                        }))
                                      }
                                    />
                                    <button
                                      onClick={() => setShowEmojiPicker(false)}
                                      className="mt-2 px-2 py-1 bg-gray-300 text-sm rounded"
                                    >
                                      Kapat
                                    </button>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => handleReplyToReply(cid, rid)}
                                disabled={!replyInputs[rid]?.trim()}
                                className={`p-2 rounded-full ${
                                  replyInputs[rid]?.trim()
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <Send size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                        {/* Vertical Line */}
                        <div className="absolute left-[-20px] top-0 bottom-0 flex justify-center">
                          <div className="w-0.5 bg-blue-600 h-full rounded"></div>
                        </div>

                        {/* Reply Content */}
                        <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg w-full">
                          <img
                            src={imgSrc}
                            alt={replyUser.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center mb-1 space-x-2">
                              <span className="text-sm font-semibold text-gray-800">
                                {replyUser.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(r.createdAt)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700">
                              {r.content}
                            </div>

                            <div className="flex items-center mt-2 space-x-2 text-xs text-gray-500">
                              {/* Like button for reply */}
                              <button
                                onClick={() => handleReplyLike(cid, rid)}
                                className="flex items-center space-x-1"
                              >
                                <Heart
                                  size={16}
                                  className={`${r.likes?.includes(loggedId) ? "text-red-500 fill-current" : "text-gray-500 fill-none"} ${animateLikes[rid] ? "animate-like" : ""}`}
                                />
                                <span>{r.likes?.length || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Daha Fazla Yanıt */}
                {!window.location.pathname.startsWith("/post/") &&
                  c.replies &&
                  c.replies.length > 3 &&
                  !showAllReplies[cid] && (
                    <button
                      onClick={() =>
                        setShowAllReplies((prev) => ({ ...prev, [cid]: true }))
                      }
                      className="text-blue-600 hover:text-blue-700 hover:underline text-sm ml-2"
                    >
                      Daha Fazla Yanıt
                    </button>
                  )}
              </div>
              {/* reply input */}
              {replyingTo === cid && (
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 ml-12 mt-2 relative bg-white">
                  <img
                    src={currentAvatar}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover mr-2"
                  />
                  <textarea
                    rows={1}
                    placeholder="Cevabınızı yazın..."
                    value={replyInputs[cid] || ""}
                    onChange={(e) =>
                      setReplyInputs((r) => ({ ...r, [cid]: e.target.value }))
                    }
                    className="flex-1 text-sm bg-transparent resize-none outline-none placeholder-gray-400"
                    style={{ caretColor: "blue" }}
                  />
                  <div className="flex items-center space-x-3 text-gray-400">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyInputs((r) => ({
                          ...r,
                          [cid]: (r[cid] || "") + "@",
                        }));
                      }}
                    >
                      <AtSign size={16} />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker((v) => !v)}
                      >
                        <Smile size={16} />
                      </button>
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute z-20 top-8 right-0"
                        >
                          <EmojiPicker
                            onEmojiClick={(emojiData) =>
                              setReplyInputs((r) => ({
                                ...r,
                                [cid]: (r[cid] || "") + emojiData.emoji,
                              }))
                            }
                          />
                          <button
                            onClick={() => setShowEmojiPicker(false)}
                            className="mt-2 px-2 py-1 bg-gray-300 text-sm rounded"
                          >
                            Kapat
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleReply(cid)}
                      disabled={!replyInputs[cid]?.trim()}
                      className={`p-2 rounded-full ${
                        replyInputs[cid]?.trim()
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!displayed.length && (
          <p className="text-center text-gray-500 text-sm">
            İlk yorum yazan sen ol.
          </p>
        )}

        {!window.location.pathname.startsWith("/post/") &&
          localComments.length > 5 && (
            <div className="text-center mt-4">
              <button
                onClick={() => navigate(`/post/${postId}`)}
                className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
              >
                Daha Fazla Yorum
              </button>
            </div>
          )}
      </div>
      <style>{`@keyframes likeAnimation{0%{transform:scale(1);}30%{transform:scale(1.3);}60%{transform:scale(0.9);}100%{transform:scale(1);}}.animate-like{animation:likeAnimation 0.5s ease-in-out;}`}</style>
    </div>
  );
};

export default CommentsList;
