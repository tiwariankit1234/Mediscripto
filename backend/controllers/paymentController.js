import Stripe from "stripe";
import appointmentModel from "../models/appointmentModel.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { amount, appointmentId } = req.body;
    if (!amount) return res.status(400).json({ success: false, message: "Missing amount" });

    const domain = process.env.FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Appointment Payment" },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/payment-cancel`,
      metadata: {
        appointmentId: appointmentId || "",
        userId: userId || "",
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      try {
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
        console.log("Appointment marked paid:", appointmentId);
      } catch (err) {
        console.error("Failed to mark appointment paid:", err);
      }
    } else {
      console.log("No appointmentId provided in metadata");
    }
  }

  res.json({ received: true });
};

// fetch a checkout session and return payment status
export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ success: false, message: "Missing sessionId" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // session.payment_status can be 'paid' or 'unpaid'
    // If paid, and appointmentId is present in metadata, mark appointment as paid in DB
    try {
      if (session.payment_status === "paid") {
        const appointmentId = session.metadata?.appointmentId;
        if (appointmentId) {
          await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
        }
      }
    } catch (err) {
      console.error("Failed to mark appointment paid in getSession:", err);
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error("getSession error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
