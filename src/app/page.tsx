import Contact from '@/components/landing/Contact';
import FAQ from '@/components/landing/FAQ';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';

export default function LandingPage() {
	return (
		<div className="landing">
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

// import { Navigate } from 'react-router';
// import LandingPage from '~/components/landing/LandingPage';
// import { useAuth } from '~/contexts/AuthContext';

// const Home = () => {
// 	const { isLoggedIn } = useAuth();
// 	return isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />;
// };

// export default Home;
