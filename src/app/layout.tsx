import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientWrapper from "@/components/ClientWrapper";
import Layout from "@/components/layout/Layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B FMCG Platform",
  description: "A modern B2B platform for FMCG businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <ClientWrapper>
          <Layout>{children}</Layout>
        </ClientWrapper>
      </body>
    </html>
  );
}
