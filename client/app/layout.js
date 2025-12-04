import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AIChat from "@/components/AIChat";

export const metadata = {
  title: "Health Sync",
  description: "AI-Powered Health Monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <AuthProvider>
          <main className="flex-grow container mx-auto p-4">{children}</main>
          <AIChat />
        </AuthProvider>
      </body>
    </html>
  );
}
