import logo from "./logo.svg";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg"
import close_icon from "./close_icon.svg"
import users_icon from "./users_icon.svg"
import car_icon from "./car_icon.svg"
import location_icon from "./location_icon.svg"
import fuel_icon from "./fuel_icon.svg"
import addIcon from "./addIcon.svg"
import carIcon from "./carIcon.svg"
import carIconColored from "./carIconColored.svg"
import dashboardIcon from "./dashboardIcon.svg"
import dashboardIconColored from "./dashboardIconColored.svg"
import addIconColored from "./addIconColored.svg"
import listIcon from "./listIcon.svg"
import listIconColored from "./listIconColored.svg"
import cautionIconColored from "./cautionIconColored.svg"
import arrow_icon from "./arrow_icon.svg"
import star_icon from "./star_icon.svg"
import check_icon from "./check_icon.svg"
import tick_icon from "./tick_icon.svg"
import delete_icon from "./delete_icon.svg"
import eye_icon from "./eye_icon.svg"
import eye_close_icon from "./eye_close_icon.svg"
import filter_icon from "./filter_icon.svg"
import edit_icon from "./edit_icon.svg"
import calendar_icon_colored from "./calendar_icon_colored.svg"
import location_icon_colored from "./location_icon_colored.svg"
import testimonial_image_1 from "./testimonial_image_1.png"
import testimonial_image_2 from "./testimonial_image_2.png"
import main_car from "./main_car.png"
import banner_car_image from "./banner_car_image.png"
import user_profile from "./user_profile.png"
import upload_icon from "./upload_icon.svg"
import car_image1 from "./car_image1.png"
import car_image2 from "./car_image2.png"
import car_image3 from "./car_image3.png"
import car_image4 from "./car_image4.png"
import car_porsche from "./car_porsche.jpg"
import car_bmw from "./car_bmw.jpg"
import car_mercedes from "./car_mercedes.jpg"
import car_tesla from "./car_tesla.jpg"
import car_audi from "./car_audi.jpg"
import car_ferrari from "./car_ferrari.jpg"
import gallery_interior from "./gallery_interior.jpg"
import gallery_profile from "./gallery_profile.jpg"
import gallery_rear from "./gallery_rear.jpg"
import gallery_night from "./gallery_night.jpg"

export const cityList = [
  "Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille",
  "Rennes","Reims","Le Havre","Saint-Étienne","Toulon","Grenoble","Dijon","Angers","Nîmes","Villeurbanne",
  "Clermont-Ferrand","Le Mans","Aix-en-Provence","Brest","Tours","Amiens","Limoges","Annecy","Perpignan","Metz"
]

export const assets = {
    logo,
    gmail_logo,
    facebook_logo,
    instagram_logo,
    twitter_logo,
    menu_icon,
    search_icon,
    close_icon,
    users_icon,
    edit_icon,
    car_icon,
    location_icon,
    fuel_icon,
    addIcon,
    carIcon,
    carIconColored,
    dashboardIcon,
    dashboardIconColored,
    addIconColored,
    listIcon,
    listIconColored,
    cautionIconColored,
    calendar_icon_colored,
    location_icon_colored,
    arrow_icon,
    star_icon,
    check_icon,
    tick_icon,
    delete_icon,
    eye_icon,
    eye_close_icon,
    filter_icon,
    testimonial_image_1,
    testimonial_image_2,
    main_car,
    banner_car_image,
    car_image1,
    upload_icon,
    user_profile,
    car_image2,
    car_image3,
    car_image4,
    car_porsche,
    car_bmw,
    car_mercedes,
    car_tesla,
    car_audi,
    car_ferrari,
    gallery_interior,
    gallery_profile,
    gallery_rear,
    gallery_night,
}

export const menuLinks = [
    { name: "Accueil", path: "/" },
    { name: "Voitures", path: "/cars" },
    { name: "Réservations", path: "/my-bookings" },
]

export const ownerMenuLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardIcon, coloredIcon: dashboardIconColored },
    { name: "Add car", path: "/owner/add-car", icon: addIcon, coloredIcon: addIconColored },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: carIcon, coloredIcon: carIconColored },
    { name: "Manage Bookings", path: "/owner/manage-bookings", icon: listIcon, coloredIcon: listIconColored },
]

export const dummyUserData = {
  "_id": "6847f7cab3d8daecdb517095",
  "name": "TheMagician",
  "email": "admin@example.com",
  "role": "owner",
  "image": user_profile,
}

export const dummyCarData = [
    {
        "_id": "67ff5bc069c03d4e45f30b77",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Porsche",
        "model": "911 Carrera",
        "image": car_porsche,
        "year": 2024,
        "category": "Coupé",
        "seating_capacity": 2,
        "fuel_type": "Essence",
        "transmission": "Automatic",
        "pricePerDay": 450,
        "location": "Paris",
        "description": "La Porsche 911 Carrera est l'icône absolue du sport automobile. Performances exceptionnelles, tenue de route légendaire et design intemporel font de cette voiture une expérience unique.",
        "isAvailable": true,
        "createdAt": "2025-04-16T07:26:56.215Z",
    },
    {
        "_id": "67ff6b758f1b3684286a2a65",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "BMW",
        "model": "M5 Competition",
        "image": car_bmw,
        "year": 2024,
        "category": "Berline",
        "seating_capacity": 5,
        "fuel_type": "Essence",
        "transmission": "Automatic",
        "pricePerDay": 380,
        "location": "Lyon",
        "description": "La BMW M5 Competition représente la quintessence de la berline sportive. 625 ch, 0-100 en 3.3s, tout en offrant un confort premium au quotidien.",
        "isAvailable": true,
        "createdAt": "2025-04-16T08:33:57.993Z",
    },
    {
        "_id": "67ff6b9f8f1b3684286a2a68",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Mercedes",
        "model": "GLE Coupé",
        "image": car_mercedes,
        "year": 2024,
        "category": "SUV",
        "seating_capacity": 5,
        "fuel_type": "Hybrid",
        "transmission": "Automatic",
        "pricePerDay": 320,
        "location": "Marseille",
        "description": "Le Mercedes GLE Coupé allie l'élégance d'un coupé aux capacités d'un SUV. Technologies de pointe, habitacle raffiné et motorisation hybride pour une conduite écoresponsable.",
        "isAvailable": true,
        "createdAt": "2025-04-16T08:34:39.592Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e34",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Ferrari",
        "model": "Roma",
        "image": car_ferrari,
        "year": 2023,
        "category": "GT",
        "seating_capacity": 2,
        "fuel_type": "Essence",
        "transmission": "Automatic",
        "pricePerDay": 890,
        "location": "Nice",
        "description": "La Ferrari Roma incarne la dolce vita moderne. Son V8 biturbo de 620 ch, son design fluide et son caractère grand tourisme en font l'une des Ferrari les plus désirables.",
        "isAvailable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    },
    {
        "_id": "ev_tesla_model_s_001",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Tesla",
        "model": "Model S Plaid",
        "image": car_tesla,
        "year": 2024,
        "category": "Berline",
        "seating_capacity": 5,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "pricePerDay": 490,
        "location": "Paris",
        "description": "La Tesla Model S Plaid est la berline de série la plus rapide au monde. 0-100 km/h en 2.1 secondes, jusqu'à 600 km d'autonomie, et recharge ultra-rapide via Supercharger.",
        "isAvailable": true,
        "range_km": 600,
        "charge_time": "20 min (Supercharger)",
        "battery_kwh": 100,
        "createdAt": "2025-01-10T08:00:00.000Z",
    },
    {
        "_id": "ev_bmw_i4_002",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Audi",
        "model": "e-tron GT",
        "image": car_audi,
        "year": 2024,
        "category": "GT",
        "seating_capacity": 4,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "pricePerDay": 420,
        "location": "Bordeaux",
        "description": "L'Audi e-tron GT est la plus sportive des berlines électriques. Design de coupé saisissant, 530 ch en mode boost et 488 km d'autonomie pour une expérience électrique sans compromis.",
        "isAvailable": true,
        "range_km": 488,
        "charge_time": "23 min (DC 270 kW)",
        "battery_kwh": 93.4,
        "createdAt": "2025-01-15T09:00:00.000Z",
    },
    {
        "_id": "ev_renault_megane_003",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Renault",
        "model": "Mégane E-Tech",
        "image": car_image2,
        "year": 2024,
        "category": "Compacte",
        "seating_capacity": 5,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "pricePerDay": 160,
        "location": "Toulouse",
        "description": "La Renault Mégane E-Tech électrique est le nouveau standard de la voiture électrique européenne. Design avant-gardiste, 470 km d'autonomie, confort premium.",
        "isAvailable": true,
        "range_km": 470,
        "charge_time": "25 min (DC 130 kW)",
        "battery_kwh": 60,
        "createdAt": "2025-01-20T10:00:00.000Z",
    }
];

export const dummyMyBookingsData = [
    {
        "_id": "68482bcc98eb9722b7751f70",
        "car": dummyCarData[0],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-13T00:00:00.000Z",
        "returnDate": "2025-06-14T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T12:57:48.244Z",
    },
    {
        "_id": "68482bb598eb9722b7751f60",
        "car": dummyCarData[1],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-12T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 130,
        "createdAt": "2025-06-10T12:57:25.613Z",
    },
    {
        "_id": "684800fa0fb481c5cfd92e56",
        "car": dummyCarData[2],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 600,
        "createdAt": "2025-06-10T09:55:06.379Z",
    },
    {
        "_id": "6847fe790fb481c5cfd92d94",
        "car": dummyCarData[3],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T09:44:25.410Z",
    }
]

export const dummyDashboardData = {
    "totalCars": 4,
    "totalBookings": 2,
    "pendingBookings": 0,
    "completedBookings": 2,
    "recentBookings": [
        dummyMyBookingsData[0],
        dummyMyBookingsData[1]
    ],
    "monthlyRevenue": 840
}
