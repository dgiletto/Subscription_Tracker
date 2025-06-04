import Navbar from "../Components/Navbar";
import './Home.css'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <h2>Track Your Subscriptions</h2>
        <p>
          Stay on top of your recurring payments with our simple and effective subscription manager.
        </p>
      </div>
    </>
  );
}
