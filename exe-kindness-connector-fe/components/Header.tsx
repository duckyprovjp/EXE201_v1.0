"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, MessageCircle, Gift, Plus, LogOut, Crown, Bell } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import styles from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const res = await axios.get("http://localhost:3000/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPoints(res.data.points || 0);
        setIsPremium(res.data.isPremium || false);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bookshare_auth_v3");
      if (stored) {
        const authData = JSON.parse(stored);
        setAuth(authData);
        fetchUserData(authData.token);
      }
    }
    
    const handleAuthUpdate = () => {
      const stored = localStorage.getItem("bookshare_auth_v3");
      if (stored) {
        const authData = JSON.parse(stored);
        setAuth(authData);
        fetchUserData(authData.token);
      } else {
        setAuth(null);
        setPoints(0);
        setIsPremium(false);
      }
    };

    window.addEventListener("auth-updated", handleAuthUpdate);
    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdate);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bookshare_auth_v3");
      setAuth(null);
      window.dispatchEvent(new Event("auth-updated"));
      router.push("/login");
    }
  };

  const isChatRoom = pathname.startsWith("/chat/") && pathname !== "/chat";

  const navItems = [
    { name: "Khám phá", path: "/" },
    { name: "Đăng tặng", path: "/post" },
    { name: "Tin nhắn", path: "/chat" },
  ];

  if (auth?.role === "ADMIN") {
    navItems.push({ name: "Admin", path: "/admin" });
  }

  if (isChatRoom) {
    return (
      <header className={`${styles.header} ${styles.desktopOnly}`}>
        <div className={styles.headerContainer}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandIcon}>
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <span className={styles.brandName}>Kindness Connector</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {/* Brand Logo */}
          <div className={styles.leftSection}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandIcon}>
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <span className={styles.brandName}>Kindness Connector</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className={styles.desktopNav}>
              {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className={styles.activeIndicator}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section Actions */}
          <div className={styles.rightSection}>
            {/* Points Pill */}
            <div className={styles.pointsPill} onClick={() => router.push("/rewards")}>
              <span>🪙</span>
              <span>{points} pts</span>
            </div>

            {/* Requests Icon */}
            <Link
              href="/requests"
              className={`${styles.chatIcon} ${pathname.startsWith("/requests") ? styles.chatIconActive : ""}`}
              title="Quản lý lượt xin"
            >
              <Bell size={18} />
            </Link>

            {/* Chat Icon */}
            <Link
              href="/chat"
              className={`${styles.chatIcon} ${pathname.startsWith("/chat") ? styles.chatIconActive : ""}`}
              title="Tin nhắn"
            >
              <MessageCircle size={18} />
              <span className={styles.chatBadge} />
            </Link>

            {/* Post Action Button (Desktop Only) */}
            <Link href="/post" className={styles.postButton}>
              <Plus size={14} />
              <span>Đăng sách</span>
            </Link>

            <div className={styles.divider} />

            {/* Profile Avatar */}
            {auth?.isLoggedIn ? (
              <div className={styles.profileSection}>
                <Link href="/profile" className={styles.avatar}>
                  <img src={auth.avatar || "https://i.pravatar.cc/150?u=99"} alt="Avatar" />
                  {isPremium && (
                    <div className={styles.premiumBadge}>
                      <Crown size={10} strokeWidth={3} />
                    </div>
                  )}
                </Link>
                <button onClick={handleLogout} title="Đăng xuất" className={styles.logoutButton}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginButton}>
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
