import React from "react";

const Breadcrumbs: React.FC = () => {
  return (
    <nav className="px-6 py-4 bg-gray-100 text-sm">
      <span>Home</span> / <span>Non-fiction</span> /{" "}
      <span>Self-development</span>
    </nav>
  );
};

export default Breadcrumbs;
