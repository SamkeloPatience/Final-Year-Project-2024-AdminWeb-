"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect } from 'react';





const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(()=> { 
    import ("bootstrap/dist/js/bootstrap");
  }, []);
  return (
    <html lang="en">
      <body className="parent">
        
        {children}</body>
   
    </html>
  );
}
