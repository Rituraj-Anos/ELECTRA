import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "ELECTRA — AI Election Education Platform",
  description:
    "An AI-powered civic education platform that helps citizens understand elections, voter registration, and democratic processes worldwide. Built with Google Gemini.",
  keywords: [
    "election education",
    "voter registration",
    "civic education",
    "democracy",
    "AI assistant",
    "Google Gemini",
  ],
  authors: [{ name: "ELECTRA Team" }],
  openGraph: {
    title: "ELECTRA — AI Election Education Platform",
    description:
      "Your AI-powered guide to understanding elections and civic participation.",
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FDF8F3" />
      </head>
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
