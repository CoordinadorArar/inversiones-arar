import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Toaster } from "@/components/ui/toaster"

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            {children}
            <Toaster />
            <Footer />
        </div>
    );
}