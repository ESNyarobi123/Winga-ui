import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardOverview, getAnalytics, exportContractsCsv } from "../api/client";
import AdminButton from "../components/AdminButton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Briefcase, FileText, TrendingUp, DollarSign, UserCheck, Shield, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

const COLORS = ["#006e42", "#005c36", "#99cfbb", "#f59e0b", "#64748b"];

export default function Dashboard() {
  const [exportingContracts, setExportingContracts] = useState(false);
  const [analytics, setAnalytics] = useState<{
    jobsPerCategory?: { category?: string; count?: number }[];
    revenueInPeriod?: number;
    periodFrom?: string;
    periodTo?: string;
  } | null>(null);
  const [data, setData] = useState<{
    activeJobs: number;
    applicationsToday: number;
    applicationsThisMonth: number;
    hiresMade: number;
    responseRatePercent: number;
    revenue: number;
    pendingModerationCount: number;
    applicationsOverTime: { date: string; count: number }[];
    topCategories: { categoryName: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardOverview()
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const to = new Date();
    const from = new Date(to);
    from.setMonth(from.getMonth() - 1);
    getAnalytics(from.toISOString(), to.toISOString())
      .then((res) => res.data && setAnalytics(res.data))
      .catch(() => setAnalytics(null));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-10 h-10 border-4 border-winga-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="border border-red-200 rounded-2xl bg-red-50 p-6">
        <p className="text-red-700 font-medium">Failed to load dashboard: {error}</p>
        <p className="text-sm text-winga-muted-foreground mt-2">Ensure backend is running and you are logged in as Admin.</p>
      </div>
    );
  }
  if (!data) return null;

  const revenueNum = typeof data.revenue === "number" ? data.revenue : Number(data.revenue ?? 0);
  const revenueFormatted = new Intl.NumberFormat("en-TZ", { style: "decimal", maximumFractionDigits: 0 }).format(revenueNum);

  const metrics = [
    { label: "Active Jobs", value: data.activeJobs, icon: Briefcase, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+12%", up: true },
    { label: "Applications (Today)", value: data.applicationsToday, icon: FileText, color: "text-[#005c36]", bg: "bg-[#005c36]/10", trend: "+5%", up: true },
    { label: "Applications (Month)", value: data.applicationsThisMonth, icon: TrendingUp, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+18%", up: true },
    { label: "Hires Made", value: data.hiresMade, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-100/50", trend: "+2%", up: true },
    { label: "Response Rate", value: `${data.responseRatePercent.toFixed(1)}%`, icon: BarChart3, color: "text-[#005c36]", bg: "bg-[#005c36]/10", trend: "-1%", up: false },
    { label: "Revenue (TZS)", value: `TZS ${revenueFormatted}`, icon: DollarSign, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+8%", up: true },
    { label: "Pending Moderation", value: data.pendingModerationCount, icon: Shield, color: "text-orange-600", bg: "bg-orange-100/50", trend: "-3%", up: false },
  ];

  const pieData = data.topCategories.map((c, i) => ({
    name: c.categoryName || "Other",
    value: c.count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back, Admin</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">Here is what is happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, bg, trend, up }) => (
          <div key={label} className="group border border-winga-border bg-white shadow-winga-card hover:shadow-lg transition-all duration-300 rounded-2xl hover:-translate-y-1 flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between w-full">
                <div className={`p-3 rounded-xl ${bg} ${color} backdrop-blur-md`}>
                  <Icon size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {trend}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-winga-muted-foreground text-[14px] font-medium">{label}</p>
                <p className="text-2xl font-bold text-foreground mt-1 tracking-tight break-all">{typeof value === "number" ? value.toLocaleString() : value}</p>
              </div>
            </div>
        ))}
      </div>

      {analytics && (analytics.revenueInPeriod != null || (analytics.jobsPerCategory?.length ?? 0) > 0) && (
        <div className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Analytics (last 30 days)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analytics.revenueInPeriod != null && (
              <div>
                <p className="text-sm text-winga-muted-foreground">Revenue in period</p>
                <p className="text-xl font-bold text-foreground">
                  TZS {Number(analytics.revenueInPeriod).toLocaleString("en-TZ")}
                </p>
              </div>
            )}
            {analytics.jobsPerCategory && analytics.jobsPerCategory.length > 0 && (
              <div>
                <p className="text-sm text-winga-muted-foreground mb-2">Jobs per category (top)</p>
                <ul className="space-y-1 text-sm">
                  {analytics.jobsPerCategory.slice(0, 5).map((row: { category?: string; count?: number }, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-foreground">{row.category ?? "—"}</span>
                      <span className="font-medium">{row.count ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
          <div className="px-6 pt-6 pb-2">
            <h3 className="font-semibold text-foreground">Applications over time</h3>
          </div>
          <div className="px-6 pb-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.applicationsOverTime || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006e42" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#006e42" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#006e42" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
          <div className="px-6 pt-6 pb-2">
            <h3 className="font-semibold text-foreground">Top job categories</h3>
          </div>
          <div className="px-6 pb-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <div className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
          <h3 className="font-semibold text-foreground">Quick actions</h3>
        </div>
        <div className="px-6 pb-6 flex flex-wrap gap-3">
          <Link to="/moderation"><AdminButton className="btn-primary-winga">Review pending jobs</AdminButton></Link>
          <Link to="/users"><AdminButton variant="flat" className="border border-winga-border text-winga-primary hover:bg-winga-primary-light">Manage users</AdminButton></Link>
          <Link to="/categories"><AdminButton variant="flat" className="border border-winga-border text-winga-primary hover:bg-winga-primary-light">Edit categories</AdminButton></Link>
          <Link to="/disputes"><AdminButton variant="flat" className="text-winga-muted-foreground hover:bg-winga-primary-light">View disputes</AdminButton></Link>
          <AdminButton
            variant="flat"
            className="border border-winga-border text-winga-primary hover:bg-winga-primary-light"
            isLoading={exportingContracts}
            onPress={async () => {
              setExportingContracts(true);
              try {
                await exportContractsCsv();
              } finally {
                setExportingContracts(false);
              }
            }}
          >
            Export contracts CSV
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
