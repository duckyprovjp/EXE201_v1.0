"use client";

import { useState, useEffect } from "react";
import { Search, Trophy, BookOpen } from "lucide-react";
import axios from "axios";
import BookCard, { Book } from "../components/BookCard";
import styles from "./page.module.scss";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/book");
      if (response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    if (!searchTerm) return true;
    const matchTitle = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAuthor = book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTitle || matchAuthor;
  });

  return (
    <div className={styles.pageContainer}>
      {/* Hero Banner Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroBanner}>
            <div className={styles.heroTextContainer}>
              <div className={styles.heroBadge}>
                <Trophy size={14} className={styles.trophyIcon} /> Tủ sách cộng đồng lớn nhất Hà Nội
              </div>
              <h1 className={styles.heroTitle}>
                Sắp xếp chia sẻ <br />
                <span>Tri Thức Trao Tay</span>
              </h1>
              <p className={styles.heroDesc}>
                Hàng ngàn cuốn sách từ tiểu thuyết, giáo khoa đến kỹ năng được trao tặng hoàn toàn miễn phí quanh bạn. Kết nối và chia sẻ ngay hôm nay!
              </p>

              <div className={styles.searchBox}>
                <div className={styles.searchInputWrapper}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sách hoặc tác giả cần tìm..."
                    className={styles.searchInput}
                  />
                </div>
                <button 
                  onClick={() => setSearchTerm("")} 
                  className={styles.clearButton}
                >
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className={styles.mainGridSection}>
        <div className={styles.gridContainer}>
          <div className={styles.rightPanel}>
            <div className={styles.sortBar}>
              <p className={styles.resultsCount}>
                Tìm thấy <span>{filteredBooks.length}</span> cuốn sách quanh đây
              </p>
            </div>

            {loading ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3>Đang tải sách...</h3>
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className={styles.booksGrid}>
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <BookOpen size={24} />
                </div>
                <h3>Không tìm thấy sách nào</h3>
                <p>
                  Hãy thử mở rộng bán kính tìm kiếm, thay đổi bộ lọc hoặc tìm với từ khóa khác nhé.
                </p>
                <button onClick={() => setSearchTerm("")}>
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
