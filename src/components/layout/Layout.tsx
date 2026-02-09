import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="border-t py-6 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} SESI SENAI. Todos os direitos reservados.</p>
                    <p>Sistema de Gestão de Projetos v1.0.0</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
