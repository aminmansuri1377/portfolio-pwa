import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
        {/* PWA / install metadata */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#5651e5" />
        <meta name="application-name" content="Amin" />
        <meta name="description" content="Portfolio of Mohamad Amin Mansori, a front-end web developer specializing in responsive, exceptional digital experiences." />
        {/* iOS standalone web app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Amin" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Register the service worker as early as possible (before React
            hydrates) so PWA auditors like Lighthouse/PWABuilder detect it
            within their short check window. Rendered as an external file so
            it runs synchronously after the page HTML loads. */}
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
  )
}