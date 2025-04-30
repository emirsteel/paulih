import React from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  photos?: string[];
}

interface CartItem {
  productId: Product;
  quantity: number;
}

interface OrderFoodCartPreviewOrderSummaryProps {
  cart: { products: CartItem[] } | null;
}

const OrderFoodCartPreviewOrderSummary: React.FC<
  OrderFoodCartPreviewOrderSummaryProps
> = ({ cart }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-5">
      {/* Header with Button on the Right */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Seçili Ürünler</h2>
        <button className="text-amber-500 text-sm font-medium hover:underline">
          Daha çok ürün ekle
        </button>
      </div>

      {/* Product List */}
      {cart?.products?.length > 0 ? (
        <ul className="space-y-4">
          {cart.products.map((item) => (
            <li
              key={item.productId?._id}
              className="flex justify-between items-center"
            >
              {/* Left: Product Image & Name */}
              <div className="flex items-center">
                {/* Product Image */}
                <img
                  src={
                    item.productId?.image
                      ? item.productId.image
                      : item.productId?.photos?.length
                        ? item.productId.photos[0]
                        : "https://via.placeholder.com/60"
                  }
                  alt={item.productId?.name || "Product Image"}
                  className="w-16 h-16 rounded-md object-cover mr-3"
                />

                {/* Product Name & Price */}
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">
                    {item.productId?.name}
                  </span>
                  <span className="text-blue-500 text-sm font-medium">
                    €{(item.productId?.price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right: Quantity Box */}
              <div className="border border-amber-500 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                {item.quantity}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Sepetiniz boş.</p>
      )}
    </div>
  );
};

export default OrderFoodCartPreviewOrderSummary;
