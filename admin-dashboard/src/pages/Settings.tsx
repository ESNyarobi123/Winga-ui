import { Card, CardBody, CardHeader, Switch } from "@heroui/react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Settings</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">System and notification preferences.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
            <h3 className="font-bold text-lg text-foreground">Notifications</h3>
          </CardHeader>
          <CardBody className="px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-foreground font-medium">Email on new applications</span>
              <Switch defaultSelected color="primary" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-foreground font-medium">Pending moderation alerts</span>
              <Switch defaultSelected color="primary" />
            </div>
          </CardBody>
        </Card>
        <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
            <h3 className="font-bold text-lg text-foreground">System</h3>
          </CardHeader>
          <CardBody className="px-6 py-6 flex flex-col justify-center text-center items-center">
            <div className="p-4 bg-gray-50 rounded-full mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-winga-muted-foreground text-sm font-medium">System configuration options will appear here.</p>
            <p className="text-gray-400 text-xs mt-1">API endpoints, environment settings, and maintenance mode controls.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
