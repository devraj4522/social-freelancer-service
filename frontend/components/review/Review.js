import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import cookie from "js-cookie";
import baseUrl from "@/utils/baseUrl";

const Review = ({ review, user }) => {
  const token = cookie.get("token");
  const isLoading = false;
  const error = false;
  const data = user;

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          <img className="pp" src={data.profilePicUrl || "https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/noavatar_ytxxua.jpg"} alt="" />
          <div className="info">
            <span>{data.username}</span>
            <div className="country">
              <span>{data.country}</span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/star_nl4qgh.png" alt="" key={i} />
          ))}
      </div>
      <p>{review.desc}</p>
      <div className="helpful">
        <span>Helpful?</span>
        <i className="thumbs up icon"></i>
        <span>Yes</span>
        <i className="thumbs down icon"></i>
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;

