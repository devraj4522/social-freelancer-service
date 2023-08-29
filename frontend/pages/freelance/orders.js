import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import cookie from "js-cookie";
import Spinner from "@/components/Layout/Spinner";

const Orders = ({user}) => {
  const router = useRouter();
  const currentUser = user;
  console.log(currentUser);
  const token = cookie.get("token");

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      axios.get(`${baseUrl}/api/orders`, {
        headers: { Authorization: `${token}` }, // Assuming token is properly defined
      }).then((res) => {
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await axios.get(`${baseUrl}/api/conversations/single/${id}`, {headers: { Authorization: `${token}` }});
      // console.log(`/f/messages/${res.data._id}`);
      router.push(`/freelance/messages/${res.data._id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await axios.post(`${baseUrl}/api/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        }, {headers: { Authorization: `${token}` }});
        router.push(`/freelance/messages/${res.data.id}`);
      }
    }
  };
  return (
    <div className="orders">
      {isLoading ? (
        <Spinner />
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Contact</th>
            </tr>
            </thead>
            <tbody>
            {data.map((order) => (
              <tr key={order._id}>
                <td>
                  <img className="image" src={order.img} alt="" />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img
                    className="message"
                    src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789870/social_media/img/message_h1rt7a.png"
                    alt=""
                    onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;