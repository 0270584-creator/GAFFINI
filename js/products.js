/*
 * Gaffini product catalogue.
 * Edit names, prices and copy here. When real product photos are ready,
 * add `image: "assets/img/your-photo.jpg"` to a colourway and it will be
 * used instead of the drawn illustration.
 * `badge` is optional (e.g. "New", "Limited edition").
 */
const STORE = {
  currency: "USD",   // e.g. "MXN", "EUR"
  locale: "en-US",   // e.g. "es-MX"
};

const PRODUCTS = [
  {
    id: "amalfi",
    badge: "New",
    name: "Amalfi",
    shape: "round",
    price: 640,
    tagline: "Round · Handcrafted acetate",
    description: "A softly rounded silhouette with a keyhole bridge, inspired by mid-century coastal summers.",
    colorways: [
      { name: "Tortoise / Brown", frame: "#5a3418", lens: ["#3a2412", "#8a5a2c"] },
      { name: "Black / Grey", frame: "#111", lens: ["#1b1d20", "#4a4f55"] },
      { name: "Honey / Green", frame: "#b07a3a", lens: ["#1f2b1d", "#55684a"] },
    ],
  },
  {
    id: "portofino",
    name: "Portofino",
    shape: "square",
    price: 690,
    tagline: "Square · Thick-cut acetate",
    description: "Bold, architectural lines softened by hand-bevelled edges. Our signature frame.",
    colorways: [
      { name: "Black / Grey", frame: "#0e0e0e", lens: ["#16181b", "#3f444a"] },
      { name: "Havana / Brown", frame: "#4b2a14", lens: ["#2c1a0c", "#7a4d24"] },
    ],
  },
  {
    id: "riviera",
    badge: "Limited edition",
    name: "Riviera",
    shape: "aviator",
    price: 720,
    tagline: "Aviator · Titanium & gold finish",
    description: "A lightweight titanium aviator with a double bridge, finished in brushed gold.",
    colorways: [
      { name: "Gold / Green", frame: "#b8954f", lens: ["#1e2a1c", "#4f6446"] },
      { name: "Gold / Gradient brown", frame: "#c2a15e", lens: ["#3a2412", "#c49a6c"] },
      { name: "Silver / Blue", frame: "#a9adb2", lens: ["#14202e", "#4a6584"] },
    ],
  },
  {
    id: "capri",
    name: "Capri",
    shape: "cateye",
    price: 660,
    tagline: "Cat-eye · Hand-polished acetate",
    description: "An elegant upswept cat-eye with a sharp outer line and a gentle lower curve.",
    colorways: [
      { name: "Black / Grey", frame: "#0d0d0d", lens: ["#17191c", "#4a4f55"] },
      { name: "Ivory / Brown", frame: "#e8dcc4", lens: ["#3a2412", "#8a5a2c"] },
      { name: "Bordeaux / Rose", frame: "#5c1a24", lens: ["#3a1a1e", "#a0646c"] },
    ],
  },
  {
    id: "siena",
    name: "Siena",
    shape: "round",
    price: 610,
    tagline: "Round · Slim acetate",
    description: "A refined panto shape with slender rims — understated, worn every day.",
    colorways: [
      { name: "Crystal / Grey", frame: "#cfc9bd", lens: ["#1b1d20", "#5a5f66"] },
      { name: "Olive / Green", frame: "#4e5133", lens: ["#1f2b1d", "#55684a"] },
    ],
  },
  {
    id: "verona",
    name: "Verona",
    shape: "square",
    price: 650,
    tagline: "Square · Oversized",
    description: "A generous oversized square with a high bridge and confident temples.",
    colorways: [
      { name: "Tortoise / Green", frame: "#5a3418", lens: ["#1e2a1c", "#4f6446"] },
      { name: "Black / Brown", frame: "#0e0e0e", lens: ["#2c1a0c", "#7a4d24"] },
    ],
  },
];
