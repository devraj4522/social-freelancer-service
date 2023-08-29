import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import Review from "../review/Review";
import cookie from "js-cookie";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";

const Reviews = ({ gigId, user }) => {
  const token = cookie.get("token");
  const queryClient = useQueryClient()
  const [errorReivew, setErrorReview] = React.useState(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      axios.get(`${baseUrl}/api/reviews/${gigId}`, {headers: {Authorization: token}}).then((res) => {
        return res.data;
      }),
  });



  const mutation = useMutation({
    mutationFn: (review) => {
    return axios.post(`${baseUrl}/api/reviews`, review, {headers: { Authorization: token }})
    .catch((err) => { 
      setErrorReview("Something went wrong! \n You might have already reviewed this gig.") 
    } 
      );
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["reviews"])
    },

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
    e.target[0].value = "";
    e.target[1].value = 1;
  };

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {isLoading
        ? "loading"
        : error
        ? "Something went wrong!"
        : data.map((review) => <Review key={review._id} review={review} user={user} />)}
      {errorReivew && <div className="error" >{errorReivew}</div>}
      
      <div className="add">
        <h3>Add a review</h3>
        <form action="" className="addForm" onSubmit={handleSubmit}>
          <input type="text" className="search" placeholder="write your opinion" />
          <select name="" id="">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
