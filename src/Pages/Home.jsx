import LandingPage from "./LandingPage";
import HomeProducts from "./HomeProducts";
import BestPage from "./BestPage";
import ClientReviews from "./ClientReview";
import DiscountPromo from "./DiscountPage";
import Footer from "./Footer";

function Home() {
    return (
        <div className="w-full  bg-zinc-950">
            <LandingPage />

            {/* Home products section begins BELOW the landing hero */}
            <div >
                <HomeProducts />
                <BestPage />
                <ClientReviews/>
                <DiscountPromo/>
                <Footer/>
            </div>

            <div>
                
            </div>
        </div>
    );
}

export default Home;
