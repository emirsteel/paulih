import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSearch,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import {
  FaFilter,
  FaDownload,
  FaSlidersH,
  FaSortAmountDown,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Input from "../ui/Input";
import { updateProduct } from "../services/api"; // Import API function

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface Product {
  _id: string;
  venueId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[];
  extraSideChoice: { name: string; price: number }[];
  sauces: { name: string }[];
  promotions: string[];
  lavashChoices: { name: string; price: number }[];
  extraTavukDonerChoice?: { name: string; price: number };
}

interface SupplierMenuProductsProps {
  products: Product[];
  venueName: string;
}

const SupplierMenuProducts: React.FC<SupplierMenuProductsProps> = ({
  products,
  venueName,
}) => {
  const [showSort, setShowSort] = useState(false);
  const [sortType, setSortType] = useState("");
  const [showData, setShowData] = useState(true);
  const [activeTab, setActiveTab] = useState("Product Analytics");

  // For editing
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Open Edit Modal
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setUpdatedProduct({ ...product });
    setShowEditPopup(true);
  };

  // Handle basic input changes (name, price, description, category)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!updatedProduct) return;
    const { name, value, type } = e.target;
    setUpdatedProduct({
      ...updatedProduct,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  // Handle updates for array fields (choiceExtracted and sauces)
  const handleArrayChange = (
    index: number,
    field: "choiceExtracted" | "sauces",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!updatedProduct) return;
    const newArray = [...updatedProduct[field]];
    newArray[index] = e.target.value;
    setUpdatedProduct({
      ...updatedProduct,
      [field]: newArray,
    });
  };

  // Handle updates for extraSideChoice (array of objects)
  const handleExtraSideChange = (
    index: number,
    field: "name" | "price",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!updatedProduct) return;
    const newExtraSide = [...updatedProduct.extraSideChoice];
    newExtraSide[index] = {
      ...newExtraSide[index],
      [field]: field === "price" ? parseFloat(e.target.value) : e.target.value,
    };
    setUpdatedProduct({
      ...updatedProduct,
      extraSideChoice: newExtraSide,
    });
  };

  // Handle updates for lavashChoices (array of objects)
  const handleLavashChoiceChange = (
    index: number,
    field: "name" | "price",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!updatedProduct) return;
    const newLavashChoices = [...updatedProduct.lavashChoices];
    newLavashChoices[index] = {
      ...newLavashChoices[index],
      [field]: field === "price" ? parseFloat(e.target.value) : e.target.value,
    };
    setUpdatedProduct({
      ...updatedProduct,
      lavashChoices: newLavashChoices,
    });
  };

  // Handle updates for extraTavukDonerChoice (object)
  const handleExtraTavukDonerChange = (
    field: "name" | "price",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!updatedProduct) return;
    const currentExtra = updatedProduct.extraTavukDonerChoice || {
      name: "",
      price: 0,
    };
    setUpdatedProduct({
      ...updatedProduct,
      extraTavukDonerChoice: {
        ...currentExtra,
        [field]:
          field === "price" ? parseFloat(e.target.value) : e.target.value,
      },
    });
  };

  // Functions to add new empty entries for array fields
  const addChoiceExtracted = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      choiceExtracted: [...updatedProduct.choiceExtracted, ""],
    });
  };

  const addExtraSideChoice = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      extraSideChoice: [
        ...updatedProduct.extraSideChoice,
        { name: "", price: 0 },
      ],
    });
  };

  const addSauce = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      sauces: [...updatedProduct.sauces, { name: "" }],
    });
  };

  const addLavashChoice = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      lavashChoices: [...updatedProduct.lavashChoices, { name: "", price: 0 }],
    });
  };

  // Delete functions for array fields
  const deleteChoiceExtracted = (index: number) => {
    if (!updatedProduct) return;
    const newArray = updatedProduct.choiceExtracted.filter(
      (_, i) => i !== index
    );
    setUpdatedProduct({
      ...updatedProduct,
      choiceExtracted: newArray,
    });
  };

  const deleteExtraSideChoice = (index: number) => {
    if (!updatedProduct) return;
    const newArray = updatedProduct.extraSideChoice.filter(
      (_, i) => i !== index
    );
    setUpdatedProduct({
      ...updatedProduct,
      extraSideChoice: newArray,
    });
  };

  const deleteSauce = (index: number) => {
    if (!updatedProduct) return;
    const newArray = updatedProduct.sauces.filter((_, i) => i !== index);
    setUpdatedProduct({
      ...updatedProduct,
      sauces: newArray,
    });
  };

  const deleteLavashChoice = (index: number) => {
    if (!updatedProduct) return;
    const newArray = updatedProduct.lavashChoices.filter((_, i) => i !== index);
    setUpdatedProduct({
      ...updatedProduct,
      lavashChoices: newArray,
    });
  };

  // Delete extraTavukDonerChoice by clearing the field
  const deleteExtraTavukDonerChoice = () => {
    if (!updatedProduct) return;
    setUpdatedProduct({
      ...updatedProduct,
      extraTavukDonerChoice: undefined,
    });
  };

  // Handle Close Modal
  const handleClosePopup = () => {
    setSelectedProduct(null);
    setUpdatedProduct(null);
    setShowEditPopup(false);
  };

  // Handle Save (Send Update to Backend)
  const handleSave = async () => {
    if (!updatedProduct) return;
    try {
      await updateProduct(updatedProduct._id, updatedProduct);
      alert("Product updated successfully!");
      handleClosePopup();
      window.location.reload(); // Refresh the page after saving
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  // **Filter States**
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // **Extract Unique Categories**
  const uniqueCategories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // **Sorting Logic**
  const sortedProducts = [...products].sort((a, b) => {
    if (sortType === "name-asc") return a.name.localeCompare(b.name);
    if (sortType === "name-desc") return b.name.localeCompare(a.name);
    if (sortType === "price-low-high") return a.price - b.price;
    if (sortType === "price-high-low") return b.price - a.price;
    return 0;
  });

  // **Filtering Logic**
  const filteredProducts = sortedProducts.filter((product) => {
    return (
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || product.category === selectedCategory) &&
      (minPrice === "" || product.price >= parseFloat(minPrice)) &&
      (maxPrice === "" || product.price <= parseFloat(maxPrice))
    );
  });

  // Export Table to PDF with Better Design
  const handleExportToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Product List", 14, 15);

    // Define table headers with better styling
    const tableColumn = [
      "Image",
      "Product Name",
      "Category",
      "Price ($)",
      "Description",
    ];

    // Define table rows
    const tableRows: any[] = [];
    products.forEach((product) => {
      const rowData = [
        {
          content: " ", // Image placeholder
          styles: { minCellHeight: 14, halign: "center" },
        },
        product.name,
        product.category,
        `$${product.price.toFixed(2)}`,
        product.description.length > 50
          ? product.description.substring(0, 50) + "..."
          : product.description,
      ];
      tableRows.push(rowData);
    });

    // AutoTable plugin for structured table generation
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [41, 128, 185],
        fontSize: 11,
        halign: "center",
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: { textColor: [44, 62, 80] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save the PDF
    doc.save("Product_List.pdf");
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900">
        Supplier Menu Products
      </h2>
      <p className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
        Navigating Data for Informed Product Decisions
        <span
          onClick={() => setShowData(!showData)}
          className="text-blue-600 cursor-pointer font-semibold flex items-center gap-1"
        >
          {showData ? (
            <>
              Hide data <FiChevronUp size={16} />
            </>
          ) : (
            <>
              Show data <FiChevronDown size={16} />
            </>
          )}
        </span>
      </p>

      {showData && (
        <div className="grid grid-cols-4 border-t border-b border-gray-300 mt-4">
          {/* Avg. Monthly Revenue - With Graph */}
          <div className="flex items-center justify-between px-6 py-4 border-r border-gray-300">
            <div>
              <p className="text-sm text-gray-600">Avg. Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                $4,250.<span className="text-gray-400 text-xl">25</span>
              </h3>
              <p className="text-xs text-green-600">+2.15% From last month</p>
            </div>
            <div className="w-24 h-16"></div>
          </div>

          {/* Avg. Monthly Sales */}
          <div className="flex flex-col justify-center px-6 py-4 border-r border-gray-300">
            <p className="text-sm text-gray-600">Avg. Monthly Sales</p>
            <h3 className="text-2xl font-bold text-gray-900">1,230</h3>
            <p className="text-xs text-green-600">+4.12% From last month</p>
          </div>

          {/* Avg. Favorites */}
          <div className="flex flex-col justify-center px-6 py-4 border-r border-gray-300">
            <p className="text-sm text-gray-600">Avg. Favorites</p>
            <h3 className="text-2xl font-bold text-gray-900">13,180</h3>
            <p className="text-xs text-red-600">-1.20% From last month</p>
          </div>

          {/* Search Volume */}
          <div className="flex flex-col justify-center px-6 py-4">
            <p className="text-sm text-gray-600">Search Volume</p>
            <h3 className="text-2xl font-bold text-gray-900">2,440</h3>
            <p className="text-xs text-green-600">+2.15% From last month</p>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab("Product Analytics")}
            className={`px-3 py-1 text-xs font-medium ${
              activeTab === "Product Analytics"
                ? "bg-gray-200 text-gray-900"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Product Analytics
          </button>
          <button
            onClick={() => setActiveTab("Tag Analytics")}
            className={`px-3 py-1 text-xs font-medium ${
              activeTab === "Tag Analytics"
                ? "bg-gray-200 text-gray-900"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tag Analytics
          </button>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-100">
            <FiPlus size={14} />
          </button>
          <button
            className="flex items-center px-2 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
            onClick={() => setShowSort(!showSort)}
          >
            <FaSortAmountDown className="mr-1" /> Sort
          </button>
          <button
            className="flex items-center px-2 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter className="mr-1" /> Filter
          </button>
          <button
            className="flex items-center px-2 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-100"
            onClick={handleExportToPDF}
          >
            <FaDownload className="mr-1" /> Export
          </button>
        </div>
      </div>

      {/* Sorting Popup */}
      {showSort && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowSort(false)}
        >
          <div
            className="bg-white shadow-lg rounded-lg w-64 p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Sort Products
            </h3>
            <div className="flex flex-col gap-2">
              <button
                className={`text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${
                  sortType === "name-asc" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSortType("name-asc");
                  setShowSort(false);
                }}
              >
                Name (A-Z)
              </button>
              <button
                className={`text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${
                  sortType === "name-desc" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSortType("name-desc");
                  setShowSort(false);
                }}
              >
                Name (Z-A)
              </button>
              <button
                className={`text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${
                  sortType === "price-low-high" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSortType("price-low-high");
                  setShowSort(false);
                }}
              >
                Price (Low-High)
              </button>
              <button
                className={`text-sm px-3 py-2 rounded-md hover:bg-gray-100 ${
                  sortType === "price-high-low" ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSortType("price-high-low");
                  setShowSort(false);
                }}
              >
                Price (High-Low)
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowSort(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="bg-white shadow-md p-5 rounded-lg mt-3 border border-gray-300">
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            Filter Products
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="relative w-full">
              <input
                type="text"
                id="search"
                name="search"
                className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
                placeholder=" "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label
                htmlFor="search"
                className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
              >
                Search by name
              </label>
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm w-full appearance-none focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FaSlidersH
                className="absolute right-3 top-3 text-gray-500"
                size={14}
              />
            </div>
            <div className="relative w-full">
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
                placeholder=" "
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <label
                htmlFor="minPrice"
                className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
              >
                Min Price ($)
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
                placeholder=" "
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <label
                htmlFor="maxPrice"
                className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
              >
                Max Price ($)
              </label>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="px-4 py-2 rounded-md text-xs font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left text-blue-600">
              <th className="py-2 px-3 font-semibold text-xs">Image</th>
              <th className="py-2 px-3 font-semibold text-xs">Product Name</th>
              <th className="py-2 px-3 font-semibold text-xs">Category</th>
              <th className="py-2 px-3 font-semibold text-xs">Price</th>
              <th className="py-2 px-3 font-semibold text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-3 text-gray-500 text-xs"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  } hover:bg-gray-50`}
                >
                  <td className="py-2 px-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-3 text-gray-900 text-xs">
                    {product.name}
                  </td>
                  <td className="py-2 px-3 text-gray-700 text-xs">
                    {product.category}
                  </td>
                  <td className="py-2 px-3 font-bold text-gray-900 text-xs">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="px-3 py-1 rounded text-xs font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {updatedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white shadow-lg rounded-lg w-[500px] p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Product
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Basic Fields using Input component */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <Input
                  id="name"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    handleInputChange({
                      ...e,
                      target: { ...e.target, name: "name" },
                    })
                  }
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={updatedProduct.price.toString()}
                    onChange={(e) =>
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: "price" },
                      })
                    }
                    placeholder="Enter price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Input
                    id="category"
                    value={updatedProduct.category}
                    onChange={(e) =>
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: "category" },
                      })
                    }
                    placeholder="Enter category"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={updatedProduct.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>

            {/* Array Fields */}
            <div className="mt-6 space-y-6">
              {/* choiceExtracted */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Choice Extracted
                  </label>
                  <button
                    onClick={addChoiceExtracted}
                    type="button"
                    className="text-blue-600 text-sm"
                  >
                    + Add
                  </button>
                </div>
                {updatedProduct.choiceExtracted.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      id={`choiceExtracted-${index}`}
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, "choiceExtracted", e)
                      }
                      placeholder={`Choice ${index + 1}`}
                    />
                    <button
                      onClick={() => deleteChoiceExtracted(index)}
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* extraSideChoice */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Extra Side Choices
                  </label>
                  <button
                    onClick={addExtraSideChoice}
                    type="button"
                    className="text-blue-600 text-sm"
                  >
                    + Add
                  </button>
                </div>
                {updatedProduct.extraSideChoice.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      id={`extraSideName-${index}`}
                      value={item.name}
                      onChange={(e) => handleExtraSideChange(index, "name", e)}
                      placeholder="Name"
                    />
                    <Input
                      id={`extraSidePrice-${index}`}
                      type="number"
                      value={item.price.toString()}
                      onChange={(e) => handleExtraSideChange(index, "price", e)}
                      placeholder="Price"
                    />
                    <button
                      onClick={() => deleteExtraSideChoice(index)}
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* sauces */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sauces
                  </label>
                  <button
                    onClick={addSauce}
                    type="button"
                    className="text-blue-600 text-sm"
                  >
                    + Add
                  </button>
                </div>
                {updatedProduct.sauces.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      id={`sauce-${index}`}
                      value={item.name}
                      onChange={(e) => handleArrayChange(index, "sauces", e)}
                      placeholder={`Sauce ${index + 1}`}
                    />
                    <button
                      onClick={() => deleteSauce(index)}
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* lavashChoices */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lavash Choices
                  </label>
                  <button
                    onClick={addLavashChoice}
                    type="button"
                    className="text-blue-600 text-sm"
                  >
                    + Add
                  </button>
                </div>
                {updatedProduct.lavashChoices.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      id={`lavashName-${index}`}
                      value={item.name}
                      onChange={(e) =>
                        handleLavashChoiceChange(index, "name", e)
                      }
                      placeholder="Name"
                    />
                    <Input
                      id={`lavashPrice-${index}`}
                      type="number"
                      value={item.price.toString()}
                      onChange={(e) =>
                        handleLavashChoiceChange(index, "price", e)
                      }
                      placeholder="Price"
                    />
                    <button
                      onClick={() => deleteLavashChoice(index)}
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* extraTavukDonerChoice (Optional) */}
              {updatedProduct.extraTavukDonerChoice && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Extra Tavuk Döner Choice
                    </label>
                    <button
                      onClick={deleteExtraTavukDonerChoice}
                      type="button"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="tavukDonerName"
                      value={updatedProduct.extraTavukDonerChoice.name}
                      onChange={(e) => handleExtraTavukDonerChange("name", e)}
                      placeholder="Name"
                    />
                    <Input
                      id="tavukDonerPrice"
                      type="number"
                      value={updatedProduct.extraTavukDonerChoice.price.toString()}
                      onChange={(e) => handleExtraTavukDonerChange("price", e)}
                      placeholder="Price"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="mt-6">
              <button
                onClick={handleSave}
                className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMenuProducts;
