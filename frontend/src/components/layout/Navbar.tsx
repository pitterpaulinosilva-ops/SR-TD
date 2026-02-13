import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CircleUser, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const location = useLocation();

    const isHome = location.pathname === "/";
    const isProject = location.pathname.startsWith("/report");

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-300">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight text-foreground uppercase leading-none">SESI SENAI</span>
                                <span className="text-[10px] font-medium text-muted-foreground tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">HEALTH REPORT</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                to="/"
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${isHome
                                        ? 'text-primary bg-primary/5'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/"
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${isProject
                                        ? 'text-primary bg-primary/5'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                Projetos
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border-r border-border/40 pr-2 mr-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors">Admin User</p>
                                <p className="text-xs text-muted-foreground">Gestor de Projetos</p>
                            </div>
                            <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-border group-hover:ring-primary/20 transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <CircleUser className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
