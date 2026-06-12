"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, Filter, MapPin, Compass, GraduationCap, Laptop, Languages, Smile, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import BookCard, { Book } from "../components/BookCard";
import styles from "./page.module.scss";

const categories = [
  { id: "all", name: "Tất cả sách", icon: BookOpen },
  { id: "vanhoc", name: "Văn học", icon: Compass },
  { id: "kynang", name: "Kỹ năng", icon: Smile },
  { id: "khoahoc", name: "Khoa học", icon: Laptop },
  { id: "giaoduc", name: "Giáo dục", icon: GraduationCap },
  { id: "ngoai_ngu", name: "Ngoại ngữ", icon: Languages },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("Đang tải vị trí...");

  // Filter States
  const [activeRadius, setActiveRadius] = useState("10km");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      const stored = localStorage.getItem("bookshare_auth_v3");
      if (stored) {
        const authData = JSON.parse(stored);
        const res = await axios.get("http://localhost:3000/user/me", {
          headers: { Authorization: `Bearer ${authData.token}` }
        });
        const addr = res.data.address;
        if (addr && addr.length > 0) {
          setUserLocation(`${addr[0].district}, ${addr[0].city}`);
        } else {
          setUserLocation("Toàn quốc");
        }
      } else {
        setUserLocation("Toàn quốc");
      }
    } catch (error) {
      console.error("Failed to fetch user location:", error);
      setUserLocation("Toàn quốc");
    }
  };

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

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search
      const matchesSearch = 
        !searchTerm || 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter (Giả lập map string với các category id)
      let matchesCategory = true;
      if (selectedCategory !== "all") {
        // Mock logic vì backend trả về objectId, ở đây tạm giả lập
        const titleCat = book.title?.toLowerCase() || "";
        if (selectedCategory === "vanhoc" && !titleCat.includes("văn") && !titleCat.includes("tiểu thuyết")) matchesCategory = false;
        // Thực tế phần này cần API backend support, hoặc dữ liệu book có chứa label category rõ ràng.
        // Để demo UI mượt mà, tạm thời giả lập không filter ngắt quãng nếu không match chính xác logic giả.
      }

      // Condition filter
      let matchesCondition = true;
      if (selectedCondition !== "all") {
        const cond = book.codition?.toUpperCase() || "";
        if (selectedCondition === "new" && !cond.includes("NEW")) matchesCondition = false;
        if (selectedCondition === "good" && (!cond.includes("GOOD") && cond !== "USED")) matchesCondition = false;
        if (selectedCondition === "old" && cond !== "OLD") matchesCondition = false;
      }

      // Radius filter: Chờ backend bổ sung tọa độ địa lý. Hiện tại cho phép qua hết.
      const matchesRadius = true;

      return matchesSearch && matchesCategory && matchesCondition && matchesRadius;
    });
  }, [books, searchTerm, selectedCategory, selectedCondition, activeRadius]);

  const clearFilters = () => {
    setActiveRadius("10km");
    setSelectedCondition("all");
    setSelectedCategory("all");
    setSearchTerm("");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Trao đổi sách,<br />
                <span>Chia sẻ tri thức</span>
              </h1>
              <p className={styles.heroDesc}>
                Tham gia cộng đồng những người đọc sách trên toàn quốc. Biến những cuốn sách bạn đã đọc xong thành những chuyến phiêu lưu mới mà không tốn một xu.
              </p>

              <div className={styles.searchBox}>
                <div className={styles.searchInputWrapper}>
                  <Search size={20} className={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm theo tên sách, tác giả hoặc thể loại..."
                    className={styles.searchInput}
                  />
                </div>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")} 
                    className={styles.clearButton}
                  >
                    Xóa lọc
                  </button>
                )}
              </div>

              <div className={styles.heroActions}>
                <button className={styles.btnPrimary}>Bắt đầu trao đổi sách</button>
                <button className={styles.btnOutline}>Cách hoạt động</button>
              </div>
            </div>
            
            <div className={styles.heroImagePlaceholder}>
              <div className={styles.placeholderBox}>
                <div className={styles.placeholderBadge}>
                  <div className={styles.badgeIcon}>📖</div>
                  <div className={styles.badgeText}>
                    <span>Lượt trao đổi</span>
                    <strong>12,450+</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesHeader}>
          <h2>Khám phá theo thể loại</h2>
          <span className={styles.viewAllCat}>Tất cả {categories.length - 1} danh mục <ChevronRight size={14} /></span>
        </div>
        <div className={styles.categoriesScroll}>
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.categoryPill} ${isSelected ? styles.categoryActive : ""}`}
              >
                <CatIcon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid Section with Sidebar */}
      <section className={styles.mainGridSection}>
        <div className={styles.gridContainer}>
          
          {/* LEFT: Desktop Sidebar Filter */}
          <aside className={styles.desktopSidebar}>
            <div className={styles.filterBox}>
              <div className={styles.filterHeader}>
                <h3><Filter size={16} /> Bộ lọc tìm kiếm</h3>
                <button onClick={clearFilters} className={styles.btnClearFilter}>Xóa lọc</button>
              </div>

              {/* Distance */}
              <div className={styles.filterGroup}>
                <h4>Bán kính xung quanh</h4>
                <div className={styles.filterGrid2}>
                  {["1km", "3km", "5km", "10km"].map((rad) => (
                    <button
                      key={rad}
                      onClick={() => setActiveRadius(rad)}
                      className={`${styles.filterBtn} ${activeRadius === rad ? styles.filterBtnActive : ""}`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className={styles.filterGroup}>
                <h4>Tình trạng sách</h4>
                <div className={styles.filterGridCol}>
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "new", label: "Sách mới / Như mới" },
                    { id: "good", label: "Sách cũ còn tốt" },
                    { id: "old", label: "Sách đã cũ" }
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => setSelectedCondition(cond.id)}
                      className={`${styles.filterBtnRow} ${selectedCondition === cond.id ? styles.filterBtnActive : ""}`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className={styles.locationBox}>
                <p>VỊ TRÍ HIỆN TẠI</p>
                <div className={styles.locationTag}>
                  <MapPin size={14} className={styles.pinIcon} />
                  <span>{userLocation}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Results */}
          <div className={styles.resultsArea}>
            <div className={styles.sectionHeader}>
              <p className={styles.resultsCount}>
                Tìm thấy <span>{filteredBooks.length}</span> cuốn sách
              </p>
              
              <button onClick={() => setMobileFilterOpen(true)} className={styles.mobileFilterBtn}>
                <Filter size={14} /> Bộ lọc
              </button>
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
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc mở rộng bộ lọc của bạn.
                </p>
                <button onClick={clearFilters} className={styles.btnPrimary}>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className={styles.mobileBackdrop}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className={styles.mobileDrawer}
            >
              <div className={styles.drawerHandle} />
              
              <div className={styles.filterHeader}>
                <h3><Filter size={18} /> Bộ lọc sách</h3>
                <button onClick={() => { clearFilters(); setMobileFilterOpen(false); }} className={styles.btnClearFilterRed}>
                  Xóa lọc
                </button>
              </div>

              {/* Radius */}
              <div className={styles.filterGroup}>
                <h4>Bán kính xung quanh</h4>
                <div className={styles.filterGrid4}>
                  {["1km", "3km", "5km", "10km"].map((rad) => (
                    <button
                      key={rad}
                      onClick={() => setActiveRadius(rad)}
                      className={`${styles.filterBtn} ${activeRadius === rad ? styles.filterBtnActive : ""}`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className={styles.filterGroup}>
                <h4>Tình trạng sách</h4>
                <div className={styles.filterGrid2}>
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "new", label: "Mới / Như mới" },
                    { id: "good", label: "Còn tốt" },
                    { id: "old", label: "Đã cũ" }
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      onClick={() => setSelectedCondition(cond.id)}
                      className={`${styles.filterBtn} ${selectedCondition === cond.id ? styles.filterBtnActive : ""}`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className={styles.btnPrimaryFull}
              >
                Áp dụng bộ lọc
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
