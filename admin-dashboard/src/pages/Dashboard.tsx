import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";
import { getDashboardOverview } from "../api/client";
import {
  LineChart,
  Line,
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
import { Briefcase, FileText, TrendingUp, DollarSign, UserCheck, Shield, BarChart3 } from "lucide-react";

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
    { label: "Active Jobs", value: data.activeJobs, icon: Briefcase, color: "text-winga-primary", bg: "bg-winga-primary-light" },
    { label: "Applications (Today)", value: data.applicationsToday, icon: FileText, color: "text-winga-primary-dark", bg: "bg-primary-100" },
    { label: "Applications (Month)", value: data.applicationsThisMonth, icon: TrendingUp, color: "text-winga-primary", bg: "bg-winga-primary-light" },
    { label: "Hires Made", value: data.hiresMade, icon: UserCheck, color: "text-amber-700", bg: "bg-amber-100" },
    { label: "Response Rate %", value: data.responseRatePercent.toFixed(1), icon: BarChart3, color: "text-winga-primary-dark", bg: "bg-primary-100" },
    { label: "Revenue", value: data.revenue ?? 0, icon: DollarSign, color: "text-winga-primary", bg: "bg-winga-primary-light" },
    { label: "Pending Moderation", value: data.pendingModerationCount, icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const pieData = data.topCategories.map((c, i) => ({
    name: c.categoryName || "Other",
    value: c.count,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-winga-muted-foreground mt-0.5">Platform overview and real-time metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border border-winga-border bg-white shadow-winga-card hover:shadow-winga-card-hover transition-shadow rounded-winga-lg">
            <CardBody className="flex flex-row items-center gap-4 p-5">
              <div className={`p-3 rounded-winga-lg ${bg} ${color}`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-winga-muted-foreground text-sm">{label}</p>
                <p className="text-xl font-bold text-foreground">{value}</p>
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
                <LineChart data={data.applicationsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#006e42" strokeWidth={2} />
                </LineChart>
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
