import { Navbar } from "@/components/layout/Navbar";
import { TermCalculator } from "@/components/features/TermCalculator";

export default function TermCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      <Navbar />
      <main className="flex-1">
        <TermCalculator />
      </main>
    </div>
  );
}
