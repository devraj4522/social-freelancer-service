import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import moment from "moment";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import Link from "next/link";
import cookie from "js-cookie";

const Messages = ({user}) => {
  const queryClient = useQueryClient();
  const token = cookie.get("token");
  const currentUser = user;
  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      axios.get(`${baseUrl}/api/conversations`,  {
        headers: { Authorization: token },
      }).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.put(`${baseUrl}/api/conversations/${id}`, null,
      {
        headers: { Authorization: token },
      }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  console.log(data);

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
            <tr>
              <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {data.map((c) => (
              <tr
                className={
                  ((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)) &&
                  "active"
                }
                key={c.id}
              >
                <td>{currentUser.isSeller ? c.buyerId : c.sellerId}</td>
                <td>
                  <Link href={`/freelance/messages/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer))? (
                    <a onClick={(e) => { e.preventDefault();  handleRead(c.id);}}>
                      Mark as Read
                    </a>
                  ):
                  (
                    <Link style={{color: "rgb(22, 139, 188)"}} href={`/freelance/messages/${c.id}`}>Message</Link>
                  )
                }
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

export default Messages;
