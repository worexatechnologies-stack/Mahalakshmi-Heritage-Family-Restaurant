/**
 * Mahalakshmi Spice Heritage - Special Sunday Event Configuration
 * 
 * You can update all texts, timings, highlights, and packages here anytime.
 */

export const sundayEvent = {
  active: true,
  name: "The Grand Sunday Heritage Feast & Live Music Gala",
  shortName: "Grand Sunday Feast",
  badge: "EXCLUSIVE ONE-DAY RESTAURANT EVENT",
  dateFormatted: "This Sunday, November 29, 2026",
  targetDateISO: "2026-11-29T12:00:00+05:30",
  venue: "Mahalakshmi Spice Heritage, Main Highway Road",
  heroSubtitle:
    "Join us this Sunday for an unforgettable royal culinary experience featuring live clay tandoor counters, authentic chef specialities, acoustic melodies, and royal garden dining for the whole family.",
  perk: "Complimentary Chef's Special Welcome Platter for all pre-booked tables",
  urgencyNotice: "Only 25 prime tables available per session • Pre-booking recommended",
  
  sessions: [
    {
      id: "lunch",
      name: "Grand Lunch Gala",
      time: "12:00 PM – 04:00 PM",
      tag: "Family Feast & Live Starters",
      desc: "Lavish family feast with smoking-hot tandoori starters served straight to your table, royal biryanis, and traditional desserts."
    },
    {
      id: "dinner",
      name: "Candlelight Dinner Under the Stars",
      time: "07:00 PM – 11:00 PM",
      tag: "Live Music & Romantic Ambiance",
      desc: "Dine under warm fairy lights and illuminated palm cabanas with soulful acoustic melodies and live charcoal barbecue."
    }
  ],

  highlights: [
    {
      id: 1,
      title: "Live Clay Tandoor & Charcoal BBQ",
      description: "Watch our master chefs roast marinated chicken tangdi, mutton kebabs, and stuffed paneer over glowing tandoori embers.",
      badge: "Live Kitchen",
      icon: "Flame",
      image: "/dishes/tandoori-murgh-roast.jpg"
    },
    {
      id: 2,
      title: "The Grand Royal Feast Spread",
      description: "An authentic multi-course celebration: fragrant dum biryanis, creamy dal makhani, rich butter chicken, and fresh tandoori breads.",
      badge: "Chef's Special",
      icon: "Utensils",
      image: "/dishes/grand-assorted-platter.jpg"
    },
    {
      id: 3,
      title: "Acoustic Melodies & Garden Cabanas",
      description: "Soothing live acoustic and instrumental music creating a serene, unforgettable dining experience under the evening stars.",
      badge: "Atmosphere",
      icon: "Music",
      image: "/image7.webp"
    },
    {
      id: 4,
      title: "Family Treats & Royal Desserts",
      description: "Special welcome royal mocktails on arrival, dedicated family booths, and an indulgent dessert counter with hot gulab jamun and rabdi.",
      badge: "Hospitality",
      icon: "Award",
      image: "/dishes/paneer-tikka-stuffed.jpg"
    }
  ],

  schedule: [
    {
      time: "12:00 PM – 04:00 PM",
      title: "The Sunday Royal Lunch Gala",
      tag: "Afternoon Session",
      items: [
        "Chilled Royal Kesari Welcome Drink on arrival",
        "Unlimited live tandoori starters & sizzling platters",
        "Grand main course feast: Andhra specials, royal gravies & aromatic biryanis",
        "Chef's traditional dessert tasting counter"
      ]
    },
    {
      time: "04:30 PM – 06:30 PM",
      title: "Sundowner Hi-Tea & Charcoal Bites",
      tag: "Sunset Session",
      items: [
        "Artisanal masala chai and royal coffee service",
        "Crispy wok starters: Crispy chicken chilly & spiced corn bites",
        "Garden cabana relaxation with ambient lounge melodies"
      ]
    },
    {
      time: "07:00 PM – 11:00 PM",
      title: "Starlight Dinner & Live Music Night",
      tag: "Evening Gala",
      items: [
        "Candlelight garden dining under illuminated palm trees",
        "Live acoustic music and gentle ghazal instrumentals",
        "Chef's exclusive charcoal barbecue specialities",
        "Midnight royal desserts & family celebration moments"
      ]
    }
  ],

  tableTiers: [
    {
      id: "family",
      name: "Family Celebration Table",
      capacity: "4 to 6 Guests",
      badge: "Most Popular",
      features: [
        "Reserved comfortable family dining booth",
        "Complimentary Chef's Welcome Platter",
        "Priority service from dedicated captain",
        "Kids special mocktails & desserts included"
      ],
      ctaText: "Reserve Family Table"
    },
    {
      id: "cabana",
      name: "Exclusive Garden Cabana",
      capacity: "2 to 4 Guests",
      badge: "Romantic & Cozy",
      features: [
        "Private thatched-roof cabana gazebo",
        "Romantic candlelight table arrangement",
        "Acoustic music seating with garden view",
        "Complimentary royal dessert pairing"
      ],
      ctaText: "Reserve Garden Cabana"
    },
    {
      id: "banquet",
      name: "Grand Banquet Group Feast",
      capacity: "8 to 20+ Guests",
      badge: "Groups & Parties",
      features: [
        "Spacious AC hall or combined garden terrace",
        "Customized multi-course family style feast",
        "Dedicated celebration setup (Cake cutting & music)",
        "Flat 15% group discount on total bill"
      ],
      ctaText: "Reserve Group Banquet"
    }
  ],

  stats: [
    { value: "40+", label: "Authentic Delicacies" },
    { value: "Live", label: "Clay Tandoor Stations" },
    { value: "2", label: "Exclusive Gala Sessions" },
    { value: "25", label: "Tables Reserved Limit" }
  ]
};
