import { useEffect, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SWRConfig } from 'swr';
import { StyleSheetManager } from 'styled-components';
import { useRouter } from 'next/router';
import baseTheme from '../theme/theme';
import Header from '../components/Header';
import Loader from '../components/Loader';

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize cron jobs on client side (will actually run on server)
    if (typeof window !== 'undefined') {
      fetch('/api/cron/init').catch(err => console.error('Failed to init cron:', err));
    }

    // Set loading to false after initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show loader on route changes
    const handleStart = () => setLoading(true);
    const handleComplete = () => setTimeout(() => setLoading(false), 500);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  // default to dark theme matching the landing design
  const [mode, setMode] = useState('dark');

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => createTheme({ ...baseTheme, palette: { ...baseTheme.palette, mode } }), [mode]);

  return (
    <StyleSheetManager shouldForwardProp={(prop) => prop !== 'sx'}>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 60000,
        }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {loading ? (
            <Loader />
          ) : (
            <>
              <Header toggleTheme={toggleMode} themeMode={mode} />
              <Component {...pageProps} />
            </>
          )}
        </ThemeProvider>
      </SWRConfig>
    </StyleSheetManager>
  );
}

export default MyApp;
