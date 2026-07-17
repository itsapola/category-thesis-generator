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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
