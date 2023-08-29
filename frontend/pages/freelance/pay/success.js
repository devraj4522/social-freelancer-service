import React, { useEffect } from "react";
import { useRouter } from "next/router";
import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import cookie from "js-cookie";


const Success = () => {
  const router = useRouter();
  const token = cookie.get("token");

  const payment_intent = router.query.payment_intent;
//   console.log(payment_intent, params);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await axios.put(`${baseUrl}/api/orders`, { payment_intent }, {
            headers: { Authorization: token },
          });
        setTimeout(() => {
          router.push("/freelance/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, []);

  return (
    <div>
      Payment successful. You are being redirected to the orders page. Please do
      not close the page
    </div>
  );
};

export default Success;
