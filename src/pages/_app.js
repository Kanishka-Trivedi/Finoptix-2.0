import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SWRConfig } from 'swr';
import theme from '../theme/theme';
import Header from '../components/Header';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize cron jobs on client side (will actually run on server)
    if (typeof window !== 'undefined') {
      fetch('/api/cron/init').catch(err => console.error('Failed to init cron:', err));
    }
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 60000,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>
  );
}

export default MyApp;
