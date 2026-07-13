import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Providers from "@/components/providers/Providers";

const font = localFont({
  src: [
    {
      path: "../public/fonts/Madani-Arabic-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "../public/fonts/Madani-Arabic-Regular-1.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../public/fonts/Madani-Arabic-Semi-Bold-1.ttf",
      weight: "600",
      style: "semibold",
    },
    {
      path: "../public/fonts/Madani-Arabic-Bold-2.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--madani-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة الجراج | بيع وشراء السيارات المستعملة في مصر بضمان",
  description:
    "منصة الجراج — الوجهة الأولى لبيع وشراء السيارات المستعملة في مصر بضمان الفحص الاحترافي.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${font.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
