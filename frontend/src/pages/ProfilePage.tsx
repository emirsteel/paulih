// frontend/src/pages/ProfilePage.tsx
import React, { useContext, useEffect, useState } from "react";
import { AuthUserContext } from "../context/AuthUserContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateUserProfile,
  updateProfileImage,
  fetchInterestedUsers,
  updateBannerImage,
  cancelFriendRequest,
} from "../services/api";
import MainLayout from "../components/MainLayout";
import PostOptionsMenu from "../components/PostOptionsMenu";
import { useLiveStream } from "../context/LiveStreamContext";
import axios from "axios";
import { fetchFriendRequests, fetchUserProfile } from "../services/api";
import Notification from "../components/Notification";
import Posts from "../components/Posts";
import ProfileEditProfile from "../components/ProfileEditProfile";
import ProfileInfo from "../components/ProfileInfo";
import SharePopup from "../components/SharePopup";
import BadgesPopup from "../components/BadgesPopup";
// Replace ProfileRightSide with RightSidebar:
import RightSidebar from "../components/RightSidebar";
import { Link, Settings, User } from "lucide-react";
import MobileNavItems from "../components/MobileNavItems";
import CreatePost from "../components/CreatePost";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [postToShare, setPostToShare] = useState(null);
  const [likeStatus, setLikeStatus] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});
  const [showCommentBox, setShowCommentBox] = useState<{
    [postId: string]: boolean;
  }>({});
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState<{
    [postId: string]: boolean;
  }>({});
  const [allCommentsPopup, setAllCommentsPopup] = useState<{
    [postId: string]: boolean;
  }>({});
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const { isLive, stream } = useLiveStream();

  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [isFriend, setIsFriend] = useState(false);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false);

  const [isBadgesPopupOpen, setBadgesPopupOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePostDelete = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const openBadgesPopup = () => setBadgesPopupOpen(true);
  const closeBadgesPopup = () => setBadgesPopupOpen(false);

  const navigate = useNavigate();

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ message: "", type: "", visible: false }),
      3000
    );
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/friend-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Friend Requests Response:", response.data);
        if (response.data.friendRequests) {
          setFriendRequests(response.data.friendRequests);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;
      setLoadingProfile(true);
      setError(null);
      try {
        const response = await fetchUserProfile(username);
        const data = response;
        setProfileData(data);
        setIsFriend(data.isFriend);
        setIsFriendRequestSent(data.isFriendRequestSent);
        setIsFriendRequestReceived(data.isFriendRequestReceived);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("User not found.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileData();
  }, [username]);

  const authContext = useContext(AuthUserContext);
  if (!authContext) {
    throw new Error("AuthUserContext must be used within AuthUserProvider");
  }
  const { user, loading: loadingUser, refreshUserData } = authContext;

  // Initialize updatedProfile with nested keys as empty objects if not present
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    username: "",
    bio: "",
    profileImage: "",
    bannerImage: "",
    personalInfo: {},
    universityInfo: {},
  });

  useEffect(() => {
    if (user) {
      setUpdatedProfile({
        name: user.name,
        username: user.username,
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        bannerImage: user.bannerImage || "",
        personalInfo: (user as any).personalInfo || {},
        universityInfo: (user as any).universityInfo || {},
      });
    }
  }, [user, isModalOpen]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!profileData) return;
      setLoadingPosts(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/posts/${profileData._id}`
        );
        const fetchedPosts = response.data.posts;
        console.log(
          "Fetched Posts for profile:",
          profileData.username,
          fetchedPosts
        );
        setPosts(fetchedPosts);
        const initialLikeStatus: { [postId: string]: boolean } = {};
        const initialLikeCounts: { [postId: string]: number } = {};
        fetchedPosts.forEach((post: any) => {
          const likesArray = Array.isArray(post.likes) ? post.likes : [];
          initialLikeStatus[post._id] = likesArray.some(
            (like: string) => like === user._id
          );
          initialLikeCounts[post._id] = likesArray.length;
        });
        setLikeStatus(initialLikeStatus);
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [profileData]);

  const toggleLike = async (postId: string) => {
    if (!user) return;
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`,
        { userId: user._id }
      );
      const updatedLikes = response.data.likes;
      setLikeStatus((prev) => ({
        ...prev,
        [postId]: updatedLikes.some((like: string) => like === user._id),
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: updatedLikes.length,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchInterestedUsersData = async () => {
    const users = await fetchInterestedUsers();
    setInterestedUsers(users);
  };

  useEffect(() => {
    if (user?.username) {
      fetchInterestedUsersData();
    }
  }, [user?.username]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleTabClick = (tab: string) => setSelectedTab(tab);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedProfile.name || !updatedProfile.username) {
      alert("Name and Username are required");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", updatedProfile.name);
      formData.append("username", updatedProfile.username);
      formData.append("bio", updatedProfile.bio);
      // Append nested personalInfo
      formData.append(
        "personalInfo",
        JSON.stringify(updatedProfile.personalInfo)
      );
      // Append nested universityInfo
      formData.append(
        "universityInfo",
        JSON.stringify(updatedProfile.universityInfo)
      );
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      if (bannerImageFile) {
        formData.append("bannerImage", bannerImageFile);
      }
      await updateUserProfile(user._id, formData);
      await refreshUserData();
      setIsModalOpen(false);
      const response = await axios.get(
        `http://localhost:5001/api/users/${user.username}`
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  // The parent handleInputChange remains for top-level fields.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/posts/${user._id}`
        );
        const fetchedPosts = response.data.posts;
        setPosts(fetchedPosts);
        const initialLikeStatus: { [postId: string]: boolean } = {};
        const initialLikeCounts: { [postId: string]: number } = {};
        fetchedPosts.forEach((post: any) => {
          initialLikeStatus[post._id] = post.likes.includes(user._id);
          initialLikeCounts[post._id] = post.likes.length;
        });
        setLikeStatus(initialLikeStatus);
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    if (user) fetchPosts();
  }, [user]);

  const getProfileImageUrl = (imagePath: string) => {
    return imagePath && imagePath.trim() !== ""
      ? imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const formatRelativeTime = (date: string | number | Date) => {
    const now = new Date().getTime();
    const postDate = new Date(date).getTime();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handleShareClick = (post: any) => {
    setPostToShare(post);
    setIsSharePopupOpen(true);
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
    setPostToShare(null);
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const toggleCommentBox = (postId: string) => {
    setShowCommentBox((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleEmojiClick = (postId: string, emojiObject: any) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || "") + emojiObject.emoji,
    }));
  };

  const toggleEmojiPicker = (postId: string) => {
    setIsEmojiPickerVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content) return;
    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comment`,
        {
          userId: user._id,
          content,
        }
      );
      const updatedPost = response.data.post;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
      window.location.reload();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const getRandomComment = (comments: any[]) => {
    return comments.length > 0
      ? comments[Math.floor(Math.random() * comments.length)]
      : null;
  };

  const openAllCommentsPopup = (postId: string) => {
    setAllCommentsPopup((prev) => ({ ...prev, [postId]: true }));
  };

  const closeAllCommentsPopup = (postId: string) => {
    setAllCommentsPopup((prev) => ({ ...prev, [postId]: false }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImageFile(e.target.files[0]);
    }
  };

  const handleBannerUpload = async () => {
    if (!bannerImageFile) return;
    const formData = new FormData();
    formData.append("bannerImage", bannerImageFile);
    try {
      await updateBannerImage(user._id, formData);
      await refreshUserData();
      console.log("User data after update:", user);
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5001/api/users/send-friend-request",
        { targetUserId: profileData._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setIsFriendRequestSent(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleFriendRequestAction = async (
    requesterId: string,
    action: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/handle-friend-request",
        { requesterId, action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      showNotification(response.data.message, "success");
      if (action === "accept") {
        setIsFriend(true);
        setIsFriendRequestReceived(false);
      } else if (action === "reject") {
        setIsFriendRequestReceived(false);
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      showNotification("An error occurred. Please try again.", "error");
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const response = await cancelFriendRequest(user._id, profileData._id);
      console.log("Cancel Friend Request Response:", response);
      setIsFriendRequestSent(false);
      const updatedProfileData = await fetchUserProfile(profileData.username);
      setProfileData(updatedProfileData);
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const commentUser = user;

  if (loadingUser || loadingProfile || loadingPosts) {
    return <Loading />;
  }
  if (!profileData) return <NotFound />;
  if (!user) return <NotFound />;

  return (
    <MainLayout>
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ message: "", type: "", visible: false })
          }
        />
      )}
      <div className="pt-16 px-4 md:ml-20 lg:mr-80 relative">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full max-w-none md:max-w-2xl mx-auto px-2 md:px-4 space-y-6 mt-12">
            <ProfileInfo
              profileData={profileData}
              getProfileImageUrl={getProfileImageUrl}
              user={user}
              toggleModal={toggleModal} // For profile image editing modal
              openBadgesPopup={openBadgesPopup} // For badges popup
              isFriend={isFriend}
              isFriendRequestSent={isFriendRequestSent}
              isFriendRequestReceived={isFriendRequestReceived}
              sendFriendRequest={sendFriendRequest}
              handleFriendRequestAction={handleFriendRequestAction}
              handleCancelFriendRequest={handleCancelFriendRequest}
            />

            {isBadgesPopupOpen && (
              <BadgesPopup
                badges={profileData.badges || []}
                onClose={closeBadgesPopup}
              />
            )}
            <Posts
              posts={posts}
              user={profileData}
              commentUser={user}
              toggleLike={toggleLike}
              toggleCommentBox={toggleCommentBox}
              handleCommentInputChange={handleCommentInputChange}
              submitComment={submitComment}
              commentInputs={commentInputs}
              showCommentBox={showCommentBox}
              likeStatus={likeStatus}
              likeCounts={likeCounts}
              getProfileImageUrl={getProfileImageUrl}
              openSharePopup={handleShareClick}
              onPostDelete={handlePostDelete}
              onPostClick={handlePostClick}
            />

            <CreatePost
              fetchPosts={() => {}}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              userData={user}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ProfileEditProfile
          updatedProfile={updatedProfile}
          setUpdatedProfile={setUpdatedProfile}
          profileImageFile={profileImageFile}
          bannerImageFile={bannerImageFile}
          saving={saving}
          handleProfileUpdate={handleProfileUpdate}
          handleInputChange={handleInputChange} // Parent's top-level handler
          handleImageChange={handleImageChange}
          handleBannerChange={handleBannerChange}
          toggleModal={toggleModal}
          getProfileImageUrl={getProfileImageUrl}
        />
      )}
      {isSharePopupOpen && postToShare && (
        <SharePopup post={postToShare} onClose={closeSharePopup} />
      )}

      <MobileNavItems
        onOpenCreatePost={() => setModalOpen(true)}
        username={user?.username}
      />
    </MainLayout>
  );
};

export default ProfilePage;
