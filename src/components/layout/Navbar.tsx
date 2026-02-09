import { Link } from "react-router-dom";
import { LayoutDashboard, CircleUser, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <LayoutDashboard className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight text-foreground leading-none">SESI SENAI</span>
                                <span className="text-xs font-medium text-muted-foreground">Health Report System</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link to="/" className="text-foreground border-b-2 border-primary pb-5 mt-5">Dashboard</Link>
                            <Link to="#" className="hover:text-foreground transition-colors pb-5 mt-5 border-b-2 border-transparent hover:border-border">Projetos</Link>
                            <Link to="#" className="hover:text-foreground transition-colors pb-5 mt-5 border-b-2 border-transparent hover:border-border">Equipes</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-px bg-border mx-2" />
                        <div className="flex items-center gap-2 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs text-muted-foreground">Gestor de Projetos</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <CircleUser className="h-8 w-8 text-primary" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
