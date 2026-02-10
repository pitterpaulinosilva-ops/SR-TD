import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
            <footer className="border-t py-8 mt-auto bg-white/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
                    <p>© {new Date().getFullYear()} SESI SENAI. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/5 text-primary font-medium">v1.0.0</span>
                        <p>Sistema de Gestão de Projetos</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
