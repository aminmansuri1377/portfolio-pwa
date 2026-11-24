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
          {/*
            Service worker: production only. In `next dev` the SW used to cache-first the
            un-hashed /_next/static/* chunks, so after any edit the page loaded stale chunks and
            threw odd hydration / ChunkLoad errors until a reload. In dev we now remove any
            previously registered SW and its caches (one-time reload if it controlled the page).
          */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                process.env.NODE_ENV === 'production'
                  ? "if('serviceWorker' in navigator){" +
                    "window.addEventListener('load',function(){" +
                    "navigator.serviceWorker.register('/sw.js').catch(function(e){" +
                    "console.warn('SW registration failed:',e)" +
                    "})" +
                    "})" +
                    "}"
                  : "if('serviceWorker' in navigator){" +
                    "var had=!!navigator.serviceWorker.controller;" +
                    "navigator.serviceWorker.getRegistrations()" +
                    ".then(function(r){return Promise.all(r.map(function(x){return x.unregister()}))})" +
                    ".then(function(){return window.caches?caches.keys():[]})" +
                    ".then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))})" +
                    ".then(function(){if(had&&!sessionStorage.getItem('sw-cleaned')){sessionStorage.setItem('sw-cleaned','1');location.reload()}})" +
                    ".catch(function(){})" +
                    "}",
            }}
          />
        </body>
      </Html>
    );
  }
}
