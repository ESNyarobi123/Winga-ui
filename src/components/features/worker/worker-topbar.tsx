"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Bell, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Avatar } from "@heroui/avatar";
import { notificationService, type NotificationItem } from "@/services/notification.service";
import { formatRelativeTime } from "@/lib/format";

const dummyMessages = [
    { id: "1", avatar: "O", avatarColor: "#006e42", sender: "OnlyGlow Media", preview: "Hey! We reviewed your application...", time: "2m ago", unread: true },
    { id: "2", avatar: "W", avatarColor: "#1a73e8", sender: "Winga Support", preview: "Your profile has been verified ✓", time: "1h ago", unread: true },
    { id: "3", avatar: "J", avatarColor: "#f59e0b", sender: "Job Alert", preview: "New OF Chatter job posted matching...", time: "3h ago", unread: false },
];

const dummyNotifications = [
    { id: "1", icon: "✅", title: "Application Accepted", message: "OnlyGlow Media accepted your application for Content Editor", time: "5m ago", unread: true },
    { id: "2", icon: "📋", title: "New Test Available", message: "Advanced English (C1) test is now available for you", time: "2h ago", unread: true },
    { id: "3", icon: "💼", title: "Job Saved", message: "OF Chatter PH has been saved to your list", time: "1d ago", unread: false },
    { id: "4", icon: "🔔", title: "Profile Update Reminder", message: "Complete your profile to get more job matches", time: "2d ago", unread: false },
];

export function WorkerTopbar() {
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [notifsUseSample, setNotifsUseSample] = useState(false);

    useEffect(() => {
        notificationService.unreadCount()
            .then(setUnreadNotifs)
            .catch(() => setUnreadNotifs(dummyNotifications.filter((n) => n.unread).length));
    }, []);

    function handleMarkAllNotificationsRead() {
        notificationService.markAllAsRead()
            .then(() => {
                setUnreadNotifs(0);
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            })
            .catch(() => {});
    }

    const unreadMsgs = dummyMessages.filter((m) => m.unread).length;
    const displayNotifs = notifsUseSample ? dummyNotifications : notifications;
    const displayNotifCount = notifsUseSample ? dummyNotifications.filter((n) => n.unread).length : unreadNotifs;

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
                        {unreadMsgs > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                        )}
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
                        {dummyMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-3 px-5 py-3.5 hover:bg-default-100 transition-colors cursor-pointer border-b border-default-100 last:border-0 ${msg.unread ? "bg-primary-50" : ""}`}
                            >
                                <Avatar name={msg.avatar} className="w-10 h-10 text-white text-sm font-bold shrink-0" style={{ backgroundColor: msg.avatarColor }} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-bold text-foreground truncate">{msg.sender}</span>
                                        <span className="text-[11px] text-default-400 shrink-0">{msg.time}</span>
                                    </div>
                                    <p className="text-xs text-default-500 truncate mt-0.5">{msg.preview}</p>
                                </div>
                                {msg.unread && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                            </div>
                        ))}
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
                    if (open && !notifsUseSample) {
                        notificationService.list({ size: 20 }).then((p) => setNotifications(p?.content ?? [])).catch(() => setNotifsUseSample(true));
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
                        {(notifsUseSample ? dummyNotifications : displayNotifs).map((notif) => {
                            const isApi = "isRead" in notif;
                            const unread = isApi ? !(notif as NotificationItem).isRead : (notif as { unread: boolean }).unread;
                            const title = (notif as NotificationItem).title ?? (notif as { title: string }).title;
                            const message = (notif as NotificationItem).message ?? (notif as { message: string }).message;
                            const time = isApi ? formatRelativeTime((notif as NotificationItem).createdAt) : (notif as { time: string }).time;
                            const icon = "icon" in notif ? (notif as { icon: string }).icon : "🔔";
                            const notifId = (notif as NotificationItem).id ?? (notif as { id: string }).id;
                            return (
                                <div
                                    key={notifId}
                                    className={`flex items-start gap-3 px-5 py-4 hover:bg-default-100 transition-colors cursor-pointer border-b border-default-100 last:border-0 ${unread ? "bg-primary-50" : ""}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-xl shrink-0">{icon}</div>
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
                        })}
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
