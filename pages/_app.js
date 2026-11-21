import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import Layout from '../components/layout/Layout';
import de from '../messages/de.json';
import en from '../messages/en.json';
import '../styles/globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const messages = { de, en };

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const locale = router.locale || 'de';

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} font-sans`}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        timeZone="Europe/Berlin"
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextIntlClientProvider>
    </div>
  );
}

export default MyApp;
