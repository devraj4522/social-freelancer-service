import React from "react";
// import { Slider } from "infinite-react-carousel/lib";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Reviews from "@/components/reviews/Reviews";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import Link from "next/link";
import cookie from "js-cookie";

function Gig({user}) {
  const router = useRouter();
  const [errorAPI, setErrorAPI] = React.useState(null);

  const { gig } = router.query;
  const id = gig;
  const token = cookie.get("token");
  
  const r = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      axios.get(`${baseUrl}/api/gigs/single/${id}`).then((res) => {
        return res.data;
      })
  });
  const { isLoading, error, data } = r;
  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
    axios.get(`${baseUrl}/api/auth`, {
      headers: { Authorization: token },
      params: { "getFollowingData": false, userId: userId }
    }).then((res) => {
        // console.log(res.data.user)
        return res.data.user;
      }),
    enabled: !!userId,
  });
  console.log(data);
  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <h1>{data.title}</h1>
            <img
                  className="freelance-image"
                  src={data.cover}
                  alt="Cover Image"
                />
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/noavatar_ytxxua.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/star_nl4qgh.png" alt="" key={i} />
                      ))}
                  </div>
                )}
              </div>
            )}
            {/* <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data.images.map((img) => (
                <img key={img} src={img} alt="" />
              ))}
            </Slider> */}
            <h2>About This Gig</h2>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/noavatar_ytxxua.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/star_nl4qgh.png" alt="" key={i} />
                          ))}
                      </div>
                    )}
                    <button>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                  <h3>{dataUser.shortTitle}</h3>
                  <p>{dataUser.shortDesc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} user={user} />
          </div>
          <div className="right">
            <div className="price">
              <h3 style={{width: "85%"}}>{data.shortTitle}</h3>
              <h2 style={{marginTop: 0, fontWeight: "bold"}}>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/clock_z789gf.png" alt="" />
                <span>{data.deliveryDate} Days Delivery</span>
              </div>
              <div className="item">
                <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789872/social_media/img/delete_h9sf3i.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789871/social_media/img/greencheck_ofasbq.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link href={`/freelance/pay/${id}`}>
            <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
