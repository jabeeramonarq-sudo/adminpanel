import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/shared/ScrollToTop";
import { ScrollToTopOnNavigation } from "./components/shared/ScrollToTopOnNavigation";

const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const InboxPage = lazy(() => import("./pages/admin/InboxPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage"));
const CompleteInvitationPage = lazy(() => import("./pages/CompleteInvitationPage"));
const SetupPage = lazy(() => import("./pages/admin/SetupPage"));
const ContentPage = lazy(() => import("./pages/admin/ContentPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTopOnNavigation />
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center text-sm">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/invite/:token" element={<CompleteInvitationPage />} />
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/admin/inbox" element={<InboxPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/leads" element={<LeadsPage />} />
            <Route path="/admin/content" element={<ContentPage />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
