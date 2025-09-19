import type { Metadata } from "next";
import { PT_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

// Using the same font for headline for consistency as per style guide.
const fontHeadline = FontSans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-headline",
});


export const metadata: Metadata = {
  title: "MediTrack Pro",
  description: "A modern Hospital Management System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable, fontHeadline.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
