import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../utils/authContext';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      );
};

export default MyApp;