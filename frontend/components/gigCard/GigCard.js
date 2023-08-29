import React, {useState, useEffect} from "react";
// import "./GigCard.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Link from "next/link";
import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "@/utils/baseUrl";

const GigCard = ({ item }) => {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: [item.userId],
  //   queryFn: () =>
  //     newRequest.get(`/users/${item.userId}`).then((res) => {
  //       return res.data;
  //     }),
  // });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({username: "", profilePicUrl: ""});

  useEffect(() => {
    setIsLoading(true);
    const token = cookie.get("token");
    const getUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/profile/userid/${item.userId}`);
        const resUser = {username: res.data.username, profilePicUrl: res.data.profilePicUrl};
        setData(resUser);
        // console.log(res.data.user);
      } catch (error) {
        // console.log(error.response);
        setError(true);
      }
    };
    getUser();
    setIsLoading(false);
  }, []);

  return (
    <Link href={`/freelance/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.profilePicUrl || "https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/noavatar_ytxxua.jpg"} alt="" />
              <span>{data.username}</span>
            </div>
          )}
          <p style={{marginBottom: 0}}>{item.desc}</p>
          <div className="star">
            <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/star_nl4qgh.png" alt="" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/heart_n0kqcb.png" alt="" />
          <div className="price">
            <span style={{marginRight: "5px"}}>STARTING AT</span>
            <span style={{fontWeight: 'bold', fontSize: "1.2rem", background: "rgb(32, 62, 94)", padding: "4px 12px", borderRadius: "18px" }}>$ {item.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;    
