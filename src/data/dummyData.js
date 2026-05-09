// Dummy seed data for products
export const dummyProducts = [
  {
    name: "Eternal Oud",
    slug: "eternal-oud",
    description: "A rich and mysterious oud fragrance that captures the essence of luxury.",
    price: 299,
    discountPrice: 249,
    category: "Oud Collection",
    brand: "Scentora",
    stock: 50,
    rating: 4.8,
    gender: "unisex",
    images: [
      { url: "https://via.placeholder.com/300x400?text=Eternal+Oud", public_id: "oud1" }
    ],
    fragranceNotes: {
      top: ["Cardamom", "Bergamot"],
      middle: ["Oud", "Sandalwood"],
      base: ["Musk", "Amber"]
    }
  },
  {
    name: "Blossom Paradise",
    slug: "blossom-paradise",
    description: "A delicate floral fragrance with hints of rose and jasmine.",
    price: 199,
    discountPrice: 169,
    category: "Floral Collection",
    brand: "Scentora",
    stock: 75,
    rating: 4.6,
    gender: "female",
    images: [
      { url: "https://via.placeholder.com/300x400?text=Blossom", public_id: "floral1" }
    ],
    fragranceNotes: {
      top: ["Freesia", "Grapefruit"],
      middle: ["Rose", "Jasmine"],
      base: ["Vanilla", "Musk"]
    }
  },
  {
    name: "Arabian Nights",
    slug: "arabian-nights",
    description: "An exotic blend inspired by ancient Arabian traditions.",
    price: 279,
    discountPrice: 229,
    category: "Arabian Collection",
    brand: "Scentora",
    stock: 40,
    rating: 4.9,
    gender: "unisex",
    images: [
      { url: "https://via.placeholder.com/300x400?text=Arabian", public_id: "arabian1" }
    ],
    fragranceNotes: {
      top: ["Saffron", "Cinnamon"],
      middle: ["Oud", "Rose"],
      base: ["Frankincense", "Musk"]
    }
  },
  {
    name: "Midnight Essence",
    slug: "midnight-essence",
    description: "A bold and captivating fragrance for the modern man.",
    price: 249,
    discountPrice: null,
    category: "Male Collection",
    brand: "Scentora",
    stock: 60,
    rating: 4.7,
    gender: "male",
    images: [
      { url: "https://via.placeholder.com/300x400?text=Midnight", public_id: "male1" }
    ],
    fragranceNotes: {
      top: ["Ginger", "Black Pepper"],
      middle: ["Leather", "Vetiver"],
      base: ["Patchouli", "Oud"]
    }
  },
]

export const dummyCategories = [
  {
    name: "Oud Collection",
    slug: "oud-collection",
    description: "Premium oud fragrances for the discerning connoisseur"
  },
  {
    name: "Floral Collection",
    slug: "floral-collection",
    description: "Delicate and elegant floral fragrances"
  },
  {
    name: "Arabian Collection",
    slug: "arabian-collection",
    description: "Exotic fragrances inspired by Arabian traditions"
  },
  {
    name: "Male Collection",
    slug: "male-collection",
    description: "Sophisticated fragrances for men"
  },
]
