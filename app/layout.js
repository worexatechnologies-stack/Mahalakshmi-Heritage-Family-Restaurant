import "./globals.css";
import Script from "next/script";
import MetaPixel from "@/components/MetaPixel";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Mahalakshmi Spice Heritage Family Restaurant | Authentic Royal Flavors",
  description: "Mahalakshmi Spice Heritage Family Restaurant brings exquisite royal flavors, stone-ground spices, clay-tandoor delicacies, and refined family dining to every table.",
  keywords: [
    "Mahalakshmi Spice Heritage",
    "MSH Restaurant",
    "Mahalakshmi Family Restaurant",
    "Spice Heritage",
    "Royal Indian Dining",
    "Tandoori",
    "Biryani",
    "Family Restaurant"
  ],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Mahalakshmi Spice Heritage Family Restaurant",
    description: "Discover Mahalakshmi Spice Heritage Family Restaurant.",
    images: [{ url: "/logo.jpg" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0c0c0d] text-[#f4ede4] antialiased selection:bg-[#cba158] selection:text-[#0c0c0d]" suppressHydrationWarning>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
