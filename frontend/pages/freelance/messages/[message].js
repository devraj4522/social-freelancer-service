import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import moment from "moment";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import Link from "next/link";
import cookie from "js-cookie";
import { useRouter } from "next/router";


const Message = ({user}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const id = router.query.message;
  const currentUser = user;
  const token = cookie.get("token");
  

  const { isLoading, error, data } = useQuery({
    queryKey: ["message"],
    queryFn: () =>
      axios.get(`${baseUrl}/api/message/${id}`, {headers: {Authorization: token}}).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return axios.post(`${baseUrl}/api/message`, message, {headers: {Authorization: token}});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["message"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      "conversationId": id,
      "desc": e.target[0].value,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link href="/freelance/messages">Messages</Link> John Doe 
        </span>
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="messages"  style ={{
            overflow: "hidden auto",
            maxHeight: "35rem",
            height: "35rem",
            backgroundColor: "rgb(30, 53, 77)"
          }}>
            {data.map((m) => (
              <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p style={{background: "rgb(10, 12, 23)"}}>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr style={{borderColor: "rgb(25, 137, 165)"}} />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
