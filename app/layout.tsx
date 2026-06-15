import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import AuthGate from "../components/AuthGate";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kindness Connector - BookShare",
  description: "Mạng lưới trao đổi sách cũ 0đ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthGate>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 64px - 300px)' }}>
            {children}
          </main>
          <Footer />
        </AuthGate>
      </body>
    </html>
  );
}
