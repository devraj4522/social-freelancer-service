import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GigCard from "../gigCard/GigCard";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import cookie from "js-cookie";
import Spinner from "../Layout/Spinner";

function Featured() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const token = cookie.get("token");
  useEffect(() => {
    const getGigs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/gigs/all`, {headers: {Authorization: token}}
        );
        setData(res.data);
        setInitialData(res.data);
        // console.log(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error.response);
        alert("Error Loading Gigs");
      }
      setLoading(false);
    };

    getGigs();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    const category = e.target.value;
    // console.log(e.target);
    // console.log(e.target.value);
    // filter with data of category
    if (category === "all") {
      setData(initialData);
      return;
    }
    const filter_data = initialData.filter((item) => item.cat === category);
    setData(filter_data);
  };

  const handleSubmit = () => {
    router.push(`/freelance/gigs/?search=${input}`);
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789870/social_media/img/search_pyi1is.png" alt="" />
              <input
                type="text"
                placeholder='Search Gigs Try "building mobil app"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>

          <div className="popular">
            <span>Popular:</span>
            <button value="web" onClick={handleFilter}>Web Developer</button>
            <button value="design"  onClick={handleFilter}>Designer</button>
            <button value="animation" onClick={handleFilter}>Animation</button>
            <button value="music" onClick={handleFilter}>Music</button>
            <button value="all" onClick={handleFilter}>All Gigs</button>
          </div>
           <div>
            {loading ? <Spinner /> : 
             <ul style={{display: "flex", listStyle: "none", flexWrap: "wrap"}}>
              {data.map((gig) =><li key={gig._id} style={{margin: "14px"}}> <GigCard item={gig} /> </li>)}
            </ul>
            }
           </div>
        </div>
        
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
      
    </div>
  );
}

export default Featured;
