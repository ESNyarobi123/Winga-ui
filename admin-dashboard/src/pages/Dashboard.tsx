import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";
import { getDashboardOverview } from "../api/client";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  if (error) {
    return (
      <Card className="border-danger">
        <CardBody>
          <p className="text-danger font-medium">Failed to load dashboard: {error}</p>
          <p className="text-sm text-winga-muted-foreground mt-2">Ensure backend is running and you are logged in as Admin.</p>
        </CardBody>
      </Card>
    );
  }
  if (!data) return null;

  const metrics = [
    { label: "Active Jobs", value: data.activeJobs, icon: Briefcase, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+12%", up: true },
    { label: "Applications (Today)", value: data.applicationsToday, icon: FileText, color: "text-[#005c36]", bg: "bg-[#005c36]/10", trend: "+5%", up: true },
    { label: "Applications (Month)", value: data.applicationsThisMonth, icon: TrendingUp, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+18%", up: true },
    { label: "Hires Made", value: data.hiresMade, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-100/50", trend: "+2%", up: true },
    { label: "Response Rate", value: `${data.responseRatePercent.toFixed(1)}%`, icon: BarChart3, color: "text-[#005c36]", bg: "bg-[#005c36]/10", trend: "-1%", up: false },
    { label: "Revenue", value: `$${data.revenue ?? 0}`, icon: DollarSign, color: "text-winga-primary", bg: "bg-winga-primary-light/50", trend: "+8%", up: true },
    { label: "Pending Moderation", value: data.pendingModerationCount, icon: Shield, color: "text-orange-600", bg: "bg-orange-100/50", trend: "-3%", up: false },
  ];

  const pieData = data.topCategories.map((c, i) => ({
    name: c.categoryName || "Other",
    value: c.count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome back, Admin 👋</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">Here is what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, bg, trend, up }) => (
          <Card key={label} className="group border border-winga-border bg-white shadow-winga-card hover:shadow-lg transition-all duration-300 rounded-2xl hover:-translate-y-1">
            <CardBody className="flex flex-col gap-3 p-5">
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
                <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
          <CardHeader className="px-6 pt-6 pb-2">
            <h3 className="font-semibold text-foreground">Applications over time</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
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
          </CardBody>
        </Card>
        <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
          <CardHeader className="px-6 pt-6 pb-2">
            <h3 className="font-semibold text-foreground">Top job categories</h3>
          </CardHeader>
          <CardBody className="px-6 pb-6">
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
          </CardBody>
        </Card>
      </div>

      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
          <h3 className="font-semibold text-foreground">Quick actions</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6 flex flex-wrap gap-3">
          <Button className="btn-primary-winga" as={Link} to="/moderation">Review pending jobs</Button>
          <Button variant="bordered" className="border-winga-border text-winga-primary hover:bg-winga-primary-light" as={Link} to="/users">Manage users</Button>
          <Button variant="bordered" className="border-winga-border text-winga-primary hover:bg-winga-primary-light" as={Link} to="/categories">Edit categories</Button>
          <Button variant="flat" className="text-winga-muted-foreground hover:bg-winga-primary-light" as={Link} to="/disputes">View disputes</Button>
        </CardBody>
      </Card>
    </div>
  );
}
