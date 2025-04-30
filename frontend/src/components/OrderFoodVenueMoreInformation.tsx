import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import OrderFoodVenueInfoMorePopup from "./OrderFoodVenueInfoMorePopup";

interface Venue {
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  category: string;
  activeDays: {
    day: string;
    open: string;
    close: string;
  }[];
}

const OrderFoodVenueFooter: React.FC<{ venue: Venue }> = ({ venue }) => {
  const [similarVenues, setSimilarVenues] = useState<Venue[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: venue.location.longitude,
    latitude: venue.location.latitude,
    zoom: 14,
    width: "100%",
    height: "100%",
  });

  useEffect(() => {
    // Fetch 3 similar venues from the same category
    const fetchSimilarVenues = async () => {
      try {
        const response = await fetch(
          `/api/venues?category=${venue.category}&limit=3`
        );
        const data = await response.json();
        setSimilarVenues(data);
      } catch (error) {
        console.error("Error fetching similar venues:", error);
      }
    };

    fetchSimilarVenues();
  }, [venue.category]);

  return (
    <div className="w-full bg-white shadow-md rounded-t-2xl mt-12">
      <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-800 border-t border-gray-300">
        {/* About Venue */}
        <div className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">Hakkında {venue.name}</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {venue.description}
          </p>
        </div>

        {/* Address Section */}
        <div className="md:col-span-1 border-l border-gray-300 pl-6">
          <h3 className="text-lg font-semibold mb-2">Adres</h3>
          <p className="text-sm text-gray-600">
            {venue.location.address}, {venue.location.city}
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowMore(true);
            }}
            className="text-blue-600 text-sm hover:underline mt-2 block"
          >
            Haritayı Gör
          </a>
        </div>

        {/* Delivery Times */}
        <div className="md:col-span-1 border-l border-gray-300 pl-6">
          <h3 className="text-lg font-semibold mb-2">Teslimat Saatleri</h3>
          <ul className="text-sm text-gray-600">
            {venue.activeDays && venue.activeDays.length > 0 ? (
              venue.activeDays.map((day, index) => (
                <li key={index}>
                  {day.day}: {day.open} – {day.close}
                </li>
              ))
            ) : (
              <li>Bilgi yok</li>
            )}
          </ul>
        </div>

        {/* More Information */}
        <div className="md:col-span-1 border-l border-gray-300 pl-6">
          <h3 className="text-lg font-semibold mb-2">Daha Fazla Bilgi</h3>
          <a
            href={`tel:${venue.phone}`}
            className="text-blue-600 text-sm hover:underline"
          >
            {venue.phone}
          </a>
          <br />
          <span className="text-blue-600 text-sm">{venue.email}</span>
          <p className="text-sm text-gray-500 mt-2">
            Fiyatlara KDV dahildir (ek kargo ücreti hariç).
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-72 bg-gray-200 rounded-b-2xl relative">
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken="pk.eyJ1IjoicGF1bGloIiwiYSI6ImNtNnRjbjlibDAxeWQyanNnbGpnazAwbzAifQ.b5EiudBGiXOuZdAE6ZxxBA"
          onMove={(evt) =>
            setViewport((prev) => ({ ...prev, ...evt.viewState }))
          }
        >
          <Marker
            latitude={venue.location.latitude}
            longitude={venue.location.longitude}
          >
            <div className="bg-blue-600 rounded-full w-4 h-4" />
          </Marker>
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <NavigationControl />
          </div>
        </ReactMapGL>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Mapbox_logo_2019.svg"
          alt="Mapbox"
          className="absolute bottom-2 right-2 w-12 h-auto z-30"
        />

        <OrderFoodVenueInfoMorePopup
          isOpen={showMore}
          onClose={() => setShowMore(false)}
          venueData={{
            name: venue.name,
            phone: venue.phone,
            email: venue.email,
            address: venue.location.address,
            schedule: [
              { day: "Monday", hours: "Closed" },
              { day: "Tuesday", hours: "11:45–22:00" },
              { day: "Wednesday", hours: "11:45–22:00" },
              { day: "Thursday", hours: "11:45–22:00" },
              { day: "Friday", hours: "11:45–22:00" },
              { day: "Saturday", hours: "11:45–22:00" },
              { day: "Sunday", hours: "11:45–22:00" },
            ],
            latitude: venue.location.latitude,
            longitude: venue.location.longitude,
          }}
        />
      </div>
    </div>
  );
};

export default OrderFoodVenueFooter;
