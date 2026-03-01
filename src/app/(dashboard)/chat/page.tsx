import { ChatWindow } from "@/components/features/chat/chat-window";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <ChatWindow />
    </div>
  );
}
