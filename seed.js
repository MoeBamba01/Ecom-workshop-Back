// Remplit la base avec des produits + 2 comptes de test : npm run seed
// Ne supprime rien : relancer le script met juste les produits à jour.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db.js");
const Product = require("./models/Product.js");
const User = require("./models/User.js");

// Photos Unsplash (libres de droits), recadrées en carré
const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;

const products = [
  { name: "T-shirt blanc", description: "T-shirt 100% coton bio, coupe droite, col rond renforcé.", price: 19.99, category: "Vêtements", stock: 50, image: img("1521572163474-6864f9cf17ab") },
  { name: "Jean brut", description: "Denim bleu brut, coupe slim, légèrement stretch.", price: 49.9, category: "Vêtements", stock: 30, image: img("1542272604-787c3835535d") },
  { name: "Sweat à capuche", description: "Molleton épais gris chiné, poche kangourou.", price: 39.9, category: "Vêtements", stock: 25, image: img("1556821840-3a63f95609a7") },
  { name: "Baskets camel", description: "Cuir nubuck camel, semelle blanche confortable.", price: 89.0, category: "Chaussures", stock: 4, image: img("1549298916-b41d501d3772") },
  { name: "Casque audio", description: "Bluetooth, réduction de bruit active, 30 h d'autonomie.", price: 89.0, category: "Tech", stock: 15, image: img("1505740420928-5e560c06d30e") },
  { name: "Souris sans fil", description: "Ergonomique, silencieuse, connexion 2.4 GHz.", price: 24.5, category: "Tech", stock: 40, image: img("1527864550417-7fd91fc51a46") },
  { name: "Clavier sans fil", description: "Clavier fin en aluminium, rechargeable en USB-C.", price: 59.9, category: "Tech", stock: 12, image: img("1587829741301-dc798b83add3") },
  { name: "Enceinte portable", description: "Étanche IPX7, son 360°, 12 h d'autonomie.", price: 45.0, category: "Tech", stock: 0, image: img("1608043152269-423dbba4e7e1") },
  { name: "Mug céramique", description: "Mug blanc 350 ml, passe au lave-vaisselle.", price: 9.99, category: "Maison", stock: 100, image: img("1514228742587-6b1558fcca3d") },
  { name: "Lampe de bureau", description: "Lampe en métal gris, bras orientable, LED incluse.", price: 34.9, category: "Maison", stock: 20, image: img("1507473885765-e6ed057f782c") },
  { name: "Plante en pot", description: "Monstera 40 cm livrée avec son pot blanc.", price: 27.5, category: "Maison", stock: 3, image: img("1614594975525-e45190c55d0b") },
  { name: "Sac à dos", description: "20 L, toile bleu marine, compartiment ordinateur 15\".", price: 54.0, category: "Accessoires", stock: 22, image: img("1553062407-98eeb64c6a62") },
];

const users = [
  { name: "Admin", email: "admin@shop.com", password: "admin123", isAdmin: true },
  { name: "Client", email: "client@shop.com", password: "client123", isAdmin: false },
];

async function seed() {
  await connectDB();

  // upsert = met à jour le produit s'il existe (même nom), sinon le crée
  for (const product of products) {
    await Product.updateOne({ name: product.name }, { $set: product }, { upsert: true });
  }
  console.log(`🌱 ${products.length} produits insérés / mis à jour`);

  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (exists) {
      console.log(`👤 ${user.email} existe déjà`);
    } else {
      // create() déclenche le pre("save") → mot de passe hashé
      await User.create(user);
      console.log(`👤 ${user.email} créé (mot de passe : ${user.password})`);
    }
  }

  await mongoose.disconnect();
}

seed();
