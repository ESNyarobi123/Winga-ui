import { useState } from "react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";

export default function Settings() {
  const [emailApps, setEmailApps] = useState(true);
  const [modAlerts, setModAlerts] = useState(true);
  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Settings"
        subtitle="System and notification preferences."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard title="Notifications" subtitle="When to receive alerts.">
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-winga-border hover:bg-gray-50/50 transition-colors cursor-pointer">
              <span className="text-foreground font-medium">Email on new applications</span>
              <input type="checkbox" checked={emailApps} onChange={(e) => setEmailApps(e.target.checked)} className="w-11 h-6 rounded-full appearance-none border-2 border-gray-300 bg-gray-200 checked:bg-winga-primary checked:border-winga-primary transition-colors cursor-pointer" />
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl border border-winga-border hover:bg-gray-50/50 transition-colors cursor-pointer">
              <span className="text-foreground font-medium">Pending moderation alerts</span>
              <input type="checkbox" checked={modAlerts} onChange={(e) => setModAlerts(e.target.checked)} className="w-11 h-6 rounded-full appearance-none border-2 border-gray-300 bg-gray-200 checked:bg-winga-primary checked:border-winga-primary transition-colors cursor-pointer" />
            </label>
          </div>
        </AdminCard>
        <AdminCard title="System" subtitle="Configuration and maintenance.">
          <div className="flex flex-col justify-center text-center items-center py-6">
            <div className="p-4 bg-gray-50 rounded-full mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-winga-muted-foreground text-sm font-medium">System configuration options will appear here.</p>
            <p className="text-gray-400 text-xs mt-1">API endpoints, environment settings, and maintenance mode controls.</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
