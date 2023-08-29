import React from "react";
// import "./CatCard.scss";
import Link from "next/link";

function CatCard({ card }) {
  return (
    <Link href="/gigs?cat=design">
      <div className="catCard">
        <img src={card.img} alt="" />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}
export default CatCard;

const card = {
  img: "/images/design.png",
  desc: "Design",
  title: "Design & Creative",
}
