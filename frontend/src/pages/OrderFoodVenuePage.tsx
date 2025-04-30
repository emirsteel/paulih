import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import MainHeader from "../components/MainHeader";
import SubHeader from "../components/SubHeader";
import PromotionalBanners from "../components/PromotionalBanners";
import OrderFoodVenueInfo from "../components/OrderFoodVenueInfo";
import OrderFoodVenueMenu from "../components/OrderFoodVenueMenu";
import OrderFoodProductList from "../components/OrderFoodProductList";
import OrderCartBasket from "../components/OrderCartBasket";
import {
  fetchVenueById,
  fetchProductsByVenue,
  addToCart,
} from "../services/api";
import { AuthUserContext } from "../context/AuthUserContext";
import OrderFoodVenueFooter from "../components/OrderFoodVenueMoreInformation";

interface Venue {
  _id: string;
  name: string;
  category: string;
  description: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  rating: number;
  phone: string;
  email: string;
  photos: string[];
  logo: string;
  deliveryTime: string;
  minimumPayment: string;
  discount: string;
  deliveryBy: string;
  paymentMethod: string[];
  menu: string[];
  likedBy?: string[];
  activeDays: {
    day: string;
    open: string;
    close: string;
  }[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  choiceExtracted: string[];
  extraSideChoice: { name: string; price: number }[];
  sauces: { [key: string]: string[] };
  promotions: string[];
  glutenFree: boolean;
  topRatedRank?: number;
}

const OrderFoodVenuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthUserContext);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartKey, setCartKey] = useState(0); // For refreshing the cart
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!id) return;
    // 1) Fetch venue
    fetchVenueById(id)
      .then((data) => {
        setVenue(data);
        // 2) Then fetch products for this venue
        return fetchProductsByVenue(id);
      })
      .then((fetchedProducts) => {
        // Map each product to a new shape
        const productsWithCategory = fetchedProducts.map((product: any) => ({
          ...product,
          id: product._id, // rename _id -> id
          category: product.category || "Uncategorized",
          firstSauceChoice: product.firstSauceChoice || [],
          secondSauceChoice: product.secondSauceChoice || [],
          sauces: product.sauces
            ? product.sauces.reduce(
                (acc: { [key: string]: string[] }, sauce: { name: string }) => {
                  const [group, sauceName] = sauce.name.split(":");
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(sauceName);
                  return acc;
                },
                {}
              )
            : {},
          glutenFree: product.glutenFree ?? false,
          topRatedRank: product.topRatedRank,
        }));
        console.log("Fetched products:", productsWithCategory);
        setProducts(productsWithCategory);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  const handleMenuClick = (category: string) => {
    if (sectionRefs.current[category]) {
      sectionRefs.current[category]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Add product to cart
  const handleAddToCart = (payload: {
    id: string;
    selectedLavash?: string;
    isExtraTavukDonerSelected?: boolean;
  }) => {
    if (!user?._id) {
      alert("You must be logged in to add products to your cart.");
      return;
    }
    addToCart(user._id, payload.id)
      .then(() => {
        console.log(`Product ${payload.id} added to cart`);
        setCartKey((prevKey) => prevKey + 1);
      })
      .catch((error) => console.error("Error adding product to cart:", error));
  };

  if (!venue) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading venue details...</p>
      </div>
    );
  }

  // Derive unique categories
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <div>
      <MainHeader
        venues={[]}
        onSelectVenue={(venueId) =>
          console.log(`Selected venue ID: ${venueId}`)
        }
      />
      <SubHeader
        breadcrumb={`Home / Food / ${venue.name}`}
        categories={[]}
        selectedCategory={venue.name}
        onSelectCategory={() => navigate("/order/food")}
      />

      {/* Main Layout */}
      <div className="flex flex-col">
        {/* Venue Info */}
        <OrderFoodVenueInfo venue={venue} />

        {/* Promotional Banners */}
        <PromotionalBanners selectedCategory={venue.name} />

        {/* Menu Categories */}
        <OrderFoodVenueMenu menu={venue.menu} onMenuClick={handleMenuClick} />

        {/* Main Content Area: Two Columns for Products and Basket */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Products Section */}
          <div className="flex-grow px-8">
            {categories.map((category) => (
              <div
                key={category}
                ref={(el) => (sectionRefs.current[category] = el)}
                className="mt-6"
              >
                <h2 className="text-lg font-bold mb-4 flex items-center">
                  {/* If category is 'Popüler', display a star icon */}
                  {category === "Popüler" && (
                    <FaCrown className="text-yellow-500 w-5 h-5 mr-2" />
                  )}
                  {category}
                </h2>
                <OrderFoodProductList
                  products={products.filter(
                    (product) => product.category === category
                  )}
                  onSelectProduct={(id) =>
                    console.log(`Selected product ID: ${id}`)
                  }
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>

          {/* Basket Section */}
          <div className="w-full lg:w-1/3">
            <div
              className="sticky flex justify-center items-center"
              style={{
                top: "200px",
                marginTop: "20px",
              }}
            >
              {/* Refresh key each time user adds to cart */}
              <OrderCartBasket userId={user?._id || ""} key={cartKey} />
            </div>
          </div>
        </div>

        {/* Venue Footer */}
        <OrderFoodVenueFooter venue={venue} />
      </div>
    </div>
  );
};

export default OrderFoodVenuePage;
