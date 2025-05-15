import React from 'react';
import './globals.css';

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className="bg-gray-50 font-sans text-gray-800">{children}</body>
      </html>
    )
  }