import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/router';
import GigCard from "@/components/gigCard/GigCard";
import axios from "axios";
import baseUrl from "@/utils/baseUrl";
import newRequest from "@/utils/newRequest";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const router = useRouter();
  const { search } = router.query;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [`${baseUrl}/gigs`],
    queryFn: () =>
      {
        if (!search) 
        {
         return  axios
         .get(
           `${baseUrl}/api/gigs/all`,
         )
         .then((res) => {
          console.log(res.data);
           return res.data;
         })
        } else {
          return axios
          .get(
            `${baseUrl}/api/gigs?search=${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
          )
          .then((res) => {
            return res.data;
          })
        }
        
      },
  });


  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Liverr  Graphics & Design </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Liverr's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="https://res.cloudinary.com/diutgjcc8/image/upload/v1690789870/social_media/img/down_zefn9l.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : (data.length > 0)
            ? data.map((gig) => <GigCard key={gig._id} item={gig} />):
            <h1>No gigs found</h1>
            }
        </div> 
      </div>
    </div>
  );
}

export default Gigs;
