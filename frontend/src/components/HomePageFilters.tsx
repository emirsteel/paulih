import React, { useState } from "react";
import { FileText, BookOpen, Users, Clock } from "lucide-react";

type NavItem = "allPosts" | "university" | "friends" | "recentlyAdded";

type Tab = {
  label: string;
  value: NavItem;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const tabs: Tab[] = [
  { label: "All Posts", value: "allPosts", Icon: FileText },
  { label: "University", value: "university", Icon: BookOpen },
  { label: "Friends", value: "friends", Icon: Users },
  { label: "Recently Added", value: "recentlyAdded", Icon: Clock },
];

const HomePageFilters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>("university");

  return (
    <nav className="bg-white">
      <ul className="flex items-center space-x-8 px-32">
        {tabs.map(({ label, value, Icon }) => {
          const isActive = activeTab === value;

          return (
            <li key={value} className="py-3">
              <button
                onClick={() => setActiveTab(value)}
                className={`
                  group relative flex items-center px-3 py-2 text-sm transition-colors
                  border-b-2
                  ${
                    isActive
                      ? "border-black font-bold text-black hover:bg-gray-100 hover:rounded-md"
                      : "border-transparent text-gray-700 hover:text-black hover:bg-gray-100 hover:rounded-md"
                  }
                `}
              >
                <Icon
                  width={20}
                  height={20}
                  className={`mr-1 ${
                    isActive
                      ? "text-black"
                      : "text-gray-500 group-hover:text-black"
                  }`}
                />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default HomePageFilters;
