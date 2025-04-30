// frontend/src/services/api.ts
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define separate base URLs for user-related and chat-related APIs

const API_BASE_URL = "http://localhost:5001/api";
const USER_API_URL = "http://localhost:5001/api/users";
const CHAT_API_URL = "http://localhost:5001/api/chat";
const VENUE_API_URL = "http://localhost:5001/api/venues";
const PRODUCT_API_URL = "http://localhost:5001/api/products";
const CART_URL = "http://localhost:5001/api/cart";
const PROMO_API_URL = "http://localhost:5001/api/promos";
const API_URL = "http://localhost:5001/api/suppliers";
const API_ORDER_ADDRESS_URL = "http://localhost:5001/api/order-address";

// User-related functions
export const signupUser = async (userData: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${USER_API_URL}/signup`, userData);
};

export const verifyUser = async (userData: {
  email: string | null;
  verificationCode: string;
}) => {
  return axios.post(`${USER_API_URL}/verify`, userData);
};

export const loginUser = async (userData: {
  emailOrUsername: string;
  password: string;
}) => {
  return axios.post(`${USER_API_URL}/login`, userData);
};

export const requestPasswordReset = async (data: { email: string }) => {
  return axios.post(`${USER_API_URL}/request-password-reset`, data);
};

export const resetPassword = async (
  token: string,
  data: { password: string }
) => {
  return axios.post(`${USER_API_URL}/reset-password/${token}`, data);
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage.");
  }
  return axios.put(`${USER_API_URL}/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchUsers = async (query: string) => {
  const response = await axios.get(`${USER_API_URL}/search`, {
    params: { query },
  });
  return response.data;
};

export const resendVerificationCode = async (email: string | null) => {
  return axios.post(`${USER_API_URL}/resend-verification-code`, { email });
};

export const getUserByToken = async (token: string) => {
  return axios.get(`${USER_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = async (userId: string, data: FormData) => {
  const token = localStorage.getItem("token");
  return axios.put(`${USER_API_URL}/user/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBannerImage = async (userId: string, formData: FormData) => {
  const token = localStorage.getItem("token");
  return axios.put(`${USER_API_URL}/user/${userId}/banner-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchInterestedUsers = async () => {
  try {
    const response = await axios.get(`${USER_API_URL}/interested-users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching interested users:", error);
    return [];
  }
};

export const fetchUserProfile = async (username: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${USER_API_URL}/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchFriendRequests = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${USER_API_URL}/friend-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.friendRequests;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

export const cancelFriendRequest = async (
  userId: string,
  targetUserId: string
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${USER_API_URL}/cancel-friend-request`,
      { userId, targetUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling friend request:", error);
    throw error;
  }
};

// Chat-related functions
export const fetchFriends = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${CHAT_API_URL}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

// services/api.ts
export const fetchFriendSuggestions = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/friends/suggestions",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching friend suggestions:", error);
    return { universitySuggestions: [], mutualSuggestions: [] };
  }
};

export const fetchConversation = async (userId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${CHAT_API_URL}/conversations/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

// Send message API call – supports both JSON and FormData
export const sendMessage = async (messageData: any) => {
  const token = localStorage.getItem("token");

  try {
    let config;
    let data;

    // Check if messageData is FormData (i.e. when files are attached)
    if (messageData instanceof FormData) {
      // Ensure a "message" field exists (even if empty)
      if (!messageData.has("message")) {
        messageData.append("message", "");
      }
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      data = messageData;
    } else {
      // For JSON payloads, make sure message is a string
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      data = { ...messageData, message: messageData.message || "" };
    }

    const response = await axios.post(`${CHAT_API_URL}/messages`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error in sendMessage API:", error);
    throw error;
  }
};

// reactToMessage API call
export const reactToMessage = async (reactionData: {
  messageId: string;
  emoji: string;
}) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${CHAT_API_URL}/messages/react`,
      reactionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error reacting to message:", error);
    throw error;
  }
};

// services/api.ts
export const removeReaction = async (data: {
  messageId: string;
  emoji: string;
}) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${CHAT_API_URL}/messages/removeReaction`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // The updated message
  } catch (error) {
    console.error("Error removing reaction:", error);
    throw error;
  }
};

// Function to set up the Axios interceptor
export const setupAxiosInterceptors = (
  navigate: ReturnType<typeof useNavigate>
) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.expired
      ) {
        alert("Your token is out. Please log in again!");

        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("username");
        localStorage.removeItem("profileImage");

        navigate("/login");
      }
      return Promise.reject(error);
    }
  );
};

// frontend/src/services/api.ts

// Function to upload profile image
export const updateProfileImage = async (
  userId: string,
  formData: FormData
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `http://localhost:5001/api/users/user/${userId}/profile-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

export const markMessagesAsSeen = async (senderId: string) => {
  const token = localStorage.getItem("token");
  try {
    await axios.post(
      `${CHAT_API_URL}/messages/seen`,
      { senderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    throw error;
  }
};

export const fetchActiveUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${USER_API_URL}/online-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the list of active users
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};

export const createCompany = async (companyData: any) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/companies/create",
      companyData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const createGroup = async (groupData: FormData) => {
  const token = localStorage.getItem("token");
  return axios.post("http://localhost:5001/api/groups/create", groupData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchUserGroups = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://localhost:5001/api/groups/my-groups",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Returns an array of groups
  } catch (error) {
    console.error("Error fetching user groups:", error);
    throw error;
  }
};

export const fetchMemberDetails = async (memberId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:5001/api/users/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Returns member details (name, username, profileImage, etc.)
  } catch (error) {
    console.error(`Error fetching details for member ID: ${memberId}`, error);
    throw error;
  }
};

export const fetchAllUnreadMessages = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${CHAT_API_URL}/all-unread-messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response from fetchAllUnreadMessages:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching all unread messages:", error);
    return [];
  }
};
export const fetchAllVenues = async () => {
  try {
    const response = await axios.get(VENUE_API_URL);
    return response.data; // Returns an array of venues
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const createVenue = async (venueData: any) => {
  try {
    const response = await axios.post(VENUE_API_URL, venueData);
    return response.data; // Returns the newly created venue
  } catch (error) {
    console.error("Error creating venue:", error);
    throw error;
  }
};

export const fetchVenuesByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${VENUE_API_URL}?category=${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venues by category:", error);
    throw error;
  }
};

export const fetchProductsByVenue = async (venueId: string) => {
  try {
    const response = await axios.get(`${PRODUCT_API_URL}/venue/${venueId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchVenueById = async (id: string) => {
  try {
    const response = await axios.get(`${VENUE_API_URL}/${id}`);
    console.log(`Venue ID: ${id} - Name: ${response.data.name}`); // Debugging
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue with ID ${id}:`, error);
    return { name: "Unknown Venue" }; // Prevent errors
  }
};

export const fetchVenuesByAddedProducts = async (userId: string) => {
  try {
    const response = await axios.get(`${VENUE_API_URL}/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venues by added products:", error);
    throw error;
  }
};

export const fetchVenueEarnings = async (venueId: string) => {
  try {
    console.log(`🔄 Fetching earnings for venue ID: ${venueId}`); // Debug log
    const response = await axios.get(
      `http://localhost:5001/api/payments/earnings/${venueId}`
    );
    console.log("✅ API Response:", response.data); // Log the full response
    return response.data.totalEarnings;
  } catch (error) {
    console.error("❌ Error fetching venue earnings:", error);
    return 0; // Return 0 in case of error
  }
};

export const toggleVenueLike = async (venueId: string, userId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/venues/${venueId}/like`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle like.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Add to Cart
export const addToCart = async (userId: string, productId: string) => {
  try {
    return await axios.post(`${CART_URL}/add`, { userId, productId });
  } catch (error) {
    console.error("Axios error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

// Get Cart
export const getCart = async (userId: string) => {
  return axios.get(`${CART_URL}/${userId}`);
};

// Remove from Cart
export const removeFromCart = async (userId: string, productId: string) => {
  return axios.delete(`${CART_URL}/${userId}/${productId}`);
};

// Update Cart Quantity
export const updateCartQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  return axios.put(`${CART_URL}/${userId}/${productId}`, { quantity });
};

export const fetchProductById = async (productId: string) => {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    return response.data; // Ensure this matches the expected product structure
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

export const processPayment = async (paymentData: {
  userId: string;
  amount: number;
  paymentMethod: string;
  deliveryAddress: {
    addressTitle: string;
    apartment: string;
    flat: string;
    floor: string;
    phoneNumber: string;
    addressDescription: string;
    latitude: number;
    longitude: number;
    selectedTag: string;
  };
  cardDetails?: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}) => {
  const response = await axios.post(
    "http://localhost:5001/api/payments",
    paymentData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const createOrder = async (orderData: any) => {
  return axios.post("http://localhost:5001/api/orders", orderData, {
    headers: { "Content-Type": "application/json" },
  });
};

// Apply promo code
export const applyPromoCode = async (code: string, total: number) => {
  try {
    const response = await axios.post(`${PROMO_API_URL}/apply`, {
      code,
      total,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to apply promo code"
    );
  }
};

// Create promo code (admin functionality)
export const createPromoCode = async (promoData: {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: string;
}) => {
  try {
    const response = await axios.post(`${PROMO_API_URL}/create`, promoData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to create promo code"
    );
  }
};

export const loginSupplier = async (supplierData: {
  username: string;
  password: string;
}) => {
  return axios.post("http://localhost:5001/api/suppliers/login", supplierData);
};

/** Fetch Supplier Stats */
export const fetchSupplierStats = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier stats:", error);
    return {};
  }
};

/** Fetch Recent Orders */
export const fetchRecentOrders = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/recent-orders/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
};

/** Fetch Best Selling Products */
export const fetchBestSellingProducts = async (username: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/best-selling-products/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    return [];
  }
};

export const fetchPurchasedProducts = async (venueId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/payments/purchases/${venueId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased products:", error);
    return [];
  }
};

export const fetchAllPayments = async () => {
  return axios.get("http://localhost:5001/api/payments");
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await axios.put(
      `http://localhost:5001/api/payments/update-order-status`,
      {
        orderId,
        newStatus,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const submitRequest = async (formData: FormData) => {
  return axios.post(`${API_BASE_URL}/requests`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update a product
export const updateProduct = async (productId: string, updatedData: any) => {
  try {
    const response = await axios.put(
      `${PRODUCT_API_URL}/${productId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  const token = localStorage.getItem("token");
  return axios.post("http://localhost:5001/api/products", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateVenuePaymentMethod = async (
  venueId: string,
  paymentMethods: string[]
) => {
  const token = localStorage.getItem("supplierToken"); // ✅ Ensure correct token

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await axios.put(
      `http://localhost:5001/api/venues/${venueId}/payment-method`, // ✅ Ensure correct URL
      { paymentMethod: paymentMethods }, // ✅ Ensure correct data structure
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating payment methods:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchUserOrders = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/payments/user-orders/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

/**
 * Save a new address for the user
 */
export const saveOrderAddress = async (addressData: any) => {
  const token = localStorage.getItem("token");

  return axios.post(`${API_ORDER_ADDRESS_URL}/save`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * Fetch saved addresses of a user
 */
export const getUserAddresses = async (userId: string) => {
  try {
    const response = await axios.get(`${API_ORDER_ADDRESS_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }
};

export const updateSelectedAddress = async (
  userId: string,
  addressId: string
) => {
  try {
    const response = await fetch(`${API_ORDER_ADDRESS_URL}/updateSelected`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, addressId }),
    });

    if (!response.ok) {
      throw new Error(`Error updating address: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating selected address:", error);
    throw error;
  }
};

export const deactivateUserAccount = async () => {
  try {
    const response = await axios.put(
      "/api/users/deactivate",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error deactivating account");
  }
};

export const fetchAllPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/all`);
    return response.data.posts; // Make sure this matches your backend response structure
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

export const fetchPostById = async (postId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/single/${postId}`);
    return response.data.post; // Adjust this if your response structure is different
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export const bookmarkPost = async (postId: string, userId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookmarks`, {
      post: postId,
      user: userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error bookmarking post:", error);
    throw error;
  }
};

// Get bookmarked posts for a specific user
export const getBookmarkedPosts = async (userId: string) => {
  const { data } = await axios.get(`${API_BASE_URL}/bookmarks/user/${userId}`);
  return data.bookmarks;
};

export const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Gönderi silinirken hata oluştu:", error);
    throw error;
  }
};

// In your api.ts file
export const getUserBookmarkCount = async (userId: string) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/bookmarks/user/${userId}/count`
  );
  return data.count;
};

export const getBookmarkStatus = async (postId: string, userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookmarks/status`, {
      params: { post: postId, user: userId },
    });
    return response.data.bookmarked;
  } catch (error) {
    console.error("Error in getBookmarkStatus:", error);
    throw error;
  }
};

export const removeBookmark = async (postId: string, userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookmarks`, {
      params: { post: postId, user: userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

export const getNotificationStatus = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/status`, {
      params: { post: postId, user: userId },
    });
    return response.data.exists;
  } catch (error) {
    console.error("Error checking notification status:", error);
    return false;
  }
};

export const sendNotification = async (notificationData: {
  user: string;
  post: string;
  type?: string;
  message: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/notifications`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error("Error sending notification", error);
    throw error;
  }
};

export const removeNotification = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/notifications`, {
      params: { post: postId, user: userId },
    });
    return response.data.success;
  } catch (error) {
    console.error("Error removing notification:", error);
    return false;
  }
};

// Add this code in your frontend/src/services/api.ts file

export const fetchLatestPayment = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/payments/latest/${userId}`
    );
    return response.data; // Assuming the response data is the latest payment object
  } catch (error) {
    console.error("Error fetching latest payment:", error);
    throw error;
  }
};

// Toggle like/unlike on a comment
export const toggleCommentLike = async (
  postId: string,
  commentId: string,
  userId: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/posts/${postId}/comment/${commentId}/like`,
      { userId }
    );
    return response.data; // should include updated likes array
  } catch (error) {
    throw error;
  }
};

export const updateOrderAddress = async (
  addressId: string,
  addressData: any
) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${API_ORDER_ADDRESS_URL}/update/${addressId}`,
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteOrderAddress = async (addressId: string) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_ORDER_ADDRESS_URL}/delete/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateVenue = async (venueId: string, updatedData: any) => {
  const token = localStorage.getItem("supplierToken");
  return axios.put(`${VENUE_API_URL}/${venueId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// New function to upload an image file and update the venue's image field
export const updateVenueImage = async (venueId: string, formData: FormData) => {
  const token = localStorage.getItem("supplierToken");
  return axios.put(`${VENUE_API_URL}/${venueId}/image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateVenueBanner = async (
  venueId: string,
  formData: FormData
) => {
  const token = localStorage.getItem("supplierToken");
  return axios.put(`${VENUE_API_URL}/${venueId}/banner`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginCourier = async (credentials: {
  username: string;
  password: string;
}) => {
  return axios.post("http://localhost:5001/api/couriers/login", credentials);
};

export const fetchCourierPayments = async () => {
  // Adjust the endpoint based on your API design.
  return axios.get("http://localhost:5001/api/payments/courier");
};

export const fetchOtherProductsFromVenue = async (
  userId: string,
  venueId: string
) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/cart/${userId}/venue/${venueId}/others`
    );
    return response.data; // This should be an array of Product objects
  } catch (error) {
    console.error("Error fetching other products from venue:", error);
    throw error;
  }
};

export const reportPost = async (reportData: {
  postId: string;
  category: string;
  reason: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reportposts`,
      reportData
    );
    return response.data;
  } catch (error) {
    console.error("Error reporting post:", error);
    throw error;
  }
};

export const getBookmarkCount = async (
  postId: string
): Promise<{ count: number }> => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/bookmark/count?post=${postId}`
    );
    // Assuming your backend returns an object like { count: number }
    return response.data;
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return { count: 0 };
  }
};

export const fetchSavedPosts = async (userId: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/bookmarks/saved",
      {
        params: { user: userId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    console.log("Saved posts API response:", response.data);
    return response.data.savedPosts || [];
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw error;
  }
};

export const createPage = async (pageData: FormData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE_URL}/pages/create`, pageData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// In frontend/src/services/api.ts

export const fetchPageProfile = async (username: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://localhost:5001/api/pages/${username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching page profile:", error);
    throw error;
  }
};

export const fetchMyPages = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:5001/api/pages/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.pages;
  } catch (error) {
    console.error("Error fetching my pages:", error);
    throw error;
  }
};

// In services/api.ts
export const fetchAllPages = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/pages/");
    return response.data.pages;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
};

// Create a new event with optional photo
export const createEvent = async (eventData: {
  title: string;
  category: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  locationType: string;
  locationLink: string;
  photo?: File | null;
  pageId: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("category", eventData.category);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("startTime", eventData.startTime);
    formData.append("endTime", eventData.endTime);
    formData.append("locationType", eventData.locationType);
    formData.append("locationLink", eventData.locationLink);
    // New: include pageId
    formData.append("pageId", eventData.pageId);

    if (eventData.photo) {
      formData.append("photo", eventData.photo);
    }

    const response = await axios.post(
      "http://localhost:5001/api/events", // or your deployed URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; // { message, event }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Example: get all events
export const getAllEvents = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/events");
    return response.data; // an array of events
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// New: Get events by page
export const fetchEventsByPage = async (pageId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/events/page/${pageId}`
    );
    return response.data; // an array of events
  } catch (error) {
    console.error("Error fetching events by page:", error);
    throw error;
  }
};

// Example function to log in a page (frontend)
export const loginPageAPI = async (username, password) => {
  try {
    const response = await axios.post("http://localhost:5001/api/pages/login", {
      username,
      password,
    });
    // Save the token in localStorage (or your preferred storage)
    localStorage.setItem("pageToken", response.data.token);
    // Optionally save page info
    localStorage.setItem("pageInfo", JSON.stringify(response.data.page));
    return response.data;
  } catch (error) {
    console.error("Page login error:", error.response.data);
    throw error;
  }
};

// Add this function in your frontend/src/services/api.ts

export const getDataOfThePageById = async (pageId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/events/pageinfo/${pageId}`
    );
    return response.data; // Expected to return an object with name, username, profileImage, etc.
  } catch (error) {
    console.error("Error fetching page data:", error);
    throw error;
  }
};

export const toggleEventParticipation = async (
  eventId: string,
  userId: string
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/events/participate`, {
      eventId,
      userId,
    });
    return response.data; // Expecting { participants: [...] } from backend
  } catch (error) {
    console.error("Error toggling event participation:", error);
    throw error;
  }
};

export const followPageAPI = async (pageId: string) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `http://localhost:5001/api/pages/${pageId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unfollowPageAPI = async (pageId: string) => {
  const token = localStorage.getItem("token");
  return axios.delete(`http://localhost:5001/api/pages/${pageId}/follow`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sharePostToFriend = async (friendId: string, post: any) => {
  const token = localStorage.getItem("token");
  if (!post._id) {
    throw new Error("Invalid post data: Missing _id");
  }
  return axios.post(
    "http://localhost:5001/api/chat/messages",
    {
      receiverId: friendId,
      postId: post._id, // Ensure this is defined
      message: "", // Optionally, include a default message if required
      description: "Shared Post",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const fetchFriendsPosts = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/friends/${userId}`);
    return response.data.posts;
  } catch (error) {
    console.error("Error fetching friends posts:", error);
    throw error;
  }
};

// Report a user or group
export const reportEntity = async (reportData: {
  entityId: string;
  category: "user" | "group";
  reason: string;
  details: string;
}) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:5001/api/report/entity",
      reportData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error reporting entity:", error);
    throw error;
  }
};

// Block a user
export const blockUserAPI = async (blockerId: string, blockedId: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    "http://localhost:5001/api/blocks/block",
    { blockerId, blockedId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Unblock a user
export const unblockUserAPI = async (blockerId: string, blockedId: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    "http://localhost:5001/api/blocks/unblock",
    { blockerId, blockedId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Fetch blocked users
export const fetchBlockedUsers = async (blockerId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:5001/api/blocks/${blockerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Kullanıcıyı kimin engellediğini getirir
export const fetchBlockedByOthers = async (blockedId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:5001/api/blocks/blocked/${blockedId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// services/api.ts

export const leaveGroupAPI = async (groupId: string, userId: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:5001/api/groups/leave/${groupId}/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Gruptan çıkılamadı");
  }

  return await response.json();
};

export const markLikeAsSeen = async (postId: string, userId: string) => {
  try {
    const response = await axios.patch(
      `http://localhost:5001/api/posts/${postId}/likes/${userId}/seen`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking like as seen:", error);
    throw error;
  }
};

/** Mark a comment as seen */
export const markCommentAsSeen = async (postId: string, userId: string) => {
  try {
    const response = await axios.patch(
      `http://localhost:5001/api/posts/${postId}/comments/${userId}/seen`
    );
    return response.data;
  } catch (error) {
    console.error("Error marking comment as seen:", error);
    throw error;
  }
};

export async function addReply(
  postId: string,
  commentId: string,
  userId: string,
  content: string
) {
  const response = await fetch(
    `http://localhost:5001/api/posts/${postId}/comments/${commentId}/replies`,
    // ✅ dikkat et: comments ve replies çoğul oldu
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add reply");
  }

  return response.json();
}

export const fetchReplyUserInfo = async (userId: string) => {
  try {
    const res = await axios.get(
      `http://localhost:5001/api/posts/reply-user/${userId}`
    );
    return res.data; // { _id, name, username, profileImage }
  } catch (error) {
    console.error("Error fetching reply user info:", error);
    throw error;
  }
};

export const toggleReplyLike = async (
  postId: string,
  commentId: string,
  replyId: string,
  userId: string
) => {
  const response = await axios.put(
    `http://localhost:5001/api/posts/${postId}/comment/${commentId}/reply/${replyId}/like`,
    { userId }
  );
  return response.data.likes; // Return updated likes array
};

export const addReplyToReply = async (
  postId: string,
  commentId: string,
  replyId: string,
  userId: string,
  content: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}/replies`,
    {
      userId,
      content,
    }
  );
  return response.data;
};

export const fetchFriendRequestSenders = async (userId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return [];
  }

  try {
    const response = await axios.get(
      `http://localhost:5001/api/friends/${userId}/friend-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Ensure correct return shape
    return response.data.friendRequests || [];
  } catch (error) {
    console.error("Error fetching friend request senders:", error);
    return [];
  }
};

export const fetchLikesForPost = async (postId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}/notificationlikes`);
    return response.data.likes;
  } catch (error) {
    console.error("Beğeniler alınırken hata oluştu:", error);
    return [];
  }
};

export const fetchLikeNotifications = async (userId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/posts/${userId}/notificationlikes`
    );
    return response.data.likes;
  } catch (error) {
    console.error("Beğeni bildirimleri alınamadı:", error);
    return [];
  }
};
