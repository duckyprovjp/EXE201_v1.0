"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User as UserIcon, MessageSquare } from "lucide-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import styles from "./page.module.scss";

function ChatComponent() {
  const searchParams = useSearchParams();
  const roomIdQuery = searchParams.get("room");

  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authStr = localStorage.getItem("bookshare_auth_v3");
    if (authStr) {
      const auth = JSON.parse(authStr);
      setUserId(auth.id);

      // Connect Socket
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        console.log("Connected to chat server");
      });

      socketRef.current.on("newMessage", (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      fetchRooms(auth);

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && roomIdQuery) {
      const room = rooms.find(r => r._id === roomIdQuery);
      if (room) {
        selectRoom(room);
      }
    } else if (rooms.length > 0 && !activeRoom) {
      selectRoom(rooms[0]);
    }
  }, [rooms, roomIdQuery]);

  const fetchRooms = async (auth: any) => {
    try {
      const res = await axios.get("http://localhost:3000/chat/rooms", {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectRoom = async (room: any) => {
    setActiveRoom(room);
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", { roomId: room._id });
    }
    
    // Fetch old messages
    try {
      const authStr = localStorage.getItem("bookshare_auth_v3");
      const auth = JSON.parse(authStr!);
      const res = await axios.get(`http://localhost:3000/chat/rooms/${room._id}/messages`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      roomId: activeRoom._id,
      senderId: userId,
      content: newMessage
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getOtherParticipant = (room: any) => {
    return room.participants.find((p: any) => p._id !== userId) || room.participants[0];
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Tin nhắn ({rooms.length})</h3>
          </div>
          <div className={styles.roomList}>
            {rooms.map(room => {
              const other = getOtherParticipant(room);
              return (
                <div 
                  key={room._id} 
                  className={`${styles.roomItem} ${activeRoom?._id === room._id ? styles.active : ''}`}
                  onClick={() => selectRoom(room)}
                >
                  <img src={other.avatar || "https://ui-avatars.com/api/?name=U&background=random"} alt="" className={styles.avatar} />
                  <div className={styles.roomInfo}>
                    <h4>{other.fullName}</h4>
                    <p>Về sách: {room.exchangeId?.book?.title}</p>
                  </div>
                </div>
              )
            })}
            {rooms.length === 0 && (
              <div className={styles.emptyRooms}>Không có cuộc trò chuyện nào</div>
            )}
          </div>
        </div>

        <div className={styles.chatArea}>
          {activeRoom ? (
            <>
              <div className={styles.chatHeader}>
                <img src={getOtherParticipant(activeRoom).avatar || "https://ui-avatars.com/api/?name=U&background=random"} alt="" className={styles.avatar} />
                <div className={styles.chatHeaderInfo}>
                  <h3>{getOtherParticipant(activeRoom).fullName}</h3>
                  <p>Trao đổi: {activeRoom.exchangeId?.book?.title}</p>
                </div>
              </div>

              <div className={styles.messagesContainer}>
                {messages.map((msg, idx) => {
                  const isMine = typeof msg.senderId === 'string' ? msg.senderId === userId : msg.senderId._id === userId;
                  return (
                    <div key={msg._id || idx} className={`${styles.messageWrapper} ${isMine ? styles.mine : styles.theirs}`}>
                      {!isMine && (
                        <div className={styles.msgAvatar}>
                           <UserIcon size={14} />
                        </div>
                      )}
                      <div className={styles.messageBubble}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.inputArea} onSubmit={sendMessage}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..." 
                  className={styles.input}
                />
                <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <MessageSquare size={48} className={styles.emptyIcon} />
              <h2>Chưa chọn phòng chat</h2>
              <p>Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ChatComponent />
    </Suspense>
  );
}
