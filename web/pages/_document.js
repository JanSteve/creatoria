import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark scroll-smooth">
      <Head>
        <meta name="description" content="Creatoria - Multi-Vendor Digital Marketplace for Premium Code, Assets, and Designs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-darkBg text-slate-100 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
