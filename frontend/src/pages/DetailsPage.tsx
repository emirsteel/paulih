import React from "react";
import ItemDetails from "../components/ItemDetails";

const DetailsPage: React.FC = () => {
  const item = {
    name: "Pasta House",
    image: "pasta.jpg",
    details: "Authentic Italian pasta with fresh ingredients.",
  };

  return <ItemDetails item={item} />;
};

export default DetailsPage;
