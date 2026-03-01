"use client";

import { useState, useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { useAuth } from "@/hooks/use-auth";
import { contractService, type ContractSummary } from "@/services/contract.service";
import { chatService, type ChatMessageItem } from "@/services/chat.service";
import { formatRelativeTime } from "@/lib/format";

export function ChatWindow() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContract = contracts.find((c) => c.id === selectedId);
  const currentUserId = user?.id != null ? Number(user.id) : null;
  const receiverId =
    selectedContract && currentUserId != null
      ? Number(selectedContract.client?.id) === currentUserId
        ? selectedContract.freelancer?.id
        : selectedContract.client?.id
      : null;

  useEffect(() => {
    if (!user?.id) {
      setContracts([]);
      return;
    }
    setLoading(true);
    const isClient = user.role === "CLIENT";
    const fetchContracts = isClient ? contractService.getClientContracts({ size: 50 }) : contractService.getMyContracts({ size: 50 });
    fetchContracts
      .then((p) => setContracts(p?.content ?? []))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false));
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (selectedId == null) {
      setMessages([]);
      return;
    }
    setLoading(true);
    chatService
      .getContractMessages(String(selectedId), { size: 50 })
      .then((p) => setMessages(p?.content ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const content = input.trim();
    if (!content || selectedId == null || receiverId == null || sending) return;
    setSending(true);
    setInput("");
    try {
      const sent = await chatService.sendContractMessage(String(selectedId), receiverId, { content });
      setMessages((prev) => [...prev, sent]);
      await chatService.markContractRead(String(selectedId));
    } catch {
      setInput(content);
    } finally {
      setSending(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Sign in to view messages.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full rounded-lg border bg-card overflow-hidden">
      {/* Contract list */}
      <div className="w-72 border-r flex flex-col bg-muted/30">
        <div className="p-4 border-b">
          <p className="text-sm font-medium">Conversations</p>
        </div>
        <div className="flex-1 overflow-auto">
          {loading && contracts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : contracts.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No contracts yet.</p>
          ) : (
            contracts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 border-b last:border-0 transition-colors ${
                  selectedId === c.id ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/50"
                }`}
              >
                <p className="text-sm font-medium truncate">{c.jobTitle}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {c.client?.id === currentUserId ? c.freelancer?.fullName ?? "Freelancer" : c.client?.fullName ?? "Client"}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedId == null ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">Select a conversation or start a new one.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b shrink-0">
              <p className="text-sm font-medium">{selectedContract?.jobTitle ?? "Chat"}</p>
              <p className="text-xs text-muted-foreground">
                with {currentUserId === selectedContract?.client?.id ? selectedContract?.freelancer?.fullName : selectedContract?.client?.fullName}
              </p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {loading && messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading messages…</p>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender?.id != null && Number(msg.sender.id) === currentUserId;
                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg.content}
                      isOwn={!!isOwn}
                      time={msg.timestamp ? formatRelativeTime(msg.timestamp) : undefined}
                    />
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 min-w-0 rounded-md border bg-background px-3 py-2 text-sm"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {sending ? "…" : "Send"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
