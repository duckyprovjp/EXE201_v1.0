"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Star, Heart } from "lucide-react";
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

  // Mock rating based on view count since backend doesn't have it yet
  const rating = 4.5 + (book.viewCount % 5) * 0.1;
  const requestsCount = book.viewCount || 2;

  const conditionText = book.codition ? book.codition.toUpperCase() : "AVAILABLE";
  let conditionClass = styles.conditionGood;
  if (conditionText.includes("NEW")) {
    conditionClass = styles.conditionNew;
  } else if (conditionText.includes("OLD") || conditionText.includes("USED")) {
    conditionClass = styles.conditionOld;
  }

  const cover = book.images && book.images.length > 0 ? book.images[0] : "https://via.placeholder.com/150";

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0, 168, 255, 0.08)" }}
      whileTap={{ scale: 0.98 }}
      className={styles.card}
    >
      <Link href={`/books/${book._id}`} className={styles.imageContainer}>
        <img
          src={cover}
          alt={book.title}
          className={styles.image}
          style={{ width: "100%", height: "100%" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Book&background=random";
          }}
        />
        
        <div className={`${styles.conditionBadge} ${conditionClass}`}>
          {conditionText}
        </div>

        {isOwner ? (
          <div className={styles.requestsBadge}>
            <Users size={10} />
            {requestsCount} lượt xin
          </div>
        ) : (
          <button className={styles.favoriteButton}>
            <Heart size={14} />
          </button>
        )}
      </Link>

      <div className={styles.content}>
        <div className={styles.ratingRow}>
          <div className={styles.rating}>
            <Star size={12} className={styles.starIcon} />
            <span>{rating.toFixed(1)}</span>
            <span className={styles.reviewsCount}>({requestsCount})</span>
          </div>
        </div>

        <Link href={`/books/${book._id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{book.title}</h3>
        </Link>
        <p className={styles.author}>{book.author}</p>

        <div className={styles.footer}>
          <div className={styles.ownerInfo}>
            <div className={styles.avatar}>
              <img
                src={book.owner?.avatar || "https://ui-avatars.com/api/?name=User&background=random"}
                alt={book.owner?.fullName || "Người dùng"}
                className={styles.avatarImg}
                style={{ width: "100%", height: "100%" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=User&background=random";
                }}
              />
            </div>
            <span className={styles.ownerName}>
              {isOwner ? "Bạn" : book.owner?.fullName || "Người dùng"}
            </span>
          </div>
          {!isOwner && (
            <span className={styles.location}>
              <MapPin size={10} className={styles.pinIcon} />
              {book.location?.district || "Hà Nội"}
            </span>
          )}
        </div>

        <div className={styles.actionRow}>
          <Link href={`/books/${book._id}`} className={styles.actionButton}>
            {isOwner ? "Quản lý lượt xin" : "Nhận sách miễn phí"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
