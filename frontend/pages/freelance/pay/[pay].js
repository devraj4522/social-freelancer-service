import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import newRequest from "../../../utils/newRequest";
import { useRouter } from "next/router";
import CheckoutForm from "@/components/checkoutForm/CheckoutForm";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import cookie from "js-cookie";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const token = cookie.get("token");

  const { pay } = router.query;
  const id = pay;

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await axios.post(`${baseUrl}/api/orders/create-payment-intent/${id}`, null, 
        {
          headers: { Authorization: token },
        })
        .then((res) => {
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      });
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return( <div className="pay">
    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
  </div>);
};

export default Pay;