import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const locale = this.props.locale || 'de';
    return (
      <Html lang={locale}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#060609" />
          <meta name="application-name" content="Amin Mansori" />
          <meta
            name="description"
            content="Portfolio von Mohamad Amin Mansori – Frontend-Entwickler für React, Next.js, TypeScript und Three.js. Verfügbar für Positionen in Deutschland."
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Amin" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Register the service worker early so PWA auditors detect it. */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                "if('serviceWorker' in navigator){" +
                "window.addEventListener('load',function(){" +
                "navigator.serviceWorker.register('/sw.js').catch(function(e){" +
                "console.warn('SW registration failed:',e)" +
                "})" +
                "})" +
                "}",
            }}
          />
        </body>
      </Html>
    );
  }
}
