"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Bell, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { notificationService, type NotificationItem } from "@/services/notification.service";
import { formatRelativeTime } from "@/lib/format";

export function WorkerTopbar() {
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        notificationService.unreadCount()
            .then(setUnreadNotifs)
            .catch(() => setUnreadNotifs(0));
    }, []);

    function handleMarkAllNotificationsRead() {
        notificationService.markAllAsRead()
            .then(() => {
                setUnreadNotifs(0);
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            })
            .catch(() => {});
    }

    const displayNotifCount = unreadNotifs;

    return (
        <header className="h-14 shrink-0 border-b border-default-200 bg-background flex items-center justify-end px-4 md:px-6 gap-3 w-full">
            <Popover placement="bottom-end" offset={10} radius="lg">
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        variant="light"
                        color="primary"
                        className="relative"
                        aria-label="Messages"
                    >
                        <MessageSquare className="w-5 h-5" strokeWidth={2} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[360px] p-0">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-default-200">
                        <h3 className="text-sm font-bold">Messages</h3>
                        <Button size="sm" variant="light" color="primary" className="text-xs font-semibold min-w-0">
                            Mark all read
                        </Button>
                    </div>
                    <div className="overflow-y-auto max-h-[340px]">
                        <div className="px-5 py-8 text-center text-default-500 text-sm">No messages yet. Messages will appear here when you have conversations.</div>
                    </div>
                    <div className="px-5 py-3 border-t border-default-200">
                        <Button as={Link} href="/worker/messages" variant="light" color="primary" className="w-full text-sm font-semibold">
                            View all messages →
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <Popover
                placement="bottom-end"
                offset={10}
                radius="lg"
                onOpenChange={(open) => {
                    if (open) {
                        notificationService.list({ size: 20 }).then((p) => setNotifications(p?.content ?? [])).catch(() => setNotifications([]));
                    }
                }}
            >
                <PopoverTrigger>
                    <Button
                        isIconOnly
                        variant="light"
                        color="primary"
                        className="relative"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" strokeWidth={2} />
                        {displayNotifCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-0">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-default-200">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold">Notifications</h3>
                            {displayNotifCount > 0 && (
                                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[11px] font-bold rounded-full">
                                    {displayNotifCount}
                                </span>
                            )}
                        </div>
                        <Button size="sm" variant="light" color="primary" className="text-xs font-semibold min-w-0 gap-1" onPress={handleMarkAllNotificationsRead}>
                            <Check className="w-3.5 h-3.5" /> Mark all read
                        </Button>
                    </div>
                    <div className="overflow-y-auto max-h-[360px]">
                        {notifications.length === 0 ? (
                            <div className="px-5 py-8 text-center text-default-500 text-sm">No notifications yet.</div>
                        ) : (
                            notifications.map((notif) => {
                                const unread = !notif.isRead;
                                const title = notif.title ?? "";
                                const message = notif.message ?? "";
                                const time = formatRelativeTime(notif.createdAt);
                                return (
                                    <div
                                        key={notif.id}
                                        className={`flex items-start gap-3 px-5 py-4 hover:bg-default-100 transition-colors cursor-pointer border-b border-default-100 last:border-0 ${unread ? "bg-primary-50" : ""}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-xl shrink-0">🔔</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-sm font-bold text-foreground">{title}</span>
                                                <span className="text-[11px] text-default-400 shrink-0 mt-0.5">{time}</span>
                                            </div>
                                            <p className="text-xs text-default-500 mt-0.5 leading-snug">{message}</p>
                                        </div>
                                        {unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="px-5 py-3 border-t border-default-200">
                        <Button as={Link} href="/worker/notifications" variant="light" color="primary" className="w-full text-sm font-semibold">
                            View all notifications →
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </header>
    );
}
