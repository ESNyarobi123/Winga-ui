import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Moderation from "./pages/Moderation";
import Applications from "./pages/Applications";
import Contracts from "./pages/Contracts";
import Users from "./pages/Users";
import Categories from "./pages/Categories";
import FilterOptions from "./pages/FilterOptions";
import PaymentOptions from "./pages/PaymentOptions";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import QualificationTests from "./pages/QualificationTests";
import Disputes from "./pages/Disputes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-winga-muted">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-winga-primary/20 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-winga-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-winga-muted-foreground font-medium">Loading admin…</p>
        </div>
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="applications" element={<Applications />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="filter-options" element={<FilterOptions />} />
          <Route path="payment-options" element={<PaymentOptions />} />
          <Route path="subscription-plans" element={<SubscriptionPlans />} />
          <Route path="qualification-tests" element={<QualificationTests />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
