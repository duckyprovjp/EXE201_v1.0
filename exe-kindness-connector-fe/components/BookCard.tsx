"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./BookCard.module.scss";

// Define the book interface based on backend entity
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  images: string[];
  codition: string; // Misspelled in backend
  category?: string; // Add category if available
  location: {
    city?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  owner: any;
  status: string;
  viewCount: number;
}

export default function BookCard({ book }: { book: Book }) {
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bookshare_auth_v3");
      if (stored) {
        setAuth(JSON.parse(stored));
      }
    }
  }, []);

  const ownerId = book.owner?._id || book.owner;
  const isOwner = auth && ownerId === auth.id;

  const conditionText = book.codition ? book.codition.toUpperCase() : "CÓ SẴN";
  let statusClass = styles.statusAvailable;
  let displayStatus = "Có sẵn";
  
  if (book.status?.toUpperCase() === "PENDING") {
    statusClass = styles.statusPending;
    displayStatus = "Đã có người xin";
  }

  // Mock category for UI demo if not present
  const categoryText = book.category || "Sách chung";

  const cover = book.images && book.images.length > 0 ? book.images[0] : "https://via.placeholder.com/150";

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}
      whileTap={{ scale: 0.98 }}
      className={styles.card}
    >
      <Link href={`/books/${book._id}`} className={styles.imageContainer}>
        <img
          src={cover}
          alt={book.title}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Book&background=random";
          }}
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <div className={styles.categoryBadge}>{categoryText}</div>
          <div className={`${styles.statusBadge} ${statusClass}`}>
            {displayStatus}
          </div>
        </div>

        <Link href={`/books/${book._id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{book.title}</h3>
        </Link>
        <p className={styles.author}>{book.author}</p>

        <div className={styles.ownerInfo}>
          <div className={styles.avatar}>
            <img
              src={book.owner?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
              alt={book.owner?.fullName || "Người dùng"}
              className={styles.avatarImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=User&background=random";
              }}
            />
          </div>
          <span className={styles.ownerName}>
            {isOwner ? "Sách của Bạn" : `Sở hữu bởi ${book.owner?.fullName || "Người dùng"}`}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link 
            href={`/books/${book._id}`} 
            className={`${styles.actionButton} ${isOwner ? styles.btnOutline : styles.btnPrimary}`}
          >
            {isOwner ? "Quản lý lượt xin" : "Nhận sách miễn phí"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
