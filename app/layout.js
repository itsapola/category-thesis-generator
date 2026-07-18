import "./globals.css";

export const metadata = {
  title: "Category Thesis Generator | Ashley Pola",
  description:
    "Pressure-test how a product should be framed — generate competing category theses with the positioning tradeoffs and competitive implications of each.",
  openGraph: {
    title: "Category Thesis Generator",
    description:
      "Pressure-test how a product should be framed — generate competing category theses with the positioning tradeoffs of each.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,600,700&f[]=switzer@400,500,600,700,400i,500i&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
