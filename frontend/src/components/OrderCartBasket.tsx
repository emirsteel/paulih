import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  fetchProductById,
  fetchVenueById,
  fetchOtherProductsFromVenue,
  addToCart,
} from "../services/api";
import ProductPopup from "./ProductPopup";

// Unified product interface that represents the enriched product from the backend.
export interface IProduct {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[];
  extraSideChoice: { name: string; price: number }[];
  sauces: { [key: string]: string[] };
  promotions: string[];
  lavashChoices: { name: string; price?: number }[];
  extraTavukDonerChoice?: { name: string; price: number };
  glutenFree: boolean;
  rated?: number;
  rating?: number;
  reviews?: number;
}

interface CartProduct {
  productId: IProduct & { venueId?: { _id: string; name: string } };
  quantity: number;
  selectedLavash?: string;
  isExtraTavukDonerSelected?: boolean;
}

// Function to convert an enriched IProduct into the shape expected by the ProductPopup.
// In ProductPopup the product prop is expected to have an "id" property instead of "_id".
const convertToPopupProduct = (prod: IProduct) => ({
  id: prod._id,
  name: prod.name,
  image: prod.image,
  description: prod.description,
  price: prod.price,
  category: prod.category,
  choiceExtracted: prod.choiceExtracted,
  extraSideChoice: prod.extraSideChoice,
  sauces: prod.sauces,
  promotions: prod.promotions,
  lavashChoices: prod.lavashChoices,
  extraTavukDonerChoice: prod.extraTavukDonerChoice,
  glutenFree: prod.glutenFree,
  rated: prod.rated,
  rating: prod.rating,
  reviews: prod.reviews,
});

const OrderCartBasket: React.FC<{ userId: string }> = ({ userId }) => {
  const [cart, setCart] = useState<{ products: CartProduct[] } | null>(null);
  // recommendedByVenue maps each venue ID to its recommended products (of type IProduct)
  const [recommendedByVenue, setRecommendedByVenue] = useState<
    Record<string, IProduct[]>
  >({});
  // For opening the product popup when a recommended item is clicked
  const [popupProduct, setPopupProduct] = useState<IProduct | null>(null);
  const navigate = useNavigate();

  // Refresh the cart data
  const refreshCart = () => {
    getCart(userId)
      .then((response) => setCart(response.data))
      .catch((error) => console.error("Error refreshing cart:", error));
  };

  // 1) Fetch & enrich cart on mount
  useEffect(() => {
    getCart(userId)
      .then(async (response) => {
        const cartData = response.data;
        const enrichedPromises = cartData.products.map(
          async (item: CartProduct) => {
            try {
              const productRes = await fetchProductById(item.productId._id);
              const product = productRes.data;
              const venueRes = await fetchVenueById(product.venueId);
              const venue = venueRes.data;
              // Build an enriched product (of type IProduct)
              const enrichedProduct: IProduct = {
                _id: product._id,
                name: product.name,
                image: product.image,
                description: product.description,
                price: product.price,
                category: product.category || "Uncategorized",
                choiceExtracted: product.choiceExtracted || [],
                extraSideChoice: product.extraSideChoice || [],
                sauces: product.sauces || {},
                promotions: product.promotions || [],
                lavashChoices: product.lavashChoices || [],
                extraTavukDonerChoice: product.extraTavukDonerChoice,
                glutenFree: product.glutenFree ?? false,
                rated: product.topRatedRank,
                rating: product.rating,
                reviews: product.reviews,
              };
              return {
                ...item,
                productId: { ...enrichedProduct, venueId: venue },
              } as CartProduct;
            } catch (err) {
              console.error(
                `Error enriching product ${item.productId._id}:`,
                err
              );
              return item;
            }
          }
        );
        const enriched = await Promise.all(enrichedPromises);
        setCart({ products: enriched });
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setCart({ products: [] });
      });
  }, [userId]);

  // 2) Group cart items by venue
  const groupedByVenue =
    cart?.products.reduce(
      (acc, item) => {
        const venueObj = item.productId.venueId;
        const venueId = venueObj?._id || "no-venue";
        if (!acc[venueId]) {
          acc[venueId] = {
            name: venueObj?.name || "Unknown Venue",
            products: [] as CartProduct[],
          };
        }
        acc[venueId].products.push(item);
        return acc;
      },
      {} as Record<string, { name: string; products: CartProduct[] }>
    ) || {};

  const groupedVenues = Object.entries(groupedByVenue);

  // 3) For each venue, fetch “other” products not already in the cart
  useEffect(() => {
    const fetchRecommendedForVenue = async (
      venueId: string,
      cartItems: CartProduct[]
    ) => {
      try {
        let otherProducts = await fetchOtherProductsFromVenue(userId, venueId);
        const productIdsInCart = cartItems.map((c) => c.productId._id);
        otherProducts = otherProducts.filter(
          (p: any) => !productIdsInCart.includes(p._id)
        );
        // Convert each product to our IProduct type
        const converted: IProduct[] = otherProducts.map((p: any) => ({
          _id: p._id,
          name: p.name,
          image: p.image,
          description: p.description,
          price: p.price,
          category: p.category,
          choiceExtracted: p.choiceExtracted || [],
          extraSideChoice: p.extraSideChoice || [],
          sauces: p.sauces || {},
          promotions: p.promotions || [],
          lavashChoices: p.lavashChoices || [],
          extraTavukDonerChoice: p.extraTavukDonerChoice,
          glutenFree: p.glutenFree ?? false,
          rated: p.topRatedRank,
          rating: p.rating,
          reviews: p.reviews,
        }));
        return converted;
      } catch (error) {
        console.error(
          "Error fetching other products for venue:",
          venueId,
          error
        );
        return [];
      }
    };

    const updateRecommended = async () => {
      const newRecommended: Record<string, IProduct[]> = {};
      for (const [venueId, data] of groupedVenues) {
        if (venueId !== "no-venue") {
          const recommended = await fetchRecommendedForVenue(
            venueId,
            data.products
          );
          newRecommended[venueId] = recommended.slice(0, 10); // up to 10 items
        }
      }
      setRecommendedByVenue(newRecommended);
    };

    if (groupedVenues.length > 0) {
      updateRecommended();
    }
  }, [groupedVenues, userId]);

  // Cart actions
  const handleRemove = (productId: string) => {
    removeFromCart(userId, productId)
      .then(() => refreshCart())
      .catch((error) => console.error("Error removing product:", error));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateCartQuantity(userId, productId, quantity)
      .then(() => refreshCart())
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const handleProceedToCheckout = () => {
    navigate("/order-cart");
  };

  // Instead of immediately adding a recommended product, open the product popup.
  const handleOpenPopupForRecommended = (prod: IProduct) => {
    setPopupProduct(prod);
  };

  // Callback when the ProductPopup confirms adding the product.
  const handleAddToCartFromPopup = async (payload: {
    id: string;
    selectedLavash?: string;
    isExtraTavukDonerSelected?: boolean;
  }) => {
    try {
      await addToCart(userId, payload.id);
      refreshCart();
    } catch (error) {
      console.error("Error adding product from popup:", error);
    }
    setPopupProduct(null);
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="border border-yellow-500 bg-white p-6 rounded-lg text-center w-full lg:w-96 h-64 flex flex-col justify-center shadow-md">
        <div className="text-blue-500 text-4xl">🛒</div>
        <p className="text-lg font-bold text-blue-500 mt-4">
          Your basket is empty
        </p>
        <p className="text-sm text-gray-500">Add something to your basket!</p>
      </div>
    );
  }

  // 4) Calculate total price
  const totalPrice = cart.products.reduce((acc: number, item) => {
    let extraPrice = 0;
    if (
      item.selectedLavash &&
      item.productId.lavashChoices &&
      item.productId.lavashChoices.length > 0
    ) {
      const chosen = item.productId.lavashChoices.find(
        (opt) => opt.name === item.selectedLavash
      );
      if (chosen?.price) extraPrice += chosen.price;
    }
    if (
      item.isExtraTavukDonerSelected &&
      item.productId.extraTavukDonerChoice
    ) {
      extraPrice += item.productId.extraTavukDonerChoice.price;
    }
    return acc + ((item.productId.price || 0) + extraPrice) * item.quantity;
  }, 0);

  const formattedTotalPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(totalPrice);

  return (
    <div className="border border-gray-300 bg-white p-6 rounded-lg w-full lg:w-[400px] h-auto shadow-lg">
      {/* Delivery Option at the Top */}
      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2 mb-4">
        <span className="w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs font-bold rounded-full mr-2">
          P
        </span>
        <p className="text-green-600 font-semibold">Paulih getirsin</p> (5 - 10
        dk.)
      </div>

      {/* Cart Items Grouped by Venue */}
      {Object.entries(groupedByVenue).map(([venueId, data]) => (
        <div key={venueId} className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">
            {data.name}
          </h3>
          <ul className="space-y-4">
            {data.products.map((item) => (
              <li
                key={String(item.productId._id)}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                {/* Left side: image + name/price */}
                <div className="flex items-center space-x-3">
                  <img
                    src={item.productId.image || "/images/default-food.png"}
                    alt={item.productId.name || "Product"}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      {item.productId.name || "Unknown"}
                    </p>
                    <p className="text-xs font-bold text-blue-600 mt-1">
                      {(item.productId.price || 0).toFixed(2)} TL
                    </p>
                  </div>
                </div>
                {/* Right side: quantity controls */}
                <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={() =>
                      item.quantity === 1
                        ? handleRemove(item.productId._id)
                        : handleUpdateQuantity(
                            item.productId._id,
                            item.quantity - 1
                          )
                    }
                    className="p-1.5 text-xs bg-white text-blue-600 hover:text-blue-800 transition flex items-center justify-center"
                  >
                    {item.quantity === 1 ? <FaTrash /> : <FaMinus />}
                  </button>
                  <span className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item.quantity + 1
                      )
                    }
                    className="p-1.5 text-xs bg-white text-blue-600 hover:text-blue-800 transition flex items-center justify-center"
                  >
                    <FaPlus />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Display recommended products for this venue */}
          {recommendedByVenue[venueId] &&
            recommendedByVenue[venueId].length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-1 text-gray-800">
                  Sepetine bunları da ekleyebilirsin!
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Diğer kullanıcıların birlikte aldıkları ürünlere göre
                </p>
                <div className="relative">
                  {/* Left arrow */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow z-10 hover:bg-gray-100"
                    onClick={() => {
                      const container = document.getElementById(
                        `slider-${venueId}`
                      );
                      if (container) {
                        container.scrollBy({ left: -120, behavior: "smooth" });
                      }
                    }}
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  {/* Scroll container */}
                  <div
                    id={`slider-${venueId}`}
                    className="overflow-x-auto whitespace-nowrap no-scrollbar px-10"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {recommendedByVenue[venueId].map((prod) => (
                      <div
                        key={prod._id}
                        className="inline-block align-top w-40 bg-white border border-gray-200 rounded-lg p-2 mx-1"
                      >
                        {/* Fixed image container */}
                        <div className="w-full h-28 overflow-hidden rounded bg-gray-50 flex items-center justify-center">
                          <img
                            src={prod.image || "/images/default-food.png"}
                            alt={prod.name}
                            className="object-cover h-full"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>
                        <p className="text-xs text-gray-800 mt-2 line-clamp-2 font-medium">
                          {prod.name}
                        </p>
                        {/* Price and + button on the right */}
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-bold text-gray-800">
                            {prod.price.toFixed(2)} TL
                          </p>
                          <button
                            onClick={() => handleOpenPopupForRecommended(prod)}
                            className="w-6 h-6 bg-white text-blue-600 border border-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Right arrow */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow z-10 hover:bg-gray-100"
                    onClick={() => {
                      const container = document.getElementById(
                        `slider-${venueId}`
                      );
                      if (container) {
                        container.scrollBy({ left: +120, behavior: "smooth" });
                      }
                    }}
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
        </div>
      ))}

      {/* Checkout button */}
      <div className="mt-6">
        <button
          className="w-full px-4 py-3 flex items-center justify-between bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={handleProceedToCheckout}
        >
          <span className="text-sm">Sepete git</span>
          <span className="text-sm">{formattedTotalPrice}</span>
        </button>
      </div>

      {/* Product Popup for recommended items */}
      {popupProduct && (
        <ProductPopup
          product={convertToPopupProduct(popupProduct)}
          onClose={() => setPopupProduct(null)}
          onAddToCart={(payload) => {
            addToCart(userId, payload.id)
              .then(() => refreshCart())
              .catch((error) =>
                console.error("Error adding product from popup:", error)
              );
            setPopupProduct(null);
          }}
        />
      )}

      {/* Extra UI: Çatal & Bıçak Seçimi Toggle */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="fork and knife">
              🍴
            </span>
            <p className="font-semibold text-gray-800">
              Çatal &amp; Bıçak Seçimi
            </p>
          </div>
          <label className="inline-flex items-center cursor-pointer relative">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer-focus:outline-none transition-colors duration-200 peer-checked:bg-red-500 relative">
              <span className="absolute w-4 h-4 bg-white border border-gray-300 rounded-full top-0.5 left-0.5 transition-all peer-checked:translate-x-5"></span>
            </div>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Doğamız sizi seviyor! Çevre duyarlılığınız için teşekkürler.
        </p>
      </div>
    </div>
  );
};

export default OrderCartBasket;
