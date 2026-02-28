import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { ScrollToTopOnNavigation } from "./components/shared/ScrollToTopOnNavigation";
import LoginPage from "./pages/admin/LoginPage";
import AdminDashboard from "./pages/admin/Dashboard";
import InboxPage from "./pages/admin/InboxPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UsersPage from "./pages/admin/UsersPage";
import CompleteInvitationPage from "./pages/CompleteInvitationPage";
import SetupPage from "./pages/admin/SetupPage";
import ContentPage from "./pages/admin/ContentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTopOnNavigation />
        <ScrollToTop />
        <Routes>
          <Route path="/invite/:token" element={<CompleteInvitationPage />} />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/admin/inbox" element={<InboxPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/content" element={<ContentPage />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
