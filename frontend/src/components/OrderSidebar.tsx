import React, { useState } from "react";

const categories = ["Food", "Shopping", "Entertainment"];
const companies = {
  Food: ["Pizza Palace", "Burger Bonanza", "Sushi Spot"],
  Shopping: ["Mall Mart", "Boutique Bliss", "Super Store"],
  Entertainment: ["Cinema City", "Theater Time", "Park Paradise"],
};
const products = {
  "Pizza Palace": ["Margherita Pizza", "Pepperoni Pizza", "Veggie Pizza"],
  "Burger Bonanza": ["Cheeseburger", "Double Patty", "Vegan Burger"],
  "Sushi Spot": ["California Roll", "Salmon Sashimi", "Tuna Nigiri"],
};

const OrderSidebar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedCompany(null); // Reset company when a new category is selected
  };

  const handleCompanyClick = (company: string) => {
    setSelectedCompany(company);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li
              key={category}
              className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {selectedCategory && !selectedCompany && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Companies Selling {selectedCategory}
            </h3>
            <ul className="space-y-3">
              {companies[selectedCategory]?.map((company) => (
                <li
                  key={company}
                  className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleCompanyClick(company)}
                >
                  {company}
                </li>
              ))}
            </ul>
          </>
        )}

        {selectedCompany && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Products from {selectedCompany}
            </h3>
            <ul className="space-y-3">
              {products[selectedCompany]?.map((product) => (
                <li
                  key={product}
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  {product}
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default OrderSidebar;
