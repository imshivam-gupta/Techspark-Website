import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) { 
    const { method } = req;
    switch (method) {
        case "POST":
            try {
                console.log(req?.body?.items)
                const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    payment_method_types: ['card'],
                    line_items: req?.body?.items ?? [],
                    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${req.headers.origin}/cart`,
                    custom_text: {
                        submit: {
                          message: 'We\'ll email you instructions tracking details.',
                        },
                    },
                    allow_promotion_codes: true,
                    // 
                    
                });

                res.status(200).json({ success: true, url:session.url });

            } catch (error) {
                console.log(error)
                res.status(500).json({ success: false, message:error.message });
            }
            break;
        default:
            res.status(400).json({ success: false });
          break;
      }
}