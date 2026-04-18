import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";

// Pages publiques
import Home from "./pages/Home";

// Étudiant - Auth
import StudentLogin from "./pages/student/StudentLogin";
import StudentRegister from "./pages/student/StudentRegister";

// Étudiant - Espace
import Dashboard from "./pages/Dashboard";
import MesCandidatures from "./pages/MesCandidatures";
import MonProfil from "./pages/MonProfil";
import Parametres from "./pages/Parametres";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";

// Entreprise - Auth
import CompanyLogin from "./pages/company/CompanyLogin";
import CompanyRegister from "./pages/company/CompanyRegister";

// Entreprise - Espace
import CompanyDashboard from "./pages/company/CompanyDashboard";
import PublierOffre from "./pages/company/PublierOffre";
import ModifierOffre from "./pages/company/ModifierOffre";
import MesOffres from "./pages/company/MesOffres";
import CompanyParametres from "./pages/company/CompanyParametres";
import CandidaturesEntreprise from "./pages/company/Candidaturesentreprise";

// Auth
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Pages publiques ────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        {/* ── Espace étudiant ───────────────────────── */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidatures" element={<MesCandidatures />} />
          <Route path="/profil" element={<MonProfil />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
        </Route>

        {/* ── Espace entreprise ─────────────────────── */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="MesOffres" element={<MesOffres />} />
          <Route path="candidatures" element={<CandidaturesEntreprise />} />
          <Route path="offres/nouvelle" element={<PublierOffre />} />
          <Route path="offres/:id/modifier" element={<ModifierOffre />} />
          <Route
            path="offres/:id/candidatures"
            element={<CandidaturesEntreprise />}
          />

          {/* ✅ CORRECTION ICI */}
          <Route path="parametres" element={<CompanyParametres />} />
        </Route>

        {/* ── Auth séparé ───────────────────────────── */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ── Fallback ─────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;