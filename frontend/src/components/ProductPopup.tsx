import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchProductById } from "../services/api";

interface LavashChoice {
  name: string;
  price?: number;
}

interface ExtraSideChoice {
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  choiceExtracted: string[];
  extraSideChoice: ExtraSideChoice[];
  sauces: { [key: string]: string[] };
  promotions: string[];
  lavashChoices?: LavashChoice[];
  extraTavukDonerChoice?: {
    name: string;
    price: number;
  };
}

interface ProductPopupProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (payload: {
    id: string;
    selectedLavash?: string;
    isExtraTavukDonerSelected?: boolean;
  }) => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [selectedExtraSides, setSelectedExtraSides] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<{
    [key: string]: string;
  }>({});
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [selectedLavash, setSelectedLavash] = useState<string | null>(null);
  const [isExtraTavukDonerSelected, setIsExtraTavukDonerSelected] =
    useState<boolean>(false);

  useEffect(() => {
    if (product?.promotions && product.promotions.length > 0) {
      Promise.all(product.promotions.map(fetchProductById))
        .then(setPromotions)
        .catch((error) => console.error("Error fetching promotions:", error));
    } else {
      setPromotions([]);
    }
  }, [product]);

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleAddToCart = () => {
    if (
      product?.lavashChoices &&
      product.lavashChoices.length > 0 &&
      !selectedLavash
    ) {
      alert("Lütfen bir lavaş seçimi yapın (Zorunlu).");
      return;
    }
    onAddToCart({
      id: product!.id,
      selectedLavash,
      isExtraTavukDonerSelected,
    });
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#6b7280 transparent",
        }}
      >
        {/* IMAGE SECTION */}
        <div className="-mx-6 -mt-6 mb-4 relative">
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-red-700">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={onClose}
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div className="absolute bottom-0 w-full h-16 bg-cover bg-center"></div>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h2>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">
          {product.description}
        </p>
        <p className="text-sm font-semibold text-gray-900 mb-4">
          ${product.price.toFixed(2)}
        </p>

        {/* LAVASH CHOICES */}
        {product.lavashChoices && product.lavashChoices.length > 0 && (
          <div className="p-4 bg-pink-50 rounded-md mb-4 border border-pink-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-bold text-gray-800">Lavaş Seçimi</h3>
              <span className="text-sm text-red-500 font-medium">Zorunlu</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">1 Seçim</p>
            <ul className="space-y-2">
              {product.lavashChoices.map((lavash) => {
                const isSelected = selectedLavash === lavash.name;
                const displayPrice =
                  lavash.price && lavash.price > 0
                    ? `+${lavash.price.toFixed(2)} TL`
                    : "Ücretsiz";
                return (
                  <li key={lavash.name}>
                    <button
                      type="button"
                      onClick={() => setSelectedLavash(lavash.name)}
                      className={`flex w-full justify-between items-center p-3 rounded-md transition ${
                        isSelected
                          ? "bg-pink-100 border border-pink-300"
                          : "bg-white hover:bg-pink-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                            isSelected ? "border-red-500" : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-gray-800">
                          {lavash.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          lavash.price && lavash.price > 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {displayPrice}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* EXTRA TAVUK DONER CHOICE */}
        {product.extraTavukDonerChoice && (
          <div className="p-4 bg-green-50 rounded-md mb-4 border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-bold text-gray-800">
                {product.extraTavukDonerChoice.name}
              </h3>
              <span className="text-sm text-gray-500">İsteğe Bağlı</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Ekstra 20 Gram Tavuk Döner
            </p>
            <button
              type="button"
              onClick={() =>
                setIsExtraTavukDonerSelected(!isExtraTavukDonerSelected)
              }
              className={`flex items-center justify-between w-full p-3 rounded-md transition ${
                isExtraTavukDonerSelected
                  ? "bg-green-100 border border-green-300"
                  : "bg-white hover:bg-green-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 ${
                    isExtraTavukDonerSelected
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {isExtraTavukDonerSelected && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <span className="text-sm text-gray-800">
                  Ekstra 20 Gram Tavuk Döner
                </span>
              </div>
              <span className="text-sm font-medium text-green-600">
                +{product.extraTavukDonerChoice.price.toFixed(2)} TL
              </span>
            </button>
          </div>
        )}

        {/* INGREDIENTS TO REMOVE */}
        <ul className="space-y-2">
          {product.choiceExtracted.map((choice) => (
            <li key={choice} className="group">
              <button
                onClick={() =>
                  toggleSelection(choice, selectedChoices, setSelectedChoices)
                }
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition w-full ${
                  selectedChoices.includes(choice)
                    ? "bg-blue-50 text-blue-600 font-medium line-through"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <div
                  className={`w-6 h-6 mr-3 flex-shrink-0 rounded-sm flex items-center justify-center transition-transform duration-200 ${
                    selectedChoices.includes(choice)
                      ? "bg-blue-500 text-white scale-110"
                      : "bg-gray-200 scale-100"
                  }`}
                >
                  {selectedChoices.includes(choice) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={
                    selectedChoices.includes(choice) ? "line-through" : ""
                  }
                >
                  {choice}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* EXTRA SIDE CHOICE */}
        <ul className="space-y-2">
          {product.extraSideChoice.map((extra) => (
            <li key={extra.name} className="group">
              <button
                onClick={() =>
                  toggleSelection(
                    extra.name,
                    selectedExtraSides,
                    setSelectedExtraSides
                  )
                }
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition w-full ${
                  selectedExtraSides.includes(extra.name)
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-sm flex items-center justify-center transition-transform duration-200 ${
                      selectedExtraSides.includes(extra.name)
                        ? "bg-blue-500 text-white scale-110"
                        : "bg-gray-200 scale-100"
                    }`}
                  >
                    {selectedExtraSides.includes(extra.name) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{extra.name}</span>
                </div>
                <span className="text-amber-500 font-medium">
                  +${extra.price.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* SAUCES */}
        {Object.entries(product.sauces).map(([group, options]) => {
          const optionsArray = Array.isArray(options) ? options : [];
          return (
            <div key={group} className="mb-4">
              <h4 className="text-sm font-semibold mb-2">{group}</h4>
              <ul className="flex flex-wrap gap-2">
                {optionsArray.map((option) => (
                  <li key={option} className="group flex items-center gap-2">
                    <div
                      className={`w-6 h-6 flex items-center justify-center border-2 rounded-sm cursor-pointer ${
                        selectedSauces[group] === option
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-400"
                      }`}
                      onClick={() =>
                        setSelectedSauces((prev) => ({
                          ...prev,
                          [group]: prev[group] === option ? "" : option,
                        }))
                      }
                    >
                      {selectedSauces[group] === option && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <button
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedSauces[group] === option
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() =>
                        setSelectedSauces((prev) => ({
                          ...prev,
                          [group]: prev[group] === option ? "" : option,
                        }))
                      }
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* PROMOTIONS */}
        <ul className="text-sm text-gray-600 mb-4">
          {promotions.map((promo) => (
            <li key={promo.id}>
              {promo.name} - ${promo.price.toFixed(2)}
            </li>
          ))}
        </ul>

        {/* ADD TO CART BUTTON */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductPopup;
