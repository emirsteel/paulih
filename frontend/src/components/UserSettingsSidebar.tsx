import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Link as LinkIcon,
  Database,
  HelpCircle,
  Trash2,
  Bird,
} from "lucide-react";

interface UserSettingsSidebarProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sections = [
  {
    title: "Profil",
    links: [
      {
        to: "/settings/profile/change-password",
        label: "Şifre Değiştir",
        icon: <User size={16} />,
      },
    ],
  },
  {
    title: "Gizlilik ve Güvenlik",
    links: [
      {
        to: "/settings/security/blocked",
        label: "Engellenen Kullanıcılar",
        icon: <Lock size={16} />,
      },
    ],
  },
  {
    title: "Bağlı Hesaplar",
    links: [
      {
        to: "/settings/accounts/create-page",
        label: "Sayfa Oluştur",
        icon: <LinkIcon size={16} />,
      },
    ],
  },
  {
    title: "Veri ve İzinler",
    links: [
      {
        to: "/settings/data/integrations",
        label: "Üçüncü Taraf Entegrasyonları",
        icon: <Database size={16} />,
      },
      {
        to: "/settings/data/permissions",
        label: "İzinler",
        icon: <Database size={16} />,
      },
      {
        to: "/settings/data/sharing",
        label: "Veri Paylaşım Tercihleri",
        icon: <Database size={16} />,
      },
    ],
  },
  {
    title: "Destek",
    links: [
      {
        to: "/settings/support/contact",
        label: "Destek ile İletişime Geç",
        icon: <HelpCircle size={16} />,
      },
      {
        to: "/settings/support/faqs",
        label: "SSS & Yardım Merkezi",
        icon: <HelpCircle size={16} />,
      },
    ],
  },
];

const UserSettingsSidebar: React.FC<UserSettingsSidebarProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    to: string
  ) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setMenuOpen(false); // Hide sidebar immediately
      navigate(to); // Navigate without delay
    }
  };

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-6 z-50
        transform transition-transform duration-300 md:transform-none md:transition-none
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center mb-8">
          <Bird size={24} className="text-blue-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">
            Paulih
          </span>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col space-y-8 md:flex-1 md:space-y-8 overflow-y-auto md:overflow-visible max-h-[calc(100vh-112px)] md:max-h-none pr-2 md:pr-0">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-400 mb-2">
                {section.title}
              </h3>
              <div className="flex flex-col space-y-1">
                {section.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={(e) => handleLinkClick(e, link.to)}
                    className={({ isActive }) =>
                      `flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Delete Account Link */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <NavLink
              to="/settings/security/delete"
              onClick={(e) => handleLinkClick(e, "/settings/security/delete")}
              className={({ isActive }) =>
                `flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                    : "text-red-600 hover:bg-red-50"
                }`
              }
            >
              <Trash2 size={16} />
              <span className="ml-3">Hesabı Sil</span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettingsSidebar;
