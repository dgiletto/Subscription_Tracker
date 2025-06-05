import Navbar from "../Components/Navbar";
import './Home.css'
import Carousel from "../Components/Carousel";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <Carousel />
        <h2>Track Your Subscriptions</h2>
        <p>
          Stay on top of your recurring payments with our simple and effective subscription manager.
          <br></br>
          Track and manage all of your subscriptions in one place
        </p>
      </div>
    </>
  );
}
