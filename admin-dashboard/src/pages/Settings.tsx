import { Card, CardBody, CardHeader, Switch } from "@heroui/react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-winga-muted-foreground">System and notification preferences</p>
      </div>
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">Notifications</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-foreground">Email on new applications</span>
            <Switch defaultSelected />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-foreground">Pending moderation alerts</span>
            <Switch defaultSelected />
          </div>
        </CardBody>
      </Card>
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">System</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <p className="text-winga-muted-foreground text-sm">API base URL and other config can be added here.</p>
        </CardBody>
      </Card>
    </div>
  );
}
