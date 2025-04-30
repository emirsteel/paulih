// src/App.tsx
import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import { setupAxiosInterceptors } from "./services/api";
import Loading from "./components/Loading"; // <-- Our splash screen
import CourierLogin from "./components/CourierLoginLeftComponent";
import PrivateCourierRoute from "./pages/PrivateCourirerRoute";
import CourierDashboard from "./components/CourierDashboard";
import CourierLoginPage from "./pages/CourierLoginPage";
import BookmarksPage from "./pages/BookmarksPage";
import NotFound from "./components/NotFound";
import UserSettingsCreatePage from "./components/Settings/ConnectedAccounts/UserSettingsCreatePage";
import PageProfile from "./pages/PageProfile";
import PostPage from "./pages/PostPage";
import UserSettingsThirdParty from "./components/Settings/Data/UserSettingsThirdParty";
import UserSettingsPermissions from "./components/Settings/Data/UserSettingsPermissions";
import UserSettingsSharing from "./components/Settings/Data/UserSettingsSharing";
import UserSettingsContact from "./components/Settings/Support/UserSettingsContact";
import UserSettingsFaqs from "./components/Settings/Support/UserSettingsFaqs";
import ComingSoonPage from "./pages/ComingSoonPage";
import UserSettingsBlockedUsers from "./components/Settings/PrivacySecurity/UserSettingsBlockedUsers";

// --- Convert each page to lazy imports ---
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const VerificationPage = lazy(() => import("./pages/VerificationPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PersonalDetails = lazy(
  () =>
    import("./pages/settings/AccountSettings/PersonalDetails/PersonalDetails")
);
const PasswordSecurity = lazy(
  () =>
    import("./pages/settings/AccountSettings/PasswordSecurity/PasswordSecurity")
);
const PrivacySettings = lazy(
  () =>
    import("./pages/settings/AccountSettings/PrivacySettings/PrivacySettings")
);
const Notifications = lazy(
  () => import("./pages/settings/Preferences/Notifications")
);
const AdsPreferences = lazy(
  () => import("./pages/settings/Preferences/AdsPreferences")
);
const ActivityLog = lazy(
  () => import("./pages/settings/YourActivity/ActivityLog")
);
const GeneralSettings = lazy(
  () => import("./pages/settings/YourActivity/GeneralSettings")
);
const CreatePage = lazy(() => import("./pages/settings/Pages/CreatePage"));
const DiscoverPages = lazy(
  () => import("./pages/settings/Pages/DiscoverPages")
);
const LikedPages = lazy(() => import("./pages/settings/Pages/LikedPages"));
const PageInvites = lazy(() => import("./pages/settings/Pages/PageInvites"));
const CategoryPage = lazy(() => import("./pages/OrderPage"));
const OrderFoodVenuePage = lazy(() => import("./pages/OrderFoodVenuePage"));
const OrderCartPage = lazy(() => import("./pages/OrderCartPage"));
const OrderFoodSupplier = lazy(() => import("./pages/OrderFoodSupplier"));
const SupplierPage = lazy(() => import("./pages/SupplierPage"));
const SupplierDashboard = lazy(() => import("./components/SupplierDashboard"));
const OrderFoodAnalysis = lazy(() => import("./pages/OrderFoodAnalysis"));
const SupplierRequestsPage = lazy(() => import("./pages/SupplierRequestsPage"));
const SupplierPaymentMethodsPage = lazy(
  () => import("./pages/SupplierPaymentMethodsPage")
);
const SupplierInfoPage = lazy(() => import("./pages/SupplierInfoPage"));
const SupplierSupportPage = lazy(() => import("./pages/SupplierSupportPage"));
const SupplierMenuProductsPage = lazy(
  () => import("./pages/SupplierMenuProductsPage")
);
const PaymentPageWrapper = lazy(
  () => import("./components/PaymentPageWrapper")
);
const CourierPage = lazy(() => import("./pages/CourierPage"));
const UserSettingsChangePassword = lazy(
  () =>
    import("./components/Settings/ProfileSettings/UserSettingsChangePassword")
);
const UserSettingsDeactivateAccount = lazy(
  () =>
    import(
      "./components/Settings/ProfileSettings/UserSettingsDeactivateAccount"
    )
);

// Add this lazy import at the top with your other lazy-loaded pages:
const UserSettingsDeleteAccount = lazy(
  () =>
    import("./components/Settings/PrivacySecurity/UserSettingsDeleteAccount")
);

const MapPage = lazy(() => import("./pages/MapPage"));

// NEW: SavedPage route

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <div className="app-container">
      {/* Wrap your routes in <Suspense> so that Loading is shown while code is fetched */}
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </div>
  );
}

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth(); // Access authentication and user data

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      {/* Routes for non-logged-in users */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify" element={<VerificationPage />} />

      {/* Protected Home Page */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Profile Page */}
      <Route
        path="/bookmarks"
        element={
          <PrivateRoute>
            <BookmarksPage />
          </PrivateRoute>
        }
      />

      {/* Forgot/Reset Password */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Profile Page */}
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/post/:postId"
        element={
          <PrivateRoute>
            <PostPage />
          </PrivateRoute>
        }
      />

      {/* Profile Page */}
      <Route
        path="/pages/:username"
        element={
          <PrivateRoute>
            <PageProfile />
          </PrivateRoute>
        }
      />

      {/* User Settings Page */}
      <Route
        path="/settings/*"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      >
        <Route
          path="profile/change-password"
          element={<UserSettingsChangePassword />}
        />
        <Route
          path="profile/deactivate"
          element={<UserSettingsDeactivateAccount />}
        />

        <Route
          path="accounts/create-page"
          element={<UserSettingsCreatePage />}
        />

        <Route path="security/delete" element={<UserSettingsDeleteAccount />} />

        <Route path="data/integrations" element={<UserSettingsThirdParty />} />
        <Route path="data/permissions" element={<UserSettingsPermissions />} />
        <Route path="data/sharing" element={<UserSettingsSharing />} />
        <Route path="support/contact" element={<UserSettingsContact />} />
        <Route path="support/faqs" element={<UserSettingsFaqs />} />
        <Route path="security/blocked" element={<UserSettingsBlockedUsers />} />
      </Route>

      {/* Chat Page */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Order Pages */}
      <Route path="/order/:category" element={<CategoryPage />} />
      <Route path="/order" element={<CategoryPage />} />
      <Route path="/order/food/venue/:id" element={<OrderFoodVenuePage />} />
      <Route path="/order-cart" element={<OrderCartPage />} />
      <Route path="/order-payment" element={<PaymentPageWrapper />} />

      {/* Supplier Portal */}
      <Route path="/supplier" element={<OrderFoodSupplier />} />
      <Route path="/supplier" element={<SupplierPage />} />
      <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      <Route path="/supplier/analysis" element={<OrderFoodAnalysis />} />
      <Route path="/supplier/requests" element={<SupplierRequestsPage />} />
      <Route
        path="/supplier/payment-methods"
        element={<SupplierPaymentMethodsPage />}
      />
      <Route path="/supplier/business-info" element={<SupplierInfoPage />} />
      <Route path="/supplier/support" element={<SupplierSupportPage />} />
      <Route path="/supplier/products" element={<SupplierMenuProductsPage />} />
      <Route
        path="/supplier/payment-methods"
        element={<SupplierPaymentMethodsPage />}
      />

      {/* Courier */}
      <Route path="/courier/login" element={<CourierLoginPage />} />
      <Route path="/courier/dashboard" element={<CourierDashboard />} />

      {/* Map Page */}
      <Route path="/map" element={<MapPage />} />

      <Route path="/coming-soon" element={<ComingSoonPage />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
