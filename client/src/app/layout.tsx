import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Newsvist – Impactful News & Timely Updates",
  description:
    "Stay informed with Newsvist – delivering breaking news, in-depth analysis, and stories that shape the world. Trusted, timely, and impactful journalism.",
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ??
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://newsvist.com")
  ),

  openGraph: {
    title: "Newsvist – Impactful News & Timely Updates",
    description:
      "Breaking news, insightful analysis, and stories that matter. Follow Newsvist for reliable updates that make an impact.",
    url: "https://newsvist.com",
    siteName: "Newsvist",
    images: [
      {
        url: "https://res.cloudinary.com/dqxcyhqvx/image/upload/v1753022225/Newsvistlogo_agfbuq.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
