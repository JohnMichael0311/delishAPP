
import AppRoutes from './AppRoutes';
import Header from './components/Header/Header';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor';
import { useEffect } from 'react';
import Footer from './pages/Footer/Footer';
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js'; // Import Elements wrapper
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe

const stripePromise = loadStripe('pk_test_51RL2BtQE9tlu0TT9Ylohq5Paqk3mTIxw8dB5Nv3WOQzuiXtdhx7yapzTRU9bI8cZ7tySQmUVuR6wHw07zm51htgF00kuj1zBaa'); // Your Stripe publishable key

function App() {
  const { showLoading, hideLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [showLoading, hideLoading]); 

  return (
    <>
      <Loading />
      <Header />
      
      {/* Wrap the AppRoutes with Elements to provide Stripe context */}
      <Elements stripe={stripePromise}>
        <AppRoutes />
      </Elements>
    
      <Footer />
    </>
  );
}

export default App;

