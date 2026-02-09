import { Calendar, FileText } from "lucide-react";
import logo from "@/assets/sesi-senai-logo.png";

const DashboardHeader = () => {
  return (
    <header className="gradient-header rounded-xl p-6 md:p-8 text-primary-foreground shadow-elevated animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 opacity-80" />
            <div>
              <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Status Report</p>
              <h1 className="text-2xl md:text-3xl font-bold font-display">
                Novo Sistema de Saúde
              </h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">03/02/2026</span>
          </div>
          <img src={logo} alt="SESI SENAI" className="h-10 md:h-12 object-contain" />
        </div>
      </div>
      <div className="mt-5 bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
        <p className="text-sm md:text-base leading-relaxed opacity-95">
          Solução inovadora e eficiente para gestão hospitalar — administrativa, clínica e financeira — com o
          objetivo de otimizar o atendimento aos pacientes e a operação hospitalar do SESI/AL.
        </p>
      </div>
    </header>
  );
};

export default DashboardHeader;
