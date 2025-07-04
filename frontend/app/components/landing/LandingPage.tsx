import Contact from "./Contact";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";

export default function LandingPage() {
	return (
		<div className="landing reset">
			<Header />
			<Hero />
			<Features />
			<Testimonials />
			<Pricing />
			<FAQ />
			<Contact />
			<Footer />
		</div>
	);
}
