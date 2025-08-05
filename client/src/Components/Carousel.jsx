import apple from "../Images/apple.png";
import chat from "../Images/chat.png";
import crunch from "../Images/crunch.png";
import disney from "../Images/disney.png";
import hulu from "../Images/hulu.png";
import netflix from "../Images/netflix.png";
import pf from "../Images/pf.png";
import spotify from "../Images/spotify.png";
import "./Carousel.css";

const images = [apple, chat, crunch, disney, hulu, netflix, pf, spotify];

export default function Carousel() {
    return (
        <div className="body">
            <div className="carousel">
                <div class="wrap">
                    {images.concat(images).map((img, idx) => (
                        <img src={img} alt="" key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}