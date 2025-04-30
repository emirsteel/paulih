import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import OrderFoodFooter from "./OrderFoodFooter";

const heroFoodCards = [
  {
    title: "COME GET IT",
    location: "Hacettepe University",
    image:
      "https://images.pexels.com/photos/6969975/pexels-photo-6969975.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "FAST FOOD",
    location: "Meet Fine Dining",
    image:
      "https://images.pexels.com/photos/327158/pexels-photo-327158.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "CRAVEABLE",
    location: "Hacettepe University",
    image:
      "https://images.pexels.com/photos/8254061/pexels-photo-8254061.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "TASTE TESTED",
    location: "The Best Burgers",
    image:
      "https://images.pexels.com/photos/30527717/pexels-photo-30527717/free-photo-of-gida-fotografciligi.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const designedToSatisfyFoodCards = [
  {
    title: "SANDWICHES",
    image:
      "https://images.pexels.com/photos/30461847/pexels-photo-30461847/free-photo-of-rustik-tahta-uzerinde-lezzetli-italyan-sandvicleri.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "VEGGIES",
    image:
      "https://images.pexels.com/photos/1400171/pexels-photo-1400171.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "SALAD",
    image:
      "https://images.pexels.com/photos/3323687/pexels-photo-3323687.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const OrderHome: React.FC = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section - First Image Section */}
      <section className="relative w-full px-12 mt-6 overflow-hidden">
        <div className="flex justify-center space-x-8 -ml-[12%] -mr-[12%]">
          {heroFoodCards.map((item, index) => (
            <div
              key={index}
              className={`relative w-[420px] h-[550px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-6 text-white">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Centered Order Button */}
      <div className="flex justify-center mt-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition duration-200">
          ORDER NOW
        </button>
      </div>

      {/* Stay in the Loop Section */}
      <section className="bg-blue-50 py-6 px-10 mt-8 text-center rounded-lg mx-auto max-w-3xl">
        <h3 className="text-xl font-bold text-gray-900">STAY IN THE LOOP</h3>
        <p className="text-gray-700 text-sm">
          Sign up to be the first to know about the new menu drop, special
          deals, and more.
        </p>
        <div className="mt-4 flex justify-center">
          <input
            type="email"
            placeholder="Your email here...."
            className="px-4 py-3 rounded-l-full border focus:ring-orange-400 outline-none w-64 placeholder-gray-500"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-r-full">
            →
          </button>
        </div>
      </section>

      {/* New Drop - Chicken Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto mt-16 px-8">
        {/* Left: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            New drop just in—now featuring chicken! Don't miss out!
          </h2>
          <p className="text-gray-700 mt-3">
            Our latest addition is here to spice up your menu with delicious,
            mouth-watering chicken options. Whether you're craving something
            crispy, grilled, or saucy, we've got you covered.
          </p>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition duration-200">
            GIMME!
          </button>
        </div>

        {/* Right: Image */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <img
            src="https://c4.wallpaperflare.com/wallpaper/768/217/159/lemon-food-chicken-baked-wallpaper-preview.jpg"
            alt="New Chicken Drop"
            className="w-full max-w-md"
          />
        </div>
      </section>

      {/* Black Section - "DESIGNED TO SATISFY" */}
      <section className="bg-gray-50 text-black text-center py-12 mt-16">
        <h2 className="text-3xl font-bold">DESIGNED TO SATISFY</h2>
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition duration-200">
          VIEW FULL MENU
        </button>
      </section>

      {/* Second Section - Designed to Satisfy Carousel */}
      <section className="bg-white text-black py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-left mb-6">
            DESIGNED TO SATISFY
          </h2>

          {/* Image Carousel */}
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button className="absolute left-0 bg-white text-black p-2 rounded-full shadow-md">
              <FiChevronLeft size={24} />
            </button>

            {/* Food Images */}
            <div className="flex overflow-hidden space-x-6 mx-8">
              {designedToSatisfyFoodCards.map((item, index) => (
                <div
                  key={index}
                  className="relative w-[320px] h-[400px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-6 text-white">
                    <h2 className="text-lg font-bold">{item.title}</h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button className="absolute right-0 bg-white text-black p-2 rounded-full shadow-md">
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* What's the Secret Section */}
      <section className="bg-blue-50 py-12 px-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
          {/* Left: Image */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Secret Recipe"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>

          {/* Right: Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              WHAT’S THE SECRET?
            </h2>
            <p className="text-gray-700 mt-3">
              Our dishes are crafted with the perfect blend of fresh ingredients
              and bold flavors. Every bite is a burst of taste, carefully
              designed to keep you coming back for more. Discover what makes our
              meals truly unforgettable!
            </p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-700 transition duration-200">
              GIMME!
            </button>
          </div>
        </div>
      </section>

      {/* Check Us Out Section */}
      <section className="bg-gray-50 text-black py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
          {/* Left: Text & Icon */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <span className="text-blue-600 text-6xl">✱</span>{" "}
              {/* Star Icon */}
            </div>
            <h2 className="text-3xl font-bold mt-4">CHECK US OUT</h2>
            <p className="text-gray-600 mt-3">
              Find us at 23th & Park AVE South
              <br />
              New York City
            </p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition duration-200">
              GIMME!
            </button>
          </div>

          {/* Right: Image */}
          <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <img
              src="https://images.pexels.com/photos/1850595/pexels-photo-1850595.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Dining Experience"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* How to Fuzzleplate Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Title and Icon */}
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              HOW TO FUZZLEPLATE
            </h2>
          </div>

          <div className="flex justify-start mt-4">
            <span className="text-blue-600 text-6xl">✱</span> {/* Star Icon */}
          </div>

          {/* Steps Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Order Here"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white border-2 border-blue-600 text-blue-600 font-bold w-8 h-8 flex items-center justify-center rounded-full text-lg">
                  1
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">Order Here</h3>
                <p className="text-gray-600 text-sm">
                  And we will give you an estimated pick up time. We strive for
                  precision.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Head to Hacettepe University"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white border-2 border-blue-600 text-blue-600 font-bold w-8 h-8 flex items-center justify-center rounded-full text-lg">
                  2
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">
                  Head to Hacettepe University
                </h3>
                <p className="text-gray-600 text-sm">
                  Don’t forget your phone, you will need it to pick up your
                  meal.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/600x400"
                  alt="Pick up and go!"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white border-2 border-blue-600 text-blue-600 font-bold w-8 h-8 flex items-center justify-center rounded-full text-lg">
                  3
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">Pick up and go!</h3>
                <p className="text-gray-600 text-sm">
                  Don’t forget your phone, you will need it to pick up your
                  meal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Meals Quick Section */}
      <section className="bg-orange-50 py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left: Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              QUALITY MEALS QUICK
            </h2>
            <p className="text-gray-700 mt-3">
              We believe great food shouldn't mean a long wait. That's why we
              deliver delicious, high-quality meals, prepared fresh and served
              fast. Whether you're on the go or relaxing at home, you can enjoy
              flavorful dishes without the hassle. Fast food, but better!
            </p>
            <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition duration-200">
              READ MORE
            </button>
          </div>

          {/* Right: Image */}
          <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Quality Meals Quick"
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Get Fuzzleplate Delivered Section */}
      <section className="bg-black text-white py-16 px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left: Image */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://via.placeholder.com/600x400"
              alt="Fuzzleplate Delivered"
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>

          {/* Right: Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
            <h2 className="text-3xl font-bold leading-tight">
              GET FUZZLEPLATE DELIVERED TO YOUR DOOR!
            </h2>
            <p className="text-gray-300 mt-3">
              Don’t have time to pick up your favorite fuzzleplate meal? Why not
              get it delivered?
            </p>
            <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition duration-200">
              GET IT DELIVERED BY UBER EATS
            </button>
          </div>
        </div>
      </section>

      {/* Perks of the PAC Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            PERKS OF THE PAC
          </h2>
          <p className="text-gray-600 mt-3">
            Insiders get advantages and free food{" "}
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              sign up and you get some really great stuff
            </span>{" "}
            or even download the FUZZLEPLATE app.
          </p>
          <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition duration-200">
            DOWNLOAD APP
          </button>
        </div>

        {/* Right: Illustration Image */}
        <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Perks of the PAC"
            className="w-full max-w-lg"
          />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative bg-orange-500 text-white pt-24 pb-16 px-8 mt-16">
        <OrderFoodFooter />
      </footer>
    </div>
  );
};

export default OrderHome;
