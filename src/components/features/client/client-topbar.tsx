"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Bell, Info, X, Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { notificationService, type NotificationItem } from "@/services/notification.service";
import { formatRelativeTime } from "@/lib/format";

export function ClientTopbar() {
    const pathname = usePathname();
    const [showMessages, setShowMessages] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const msgRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const isWorkersPage = pathname.includes("/client/workers");
    const pillText = isWorkersPage ? "Connections Made: 0/1" : "Job posts: 0/1";

    useEffect(() => {
        notificationService.unreadCount()
            .then(setUnreadNotifs)
            .catch(() => setUnreadNotifs(0));
    }, []);

    useEffect(() => {
        if (showNotifications) {
            notificationService.list({ size: 20 })
                .then((p) => setNotifications(p?.content ?? []))
                .catch(() => setNotifications([]));
        }
    }, [showNotifications]);

    function handleMarkAllNotificationsRead() {
        notificationService.markAllAsRead()
            .then(() => {
                setUnreadNotifs(0);
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            })
            .catch(() => {});
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (msgRef.current && !msgRef.current.contains(e.target as Node)) setShowMessages(false);
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayNotifCount = unreadNotifs;

    return (
        <header className="h-[68px] border-b border-[#f0f0f0] bg-white flex items-center justify-between px-8 gap-4 sticky top-0 z-40">
            <div className="flex items-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eaf5ef] text-[#006e42] rounded-full text-[12px] font-bold">
                    {pillText}
                    <Info className="w-3.5 h-3.5" />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Chat / Messages — popup kama worker */}
                <div className="relative" ref={msgRef}>
                    <button
                        onClick={() => {
                            setShowMessages(!showMessages);
                            setShowNotifications(false);
                        }}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] transition-colors"
                        aria-label="Messages"
                    >
                        <MessageSquare className="w-5 h-5 text-[#006e42]" strokeWidth={2} />
                    </button>
                    {showMessages && (
                        <div className="absolute top-[calc(100%+10px)] right-0 w-[360px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#f0f0f0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
                                <h3 className="text-[15px] font-bold text-[#111827]">Messages</h3>
                                <div className="flex items-center gap-2">
                                    <button className="text-[12px] text-[#006e42] font-semibold hover:underline">Mark all read</button>
                                    <button onClick={() => setShowMessages(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6]">
                                        <X className="w-4 h-4 text-[#666]" />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[340px]">
                                <div className="px-5 py-8 text-center text-[#666] text-[13px]">No messages yet. Messages will appear here when you have conversations.</div>
                            </div>
                            <div className="px-5 py-3 border-t border-[#f0f0f0]">
                                <Link href="/client/messages" className="block text-center text-[13px] font-semibold text-[#006e42] hover:underline">
                                    View all messages →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications — popup kama worker */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowMessages(false);
                        }}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-[#006e42]" strokeWidth={2} />
                        {displayNotifCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#006e42] rounded-full" />
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute top-[calc(100%+10px)] right-0 w-[380px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#f0f0f0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0]">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[15px] font-bold text-[#111827]">Notifications</h3>
                                    {displayNotifCount > 0 && (
                                        <span className="px-2 py-0.5 bg-[#006e42] text-white text-[11px] font-bold rounded-full">{displayNotifCount}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleMarkAllNotificationsRead} className="text-[12px] text-[#006e42] font-semibold hover:underline flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Mark all read
                                    </button>
                                    <button onClick={() => setShowNotifications(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6]">
                                        <X className="w-4 h-4 text-[#666]" />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[360px]">
                                {notifications.length === 0 ? (
                                    <div className="px-5 py-8 text-center text-[#666] text-[13px]">No notifications yet.</div>
                                ) : (
                                    notifications.map((notif) => {
                                        const unread = !notif.isRead;
                                        const title = notif.title ?? "";
                                        const message = notif.message ?? "";
                                        const time = formatRelativeTime(notif.createdAt);
                                        return (
                                            <div
                                                key={notif.id}
                                                className={`flex items-start gap-3 px-5 py-4 hover:bg-[#f9fafb] transition-colors cursor-pointer border-b border-[#f9f9f9] last:border-0 ${unread ? "bg-[#f0faf5]" : ""}`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-[#f0faf5] flex items-center justify-center text-[20px] shrink-0">🔔</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-[13.5px] font-bold text-[#111827]">{title}</span>
                                                        <span className="text-[11px] text-[#999] shrink-0 mt-0.5">{time}</span>
                                                    </div>
                                                    <p className="text-[12.5px] text-[#666] mt-0.5 leading-snug">{message}</p>
                                                </div>
                                                {unread && <div className="w-2 h-2 rounded-full bg-[#006e42] mt-1.5 shrink-0" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="px-5 py-3 border-t border-[#f0f0f0]">
                                <Link href="/client/notifications" className="block text-center text-[13px] font-semibold text-[#006e42] hover:underline">
                                    View all notifications →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <Link
                    href="/client/post-job"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#006e42] hover:bg-[#005c36] text-white rounded-full text-[13.5px] font-bold transition-all"
                >
                    <span>+</span> Post a job
                </Link>
            </div>
        </header>
    );
}
