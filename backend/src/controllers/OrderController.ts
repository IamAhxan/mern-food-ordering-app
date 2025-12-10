import { type Request, type Response } from "express";
import Stripe from "stripe";
import Restaurant from "../models/Restaurant.js";
// FIX: Correctly import MenuItemType. Assuming it's the type for items in restaurant.menuItems.
import type { MenuItemType } from "../models/Restaurant.js";
import Order from "../models/Order.js";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

// Helper to convert dollars (as stored in Mongoose) to cents (as required by Stripe)
const toCents = (amount: number): number => Math.round(amount * 100);


const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate("restaurant").populate("user")

        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }
}


type CheckoutSessionRequest = {
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: number;
    }[];
    deliveryDetails: {
        email: string;
        name: string;
        addressLine1: string;
        city: string;
    };
    restaurantId: string;
};

const createLineItems = (
    checkoutSessionRequest: CheckoutSessionRequest,
    menuItems: MenuItemType[]
) => {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        checkoutSessionRequest.cartItems.map((cartItem) => {
            const menuItem = menuItems.find(
                (item) => item._id.toString() === cartItem.menuItemId
            );

            if (!menuItem) {
                // Throwing an error will be caught by the outer try/catch
                throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
            }

            const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
                price_data: {
                    currency: "usd",
                    // FIX: Convert price from dollars (Mongoose) to cents (Stripe)
                    unit_amount: toCents(menuItem.price),
                    product_data: {
                        name: menuItem.name,
                    },
                },
                quantity: cartItem.quantity,
            };
            return line_item;
        });

    return lineItems;
};


const stripeWebhookHandler = async (req: Request, res: Response) => {
    // FIX: Explicitly type event and rely on return in catch for safety
    let event: Stripe.Event;

    try {
        const sig = req.headers["stripe-signature"];
        // NOTE: This assumes express.raw() middleware is used for this route in index.ts
        event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_ENDPOINT_SECRET);
    } catch (error: any) {
        console.error("Stripe Webhook Signature Error:", error);
        // FIX: Must return here to prevent proceeding with potentially undefined 'event'
        return res.status(400).send(`Webhook signature error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        // FIX: Type assertion (narrowing) to access specific Checkout Session properties
        const session = event.data.object as Stripe.Checkout.Session;

        const order = await Order.findById(session.metadata?.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // FIX: Convert amount_total (cents) back to dollars for the Mongoose model
        if (session.amount_total) {
            order.totalAmount = session.amount_total / 100;
        } else {
            console.error("Webhook session completed, but amount_total is missing.");
        }

        order.status = "paid";

        await order.save();
    }

    // Always respond 200 OK to Stripe
    res.status(200).send();
};


const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;

        // Ensure req.userId is available (from jwtParse middleware)
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const restaurant = await Restaurant.findById(
            checkoutSessionRequest.restaurantId
        );

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not Found" });
        }

        // Create the new order instance
        const newOrder = new Order({
            restaurant: restaurant,
            user: userId, // Use the extracted userId
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        })

        const menuItems = restaurant.menuItems as MenuItemType[];
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        // FIX: Convert deliveryPrice from dollars (Mongoose) to cents (Stripe)
        const deliveryPriceCents = toCents(restaurant.deliveryPrice);

        const session = await createSession(
            lineItems,
            newOrder._id.toString(),
            deliveryPriceCents, // Pass the value in cents
            restaurant._id.toString()
        );

        if (!session.url) {
            return res.status(500).json({ message: "Error creating Stripe session" })
        }

        await newOrder.save()

        // FIX: Remove redundant return statement
        return res.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);

        const message =
            error.raw?.message || "Internal Server Error during checkout";
        res.status(500).json({ message });
    }
};

const createSession = async (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryPrice: number, restaurantId: string) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice, // This is now correctly in cents
                        currency: "usd",
                    }
                }
            }
        ],
        mode: 'payment',
        metadata: {
            orderId,
            restaurantId
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`
    })
    return sessionData;
}


export { createCheckoutSession, stripeWebhookHandler, getMyOrders };