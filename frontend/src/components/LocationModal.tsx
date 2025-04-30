import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import {
  FiX,
  FiMapPin,
  FiBook,
  FiBriefcase,
  FiCoffee,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

const getLocationIcon = (location: string) => {
  const lowerLocation = location.toLowerCase();

  // Match for coffee places
  if (
    // Keywords for coffee places
    lowerLocation.includes("cafe") ||
    lowerLocation.includes("kahve") || // Turkish for coffee
    lowerLocation.includes("coffee") ||
    lowerLocation.includes("çay evi") || // Turkish for tea house
    lowerLocation.includes("kahvehane") || // Turkish for coffeehouse
    lowerLocation.includes("çaycı") || // Turkish for tea seller
    lowerLocation.includes("çay bahçesi") || // Turkish for tea garden
    lowerLocation.includes("espresso") ||
    lowerLocation.includes("latte") ||
    lowerLocation.includes("macchiato") ||
    lowerLocation.includes("americano") ||
    lowerLocation.includes("mocha") ||
    lowerLocation.includes("kafe") || // Turkish for cafe
    lowerLocation.includes("brewery") || // Specialty coffee shops
    lowerLocation.includes("patisserie") || // For bakeries that also serve coffee
    lowerLocation.includes("pastane") || // Turkish for patisserie
    lowerLocation.includes("roastery") || // Coffee roasters
    lowerLocation.includes("barista") || // Barista-related cafes
  
    // Global coffee brands
    lowerLocation.includes("starbucks") ||
    lowerLocation.includes("gloria jean's") ||
    lowerLocation.includes("nero") || // Caffè Nero
    lowerLocation.includes("caribou") || // Caribou Coffee
    lowerLocation.includes("coffee bean") || // Coffee Bean & Tea Leaf
    lowerLocation.includes("peet's coffee") || // Peet's Coffee
    lowerLocation.includes("blue bottle") || // Blue Bottle Coffee
    lowerLocation.includes("tim hortons") || // Tim Hortons
    lowerLocation.includes("lavazza") || // Lavazza
    lowerLocation.includes("illy") || // Illy Coffee
    lowerLocation.includes("second cup") || // Second Cup Coffee
    lowerLocation.includes("pret a manger") || // Pret A Manger
  
    // Local Turkish coffee brands
    lowerLocation.includes("coffy") || 
    lowerLocation.includes("gönül kahvesi") || 
    lowerLocation.includes("kahve dünyası") || 
    lowerLocation.includes("mado") || // Turkish dessert and coffee chain
    lowerLocation.includes("cihanseray kahvesi") || // Hypothetical Turkish coffee chain
    lowerLocation.includes("hacıbaba kahvesi") || // Hypothetical Turkish coffee chain
    lowerLocation.includes("osmanlı kahvesi") || // Turkish Ottoman Coffee
    lowerLocation.includes("dibek kahvesi") || // Turkish mortar coffee
    lowerLocation.includes("menengiç kahvesi") || // Traditional Turkish coffee
    lowerLocation.includes("saray kahvesi") // Palace coffee in Turkey
  ) {
    return <FiCoffee size={20} />;
  }
  

  // Match for restaurants
  if (
    // Keywords for restaurants
    lowerLocation.includes("restaurant") ||
    lowerLocation.includes("lokanta") || // Turkish for restaurant
    lowerLocation.includes("dining") ||
    lowerLocation.includes("eatery") ||
    lowerLocation.includes("bistro") ||
    lowerLocation.includes("brasserie") ||
    lowerLocation.includes("fast food") ||
    lowerLocation.includes("fine dining") ||
    lowerLocation.includes("buffet") ||
    lowerLocation.includes("steakhouse") ||
    lowerLocation.includes("grill") ||
    lowerLocation.includes("barbecue") ||
    lowerLocation.includes("bbq") ||
    lowerLocation.includes("pizzeria") ||
    lowerLocation.includes("tavern") ||
    lowerLocation.includes("meze") || // Turkish for small dishes/appetizers
    lowerLocation.includes("fırın") || // Turkish for bakery
    lowerLocation.includes("kebap") || // Turkish for kebab
    lowerLocation.includes("ocakbaşı") || // Turkish grill restaurant
    lowerLocation.includes("kumpir") || // Turkish stuffed baked potato places
    lowerLocation.includes("lahmacun") || // Turkish flatbread/pizza
    lowerLocation.includes("döner") || // Turkish döner kebab
    lowerLocation.includes("köfteci") || // Turkish meatball restaurant
    lowerLocation.includes("tantuni") || // Turkish wrap
    lowerLocation.includes("çiğ köfte") || // Turkish raw meatball dish
  
    // Global restaurant brands
    lowerLocation.includes("burger king") ||
    lowerLocation.includes("mcdonald's") ||
    lowerLocation.includes("subway") ||
    lowerLocation.includes("kfc") || // Kentucky Fried Chicken
    lowerLocation.includes("domino's") ||
    lowerLocation.includes("pizza hut") ||
    lowerLocation.includes("taco bell") ||
    lowerLocation.includes("wendy's") ||
    lowerLocation.includes("shake shack") ||
    lowerLocation.includes("five guys") ||
    lowerLocation.includes("hard rock") || // Hard Rock Cafe
    lowerLocation.includes("cheesecake factory") ||
    lowerLocation.includes("outback steakhouse") ||
    lowerLocation.includes("olive garden") ||
    lowerLocation.includes("panda express") ||
    lowerLocation.includes("nando's") || // Global peri-peri chicken chain
  
    // Local Turkish restaurant brands
    lowerLocation.includes("cihanseray") || // Hypothetical Turkish brand
    lowerLocation.includes("simit sarayı") || // Turkish bakery and restaurant chain
    lowerLocation.includes("kebapçı") || // Turkish kebab places
    lowerLocation.includes("köfteci yusuf") || // Popular Turkish meatball chain
    lowerLocation.includes("hd iskender") || // Turkish döner/kebab chain
    lowerLocation.includes("çiğ köfteci osman usta") || // Hypothetical Turkish brand
    lowerLocation.includes("sultanahmet köftecisi") || // Famous Turkish meatball restaurant
    lowerLocation.includes("baydöner") || // Turkish döner chain
    lowerLocation.includes("hacıbaba") || // Turkish local chain
    lowerLocation.includes("tavuk dünyası") || // Turkish chicken restaurant chain
    lowerLocation.includes("özsut") || // Turkish dessert and dining chain
    lowerLocation.includes("nusret") || // Nusr-Et (Salt Bae's restaurant chain)
    lowerLocation.includes("günaydın") || // Turkish steakhouse chain
    lowerLocation.includes("hatay medeniyetler sofrası") || // Hatay cuisine chain
    lowerLocation.includes("kasap döner") || // Turkish döner chain
    lowerLocation.includes("çarşıbaşı pide") || // Hypothetical Turkish pizzeria
    lowerLocation.includes("doy doy") || // Turkish local eatery
    lowerLocation.includes("çiçek ızgara") || // Hypothetical Turkish grill brand
    lowerLocation.includes("saray lokantası") || // Palace-themed Turkish restaurant
    lowerLocation.includes("turta evi") || // Hypothetical pie house
    lowerLocation.includes("bolu dağ lokantası") // Turkish roadside eatery
  ) {
    return <FaUtensils size={20} />;
  }
  


// Match for universities, colleges, and educational institutions
if (
  // Keywords for universities and colleges
  lowerLocation.includes("university") ||
  lowerLocation.includes("universite") || // Turkish for university
  lowerLocation.includes("campus") ||
  lowerLocation.includes("college") ||
  lowerLocation.includes("institute") ||
  lowerLocation.includes("academy") ||
  lowerLocation.includes("faculty") ||
  lowerLocation.includes("technical university") ||
  lowerLocation.includes("polytechnic") ||
  lowerLocation.includes("school of") ||
  lowerLocation.includes("high school") || // Include high schools if needed
  lowerLocation.includes("vocational school") ||
  lowerLocation.includes("higher education") ||

  // Famous global universities
  lowerLocation.includes("harvard") ||
  lowerLocation.includes("mit") || // Massachusetts Institute of Technology
  lowerLocation.includes("stanford") ||
  lowerLocation.includes("oxford") ||
  lowerLocation.includes("cambridge") ||
  lowerLocation.includes("princeton") ||
  lowerLocation.includes("yale") ||
  lowerLocation.includes("ucl") || // University College London
  lowerLocation.includes("berkeley") || // UC Berkeley
  lowerLocation.includes("columbia university") ||
  lowerLocation.includes("nyu") || // New York University
  lowerLocation.includes("caltech") || // California Institute of Technology

  // Famous Turkish universities
  lowerLocation.includes("hacettepe üniversitesi") ||
  lowerLocation.includes("istanbul üniversitesi") ||
  lowerLocation.includes("ankara üniversitesi") ||
  lowerLocation.includes("boğaziçi üniversitesi") ||
  lowerLocation.includes("odtü") || // Middle East Technical University
  lowerLocation.includes("itu") || // Istanbul Technical University
  lowerLocation.includes("ege üniversitesi") ||
  lowerLocation.includes("izmir yüksek teknoloji enstitüsü") || // Izmir Institute of Technology
  lowerLocation.includes("sabancı üniversitesi") ||
  lowerLocation.includes("koç üniversitesi") ||
  lowerLocation.includes("bilkent üniversitesi") ||
  lowerLocation.includes("galatasaray üniversitesi") ||
  lowerLocation.includes("yıldız teknik üniversitesi") || // Yildiz Technical University
  lowerLocation.includes("fırat üniversitesi") ||
  lowerLocation.includes("çukurova üniversitesi") ||

  // Hypothetical or generic educational institutions
  lowerLocation.includes("open university") ||
  lowerLocation.includes("distance learning") ||
  lowerLocation.includes("online university") ||
  lowerLocation.includes("research institute") ||
  lowerLocation.includes("arts academy") ||
  lowerLocation.includes("business school")
) {
  return <FiBook size={20} />;
}


// Match for homes, residences, and housing
if (
  // General residential terms
  lowerLocation.includes("home") ||
  lowerLocation.includes("house") ||
  lowerLocation.includes("residence") ||
  lowerLocation.includes("housing") ||
  lowerLocation.includes("living space") ||
  lowerLocation.includes("dormitory") ||
  lowerLocation.includes("hostel") ||
  lowerLocation.includes("accommodation") ||
  lowerLocation.includes("lodging") ||
  lowerLocation.includes("habitat") ||
  lowerLocation.includes("dwelling") ||

  // Types of housing
  lowerLocation.includes("apartment") ||
  lowerLocation.includes("flat") || // British term for apartment
  lowerLocation.includes("villa") ||
  lowerLocation.includes("condo") || // Condominium
  lowerLocation.includes("penthouse") ||
  lowerLocation.includes("duplex") ||
  lowerLocation.includes("loft") ||
  lowerLocation.includes("bungalow") ||
  lowerLocation.includes("cottage") ||
  lowerLocation.includes("mansion") ||
  lowerLocation.includes("farmhouse") ||
  lowerLocation.includes("ranch") ||
  lowerLocation.includes("studio") ||
  lowerLocation.includes("townhouse") ||
  lowerLocation.includes("row house") ||
  lowerLocation.includes("mobile home") ||

  // Turkish terms for housing
  lowerLocation.includes("ev") || // Turkish for house/home
  lowerLocation.includes("rezidans") || // Turkish for residence
  lowerLocation.includes("apartman") || // Turkish for apartment
  lowerLocation.includes("daire") || // Turkish for flat/apartment
  lowerLocation.includes("konak") || // Turkish for mansion
  lowerLocation.includes("köşk") || // Turkish for villa or manor
  lowerLocation.includes("yalı") || // Turkish for waterside mansion
  lowerLocation.includes("çiftlik evi") || // Turkish for farmhouse
  lowerLocation.includes("gecekondu") || // Turkish for shanty house
  lowerLocation.includes("yazlık") || // Turkish for summer house
  lowerLocation.includes("kiralık ev") || // Turkish for rental house
  lowerLocation.includes("sitede daire") || // Turkish for apartment in a complex
  lowerLocation.includes("apart") || // Turkish short for apartment

  // Other residential keywords
  lowerLocation.includes("shelter") ||
  lowerLocation.includes("refuge") ||
  lowerLocation.includes("temporary housing") ||
  lowerLocation.includes("long-term rental") ||
  lowerLocation.includes("short-term rental")
) {
  return <FiHome size={20} />;
}


// Match for shopping centers, stores, and malls
if (
  // General shopping-related terms
  lowerLocation.includes("mall") ||
  lowerLocation.includes("shopping") ||
  lowerLocation.includes("store") ||
  lowerLocation.includes("market") ||
  lowerLocation.includes("supermarket") ||
  lowerLocation.includes("plaza") ||
  lowerLocation.includes("retail") ||
  lowerLocation.includes("department store") ||
  lowerLocation.includes("hypermarket") ||
  lowerLocation.includes("shopping district") ||
  lowerLocation.includes("shopping arcade") ||
  lowerLocation.includes("emporium") ||
  lowerLocation.includes("bazaar") || // Common in Middle Eastern regions
  lowerLocation.includes("outlet") ||
  lowerLocation.includes("wholesale") ||
  lowerLocation.includes("flea market") ||
  lowerLocation.includes("night market") ||

  // Specific types of stores
  lowerLocation.includes("boutique") ||
  lowerLocation.includes("fashion store") ||
  lowerLocation.includes("electronics store") ||
  lowerLocation.includes("bookstore") ||
  lowerLocation.includes("toy store") ||
  lowerLocation.includes("furniture store") ||
  lowerLocation.includes("jewelry store") ||
  lowerLocation.includes("clothing store") ||
  lowerLocation.includes("discount store") ||
  lowerLocation.includes("luxury store") ||

  // Global shopping mall chains
  lowerLocation.includes("westfield") || // Westfield Malls
  lowerLocation.includes("galleria") ||
  lowerLocation.includes("the grove") ||
  lowerLocation.includes("simon mall") ||
  lowerLocation.includes("rodeo drive") || // Luxury shopping street in the US
  lowerLocation.includes("mall of america") ||
  lowerLocation.includes("avenues") || // Avenues Mall
  lowerLocation.includes("dubai mall") || // Famous mall in Dubai

  // Global supermarket chains
  lowerLocation.includes("walmart") ||
  lowerLocation.includes("carrefour") ||
  lowerLocation.includes("tesco") ||
  lowerLocation.includes("aldi") ||
  lowerLocation.includes("lidl") ||
  lowerLocation.includes("costco") ||
  lowerLocation.includes("target") ||
  lowerLocation.includes("kroger") ||

  // Turkish shopping malls and stores
  lowerLocation.includes("avm") || // Turkish abbreviation for shopping mall
  lowerLocation.includes("migros") || // Turkish supermarket chain
  lowerLocation.includes("bim") || // Turkish discount supermarket chain
  lowerLocation.includes("a101") || // Turkish discount supermarket chain
  lowerLocation.includes("şok") || // Turkish discount supermarket chain
  lowerLocation.includes("carrefoursa") || // Carrefour's Turkish brand
  lowerLocation.includes("istiklal caddesi") || // Popular shopping street in Istanbul
  lowerLocation.includes("cevahir") || // Cevahir Mall, Istanbul
  lowerLocation.includes("akmerkez") || // Akmerkez Mall, Istanbul
  lowerLocation.includes("zorlu center") || // Zorlu Center, Istanbul
  lowerLocation.includes("mall of istanbul") ||
  lowerLocation.includes("forum bornova") || // Forum Bornova, Izmir
  lowerLocation.includes("forum istanbul") ||
  lowerLocation.includes("emaar square mall") ||
  lowerLocation.includes("panora") || // Panora Mall, Ankara
  lowerLocation.includes("armada") || // Armada Mall, Ankara
  lowerLocation.includes("kentpark") || // Kentpark Mall, Ankara
  lowerLocation.includes("optimum") || // Optimum malls in Turkey
  lowerLocation.includes("212 outlet") || // 212 Outlet Mall, Istanbul
  lowerLocation.includes("palladium") || // Palladium Mall, Istanbul
  lowerLocation.includes("viaport") || // Viaport Outlet Mall, Istanbul
  lowerLocation.includes("kipa") || // Turkish supermarket chain
  lowerLocation.includes("koçtaş") || // Turkish home improvement store

  // Other shopping-related terms
  lowerLocation.includes("antique shop") ||
  lowerLocation.includes("pawn shop") ||
  lowerLocation.includes("gift shop") ||
  lowerLocation.includes("souvenir shop") ||
  lowerLocation.includes("thrift store") ||
  lowerLocation.includes("secondhand shop") ||
  lowerLocation.includes("factory outlet")
) {
  return <FiShoppingCart size={20} />;
}


// Match for offices and workplaces
if (
  // General office-related terms
  lowerLocation.includes("office") ||
  lowerLocation.includes("business") ||
  lowerLocation.includes("workspace") ||
  lowerLocation.includes("company") ||
  lowerLocation.includes("corporate") ||
  lowerLocation.includes("building") ||
  lowerLocation.includes("headquarters") ||
  lowerLocation.includes("hq") ||
  lowerLocation.includes("workplace") ||
  lowerLocation.includes("firm") ||
  lowerLocation.includes("enterprise") ||
  lowerLocation.includes("organization") ||
  lowerLocation.includes("branch") ||
  lowerLocation.includes("subsidiary") ||
  lowerLocation.includes("agency") ||
  lowerLocation.includes("consultancy") ||
  lowerLocation.includes("co-working") ||
  lowerLocation.includes("start-up") ||
  lowerLocation.includes("shared office") ||

  // Specific office-related locations
  lowerLocation.includes("skyscraper") ||
  lowerLocation.includes("tower") ||
  lowerLocation.includes("industrial park") ||
  lowerLocation.includes("business park") ||
  lowerLocation.includes("tech park") ||
  lowerLocation.includes("innovation center") ||
  lowerLocation.includes("research center") ||
  lowerLocation.includes("hub") ||

  // English terms for office spaces
  lowerLocation.includes("service center") ||
  lowerLocation.includes("call center") ||
  lowerLocation.includes("contact center") ||
  lowerLocation.includes("office complex") ||
  lowerLocation.includes("commercial space") ||
  lowerLocation.includes("business center") ||

  // Turkish terms for offices and workplaces
  lowerLocation.includes("ofis") || // Turkish for office
  lowerLocation.includes("şirket") || // Turkish for company
  lowerLocation.includes("iş yeri") || // Turkish for workplace
  lowerLocation.includes("merkez") || // Turkish for center/headquarters
  lowerLocation.includes("kurum") || // Turkish for institution/organization
  lowerLocation.includes("ajans") || // Turkish for agency
  lowerLocation.includes("müşavirlik") || // Turkish for consultancy
  lowerLocation.includes("iş merkezi") || // Turkish for business center
  lowerLocation.includes("ticaret merkezi") || // Turkish for trade center
  lowerLocation.includes("iş kuleleri") || // Turkish for business towers
  lowerLocation.includes("teknopark") || // Turkish for tech park
  lowerLocation.includes("sanayi sitesi") || // Turkish for industrial site
  lowerLocation.includes("plaza") || // Turkish for plaza
  lowerLocation.includes("paylaşımlı ofis") || // Turkish for shared office
  lowerLocation.includes("kobi") || // Turkish for SME (Small and Medium Enterprises)
  lowerLocation.includes("ar-ge merkezi") || // Turkish for R&D center

  // Other workplace-related terms
  lowerLocation.includes("factory") ||
  lowerLocation.includes("plant") ||
  lowerLocation.includes("industrial site") ||
  lowerLocation.includes("manufacturing unit") ||
  lowerLocation.includes("production center") ||
  lowerLocation.includes("warehouse") ||
  lowerLocation.includes("logistics center") ||
  lowerLocation.includes("supply chain") ||
  lowerLocation.includes("distribution center")
) {
  return <FiBriefcase size={20} />;
}


// Match for parks and recreational areas
if (
  // General terms for parks and recreation
  lowerLocation.includes("park") ||
  lowerLocation.includes("recreation") ||
  lowerLocation.includes("garden") ||
  lowerLocation.includes("playground") ||
  lowerLocation.includes("nature reserve") ||
  lowerLocation.includes("national park") ||
  lowerLocation.includes("state park") ||
  lowerLocation.includes("city park") ||
  lowerLocation.includes("urban park") ||
  lowerLocation.includes("public park") ||
  lowerLocation.includes("picnic area") ||
  lowerLocation.includes("amusement park") ||
  lowerLocation.includes("theme park") ||
  lowerLocation.includes("adventure park") ||
  lowerLocation.includes("wildlife park") ||
  lowerLocation.includes("zoo") ||
  lowerLocation.includes("botanical garden") ||
  lowerLocation.includes("arboretum") ||
  lowerLocation.includes("flower park") ||
  lowerLocation.includes("fountain") ||
  lowerLocation.includes("trail") ||
  lowerLocation.includes("hiking area") ||
  lowerLocation.includes("forest preserve") ||
  lowerLocation.includes("green space") ||
  lowerLocation.includes("reserve") ||
  lowerLocation.includes("lake") ||
  lowerLocation.includes("riverfront") ||
  lowerLocation.includes("waterfront") ||
  lowerLocation.includes("beach park") ||
  lowerLocation.includes("campground") ||

  // Specific recreational facilities
  lowerLocation.includes("tennis court") ||
  lowerLocation.includes("basketball court") ||
  lowerLocation.includes("soccer field") ||
  lowerLocation.includes("skatepark") ||
  lowerLocation.includes("sports complex") ||
  lowerLocation.includes("recreation center") ||
  lowerLocation.includes("athletic field") ||
  lowerLocation.includes("fitness trail") ||
  lowerLocation.includes("outdoor gym") ||

  // Famous parks globally
  lowerLocation.includes("central park") || // New York
  lowerLocation.includes("hyde park") || // London
  lowerLocation.includes("golden gate park") || // San Francisco
  lowerLocation.includes("disneyland") || // Disneyland parks worldwide
  lowerLocation.includes("yosemite") || // Yosemite National Park
  lowerLocation.includes("grand canyon") || // Grand Canyon National Park
  lowerLocation.includes("serengeti") || // Serengeti National Park

  // Famous Turkish parks and recreational areas
  lowerLocation.includes("gülhane parkı") || // Gülhane Park, Istanbul
  lowerLocation.includes("gezi parkı") || // Gezi Park, Istanbul
  lowerLocation.includes("belgrad ormanı") || // Belgrad Forest, Istanbul
  lowerLocation.includes("ataturk arboretumu") || // Atatürk Arboretum, Istanbul
  lowerLocation.includes("emirgan korusu") || // Emirgan Grove, Istanbul
  lowerLocation.includes("kordon boyu") || // Kordon waterfront area, Izmir
  lowerLocation.includes("izmir fuar alanı") || // Izmir Fair Area
  lowerLocation.includes("mavişehir sahil") || // Mavişehir Coastline, Izmir
  lowerLocation.includes("çamlık parkı") || // Hypothetical Turkish park
  lowerLocation.includes("dikili plajı") || // Dikili Beach
  lowerLocation.includes("saklı cennet") || // Hidden Paradise, Turkish recreation area
  lowerLocation.includes("bozdağ kayak merkezi") || // Bozdağ Ski Resort
  lowerLocation.includes("kazdağları") || // Mount Ida National Park
  lowerLocation.includes("çamlıca tepesi") || // Çamlıca Hill, Istanbul

  // Other outdoor recreational terms
  lowerLocation.includes("picnic spot") ||
  lowerLocation.includes("viewpoint") ||
  lowerLocation.includes("observation deck") ||
  lowerLocation.includes("scenic overlook") ||
  lowerLocation.includes("nature walk") ||
  lowerLocation.includes("camp site") ||
  lowerLocation.includes("glamping site")
) {
  return <FiUsers size={20} />;
}


// Match for hospitals, clinics, and healthcare facilities
if (
  // General terms for healthcare facilities
  lowerLocation.includes("hospital") ||
  lowerLocation.includes("clinic") ||
  lowerLocation.includes("medical") ||
  lowerLocation.includes("health") ||
  lowerLocation.includes("pharmacy") ||
  lowerLocation.includes("doctor's office") ||
  lowerLocation.includes("emergency room") ||
  lowerLocation.includes("urgent care") ||
  lowerLocation.includes("health center") ||
  lowerLocation.includes("outpatient") ||
  lowerLocation.includes("rehabilitation center") ||
  lowerLocation.includes("nursing home") ||
  lowerLocation.includes("healthcare facility") ||
  lowerLocation.includes("wellness center") ||
  lowerLocation.includes("primary care") ||
  lowerLocation.includes("specialist clinic") ||
  lowerLocation.includes("surgical center") ||

  // Types of clinics and healthcare services
  lowerLocation.includes("dental clinic") ||
  lowerLocation.includes("eye clinic") ||
  lowerLocation.includes("orthopedic clinic") ||
  lowerLocation.includes("pediatric clinic") ||
  lowerLocation.includes("cardiology center") ||
  lowerLocation.includes("cancer center") ||
  lowerLocation.includes("maternity hospital") ||
  lowerLocation.includes("fertility clinic") ||
  lowerLocation.includes("mental health clinic") ||
  lowerLocation.includes("psychiatric hospital") ||
  lowerLocation.includes("imaging center") ||
  lowerLocation.includes("radiology center") ||
  lowerLocation.includes("dialysis center") ||
  lowerLocation.includes("dermatology clinic") ||

  // Pharmacy-related terms
  lowerLocation.includes("drugstore") ||
  lowerLocation.includes("chemist") || // British term for pharmacy
  lowerLocation.includes("apothecary") ||
  lowerLocation.includes("medicine shop") ||

  // Global healthcare institutions
  lowerLocation.includes("mayo clinic") || // USA
  lowerLocation.includes("cleveland clinic") || // USA
  lowerLocation.includes("johns hopkins hospital") || // USA
  lowerLocation.includes("mass general") || // Massachusetts General Hospital, USA
  lowerLocation.includes("mount sinai") || // USA
  lowerLocation.includes("apollo hospitals") || // India
  lowerLocation.includes("fortis healthcare") || // India
  lowerLocation.includes("charité hospital") || // Germany
  lowerLocation.includes("singapore general hospital") || // Singapore
  lowerLocation.includes("st mary's hospital") || // London
  lowerLocation.includes("toronto general hospital") || // Canada
  lowerLocation.includes("bupa") || // International healthcare provider

  // Turkish healthcare institutions
  lowerLocation.includes("acıbadem") || // Acıbadem Healthcare Group
  lowerLocation.includes("medicana") || // Medicana Health Group
  lowerLocation.includes("memorial") || // Memorial Hospitals
  lowerLocation.includes("anadolu sağlık") || // Anadolu Medical Center
  lowerLocation.includes("florence nightingale") || // Florence Nightingale Hospitals
  lowerLocation.includes("başkent hastanesi") || // Başkent University Hospital
  lowerLocation.includes("hastane") || // Turkish for hospital
  lowerLocation.includes("sağlık merkezi") || // Turkish for health center
  lowerLocation.includes("tıp merkezi") || // Turkish for medical center
  lowerLocation.includes("eczane") || // Turkish for pharmacy
  lowerLocation.includes("özel hastane") || // Turkish for private hospital
  lowerLocation.includes("devlet hastanesi") || // Turkish for state hospital
  lowerLocation.includes("şehir hastanesi") || // Turkish for city hospital
  lowerLocation.includes("diş hastanesi") || // Turkish for dental hospital
  lowerLocation.includes("psikiyatri hastanesi") || // Turkish for psychiatric hospital

  // Other healthcare-related terms
  lowerLocation.includes("vaccination center") ||
  lowerLocation.includes("covid testing site") ||
  lowerLocation.includes("medical research center") ||
  lowerLocation.includes("blood bank") ||
  lowerLocation.includes("organ transplant center") ||
  lowerLocation.includes("therapy center") ||
  lowerLocation.includes("hospice care") ||
  lowerLocation.includes("public health office") ||
  lowerLocation.includes("physiotherapy clinic")
) {
  return <FiHeart size={20} />;
}


// Match for transportation hubs (airports, bus stations, etc.)
if (
  // General transportation hub terms
  lowerLocation.includes("airport") ||
  lowerLocation.includes("airfield") ||
  lowerLocation.includes("airstrip") ||
  lowerLocation.includes("aerodrome") ||
  lowerLocation.includes("station") ||
  lowerLocation.includes("bus station") ||
  lowerLocation.includes("bus stop") ||
  lowerLocation.includes("train station") ||
  lowerLocation.includes("subway") ||
  lowerLocation.includes("metro") ||
  lowerLocation.includes("railway station") ||
  lowerLocation.includes("light rail") ||
  lowerLocation.includes("tram stop") ||
  lowerLocation.includes("terminal") ||
  lowerLocation.includes("transit center") ||
  lowerLocation.includes("interchange") ||
  lowerLocation.includes("transport hub") ||
  lowerLocation.includes("parking lot") ||
  lowerLocation.includes("car park") ||

  // Terms for seaports and water transport
  lowerLocation.includes("port") ||
  lowerLocation.includes("harbor") ||
  lowerLocation.includes("pier") ||
  lowerLocation.includes("dock") ||
  lowerLocation.includes("marina") ||
  lowerLocation.includes("ferry terminal") ||
  lowerLocation.includes("cruise terminal") ||
  lowerLocation.includes("boat station") ||

  // Air transportation keywords
  lowerLocation.includes("helipad") ||
  lowerLocation.includes("heliport") ||
  lowerLocation.includes("cargo terminal") ||
  lowerLocation.includes("control tower") ||
  lowerLocation.includes("runway") ||

  // Global transportation hubs
  lowerLocation.includes("heathrow") || // London Heathrow Airport
  lowerLocation.includes("jfk") || // John F. Kennedy Airport
  lowerLocation.includes("schiphol") || // Amsterdam Airport Schiphol
  lowerLocation.includes("narita") || // Narita International Airport, Japan
  lowerLocation.includes("charles de gaulle") || // Paris
  lowerLocation.includes("dubai international") || // Dubai
  lowerLocation.includes("changi") || // Singapore Changi Airport
  lowerLocation.includes("lax") || // Los Angeles International Airport
  lowerLocation.includes("beijing capital") || // Beijing
  lowerLocation.includes("union station") || // Various train stations globally
  lowerLocation.includes("grand central") || // New York Grand Central
  lowerLocation.includes("gare du nord") || // Paris train station
  lowerLocation.includes("waterloo") || // London train station

  // Turkish transportation hubs
  lowerLocation.includes("istanbul havalimanı") || // Istanbul Airport
  lowerLocation.includes("sabiha gökçen") || // Sabiha Gökçen Airport
  lowerLocation.includes("eskişehir otogar") || // Eskişehir Bus Terminal
  lowerLocation.includes("otogar") || // Generic term for Turkish bus stations
  lowerLocation.includes("otobüs terminali") || // Turkish for bus terminal
  lowerLocation.includes("izmir adnan menderes havalimanı") || // Izmir Adnan Menderes Airport
  lowerLocation.includes("ankara esenboğa havalimanı") || // Ankara Esenboğa Airport
  lowerLocation.includes("tramvay durağı") || // Turkish for tram stop
  lowerLocation.includes("metro durağı") || // Turkish for metro stop
  lowerLocation.includes("tren garı") || // Turkish for train station
  lowerLocation.includes("liman") || // Turkish for port
  lowerLocation.includes("iskelesi") || // Turkish for pier
  lowerLocation.includes("feribot terminali") || // Turkish for ferry terminal
  lowerLocation.includes("havaalanı") || // Turkish for airport
  lowerLocation.includes("şehirlerarası otogar") || // Intercity bus station
  lowerLocation.includes("deniz otobüsü") || // Turkish for sea bus terminal
  lowerLocation.includes("ulaşım merkezi") || // Turkish for transportation hub

  // Miscellaneous transportation-related terms
  lowerLocation.includes("cargo hub") ||
  lowerLocation.includes("freight terminal") ||
  lowerLocation.includes("logistics center") ||
  lowerLocation.includes("aviation center") ||
  lowerLocation.includes("bus depot") ||
  lowerLocation.includes("shuttle stop") ||
  lowerLocation.includes("expressway interchange") ||
  lowerLocation.includes("train depot") ||
  lowerLocation.includes("high-speed rail station") ||
  lowerLocation.includes("electric vehicle charging station")
) {
  return <FiTruck size={20} />;
}


// Match for retail outlets and shops
if (
  // General retail terms
  lowerLocation.includes("shop") ||
  lowerLocation.includes("store") ||
  lowerLocation.includes("outlet") ||
  lowerLocation.includes("retail") ||
  lowerLocation.includes("marketplace") ||
  lowerLocation.includes("trading post") ||
  lowerLocation.includes("commercial space") ||
  lowerLocation.includes("boutique") ||
  lowerLocation.includes("emporium") ||
  lowerLocation.includes("bazaar") || // Common in Middle Eastern regions
  lowerLocation.includes("mall shop") ||
  lowerLocation.includes("convenience store") ||
  lowerLocation.includes("corner store") ||
  lowerLocation.includes("superstore") ||
  lowerLocation.includes("flagship store") ||
  lowerLocation.includes("specialty store") ||
  lowerLocation.includes("chain store") ||
  lowerLocation.includes("department store") ||

  // Types of shops
  lowerLocation.includes("clothing shop") ||
  lowerLocation.includes("fashion store") ||
  lowerLocation.includes("electronics shop") ||
  lowerLocation.includes("furniture store") ||
  lowerLocation.includes("grocery store") ||
  lowerLocation.includes("toy shop") ||
  lowerLocation.includes("gift shop") ||
  lowerLocation.includes("souvenir shop") ||
  lowerLocation.includes("bookstore") ||
  lowerLocation.includes("pharmacy") || // Overlap with healthcare section
  lowerLocation.includes("hardware store") ||
  lowerLocation.includes("sports shop") ||
  lowerLocation.includes("pet shop") ||
  lowerLocation.includes("antique shop") ||
  lowerLocation.includes("thrift store") ||
  lowerLocation.includes("secondhand shop") ||
  lowerLocation.includes("factory outlet") ||

  // Global retail chains
  lowerLocation.includes("walmart") ||
  lowerLocation.includes("carrefour") ||
  lowerLocation.includes("tesco") ||
  lowerLocation.includes("aldi") ||
  lowerLocation.includes("lidl") ||
  lowerLocation.includes("costco") ||
  lowerLocation.includes("target") ||
  lowerLocation.includes("ikea") ||
  lowerLocation.includes("best buy") ||
  lowerLocation.includes("sephora") ||
  lowerLocation.includes("zara") ||
  lowerLocation.includes("h&m") ||
  lowerLocation.includes("uniqlo") ||
  lowerLocation.includes("primark") ||
  lowerLocation.includes("gap") ||
  lowerLocation.includes("nike store") ||
  lowerLocation.includes("adidas store") ||
  lowerLocation.includes("apple store") ||
  lowerLocation.includes("samsung store") ||

  // Turkish retail outlets and shops
  lowerLocation.includes("migros") || // Turkish supermarket chain
  lowerLocation.includes("bim") || // Turkish discount supermarket chain
  lowerLocation.includes("a101") || // Turkish discount supermarket chain
  lowerLocation.includes("şok") || // Turkish discount supermarket chain
  lowerLocation.includes("koçtaş") || // Turkish home improvement store
  lowerLocation.includes("kipa") || // Turkish supermarket
  lowerLocation.includes("etek city") || // Hypothetical Turkish retail
  lowerLocation.includes("boyner") || // Turkish department store chain
  lowerLocation.includes("decathlon") || // Sports store in Turkey
  lowerLocation.includes("lc waikiki") || // Turkish clothing store
  lowerLocation.includes("defacto") || // Turkish clothing brand
  lowerLocation.includes("penti") || // Turkish retail chain for lingerie and accessories
  lowerLocation.includes("madame coco") || // Turkish home decor chain
  lowerLocation.includes("english home") || // Turkish home decor chain
  lowerLocation.includes("türk hava kurumu shop") || // Hypothetical Turkish retail
  lowerLocation.includes("teknosa") || // Turkish electronics chain
  lowerLocation.includes("vatan bilgisayar") || // Turkish electronics store

  // Other retail-related keywords
  lowerLocation.includes("artisan shop") ||
  lowerLocation.includes("handicraft shop") ||
  lowerLocation.includes("luxury shop") ||
  lowerLocation.includes("high-end shop") ||
  lowerLocation.includes("local shop") ||
  lowerLocation.includes("family-owned shop") ||
  lowerLocation.includes("pop-up shop") ||
  lowerLocation.includes("street vendor") ||
  lowerLocation.includes("kiosk") ||
  lowerLocation.includes("mini market")
) {
  return <FiShoppingBag size={20} />;
}


  // Default icon for other types of locations
  return <FiMapPin size={20} />;
};

// Custom marker icon for Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle map resizing and fitting
const MapAdjuster: React.FC<{ position: LatLngExpression }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize(); // Fix white spaces
    map.setView(position, 13, { animate: true }); // Ensure smooth movement
  }, [position, map]);

  return null;
};

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [userCoordinates, setUserCoordinates] = useState<LatLngExpression | null>(null);

  // Fetch user's current location
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!navigator.geolocation) {
        setUserLocation("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates([latitude, longitude]); // Store as LatLngExpression

          try {
            // Fetch readable address
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const address = response.data.display_name;
            setUserLocation(address || "Location not available");
          } catch (error) {
            console.error("Error fetching user location:", error);
            setUserLocation("Unable to fetch location");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation("Unable to access location");
        }
      );
    };

    fetchUserLocation();
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=5`;

      if (userCoordinates) {
        const [lat, lon] = userCoordinates as [number, number];
        url += `&viewbox=${lon - 0.1},${lat + 0.1},${lon + 0.1},${lat - 0.1}&bounded=1`;
      }

      const response = await axios.get(url);
      const locations = response.data.map((item: any) => item.display_name);
      setSearchResults(locations);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content w-full max-w-md mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
      overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Select Location</h2>
          <button
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
            onClick={onClose}
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="mt-4">
          {/* Display user's current location */}
          <div className="bg-gray-100 p-3 rounded-lg text-gray-700 text-sm mb-4">
            <strong>Detected Location:</strong>{" "}
            {userLocation ? (
              userLocation
            ) : (
              <span className="text-gray-500">Detecting...</span>
            )}
          </div>
          <input
            type="text"
            placeholder="Search any location..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div className="mt-4 max-h-60 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : searchQuery.trim() && searchResults.length > 0 ? (
            searchResults.map((location, index) => (
              <button
                key={index}
                className="flex items-center w-full text-left p-3 rounded-lg hover:bg-blue-100 transition duration-200"
                onClick={() => {
                  onSelectLocation(location);
                  onClose();
                }}
              >
                <span
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-200 rounded-full mr-3 text-blue-700"
                  style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
                >
                  {getLocationIcon(location)}
                </span>
                <span className="flex-grow text-sm font-medium text-gray-700">
                  {location}
                </span>
                <span className="text-xs text-blue-500 ml-3">Select</span>
              </button>
            ))
          ) : searchQuery.trim() ? (
            <p className="text-gray-500 text-center">No results found</p>
          ) : (
            <p className="text-sm font-bold text-gray-600 text-center">
              Start typing to search for locations
            </p>
          )}
        </div>

        {/* Map Display */}
        <div className="mt-4">
          {userCoordinates ? (
            <div
              style={{
                height: "250px",
                width: "100%",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <MapContainer
                center={userCoordinates}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={userCoordinates}
                  icon={customIcon}
                >
                  <Popup>Your Location</Popup>
                </Marker>
                <MapAdjuster position={userCoordinates} />
              </MapContainer>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading map...</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;
