import Footer from "@/Components/Footer";
import Header from "@/Components/Header";

export default function PublicLayout({children}) {
    return (
        <div className="min-h-screen bg-background">
            <Header/>
            {children}
            <Footer/>
        </div>
    );
}