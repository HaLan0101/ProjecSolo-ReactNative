require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
    try {
      const { totalPrice } = req.body;
      if (!totalPrice) {
        return res.status(400).json({ message: "Votre panier est vide" });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "EUR",
        payment_method_types: ["card"],
        metadata: {
          merchantDisplayName: "Yaya", 
          totalPrice,
        },
      });
      const clientSecret = paymentIntent.client_secret;
      res.json({ message: "Paiement commencé", clientSecret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Une erreur est survenue" });
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));