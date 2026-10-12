# 🎬 CINEMORA — Nền Tảng Xem Phim Thế Hệ Mới

> **“Every Story Has a Universe.”**

CINEMORA là nền tảng streaming phim trực tuyến hiện đại với bản sắc thiết kế **Cinematic Futurism**, lấy cảm hứng từ Apple TV+ và các giao diện rạp chiếu cao cấp nhưng mang phong cách nhận diện riêng: Midnight Black (`#08090D`), Electric Violet (`#8B5CF6`) và Aurora Cyan (`#45E6E0`).

---

## 🌟 Tính Năng Nổi Bật

1. **Cinematic Hero**:
   - Banner chuyển cảnh mượt mà, typography đậm chất điện ảnh, radial glow xung quanh poster phim.
   - Hiển thị thông số phim thực tế (Rating IMDb, Năm phát hành, Chất lượng 4K/FHD, Thời lượng, Thể loại).
   - Bộ chọn slide thumbnail tương tác trực tiếp ở góc dưới.

2. **Dữ Liệu Thật & Movie Provider Adapter ([`src/services/movieProvider.ts`](src/services/movieProvider.ts))**:
   - Tích hợp API chuẩn hóa dữ liệu phim Việt Nam / Quốc tế (hỗ trợ phim lẻ, phim bộ, anime, tv-shows, tìm kiếm từ khóa và chi tiết tập phim).
   - Bộ nhớ đệm **In-memory Cache (5 phút)** giúp tải trang tức thì, giảm tải request trùng lặp.
   - Cơ chế **Fallback an toàn**: Tự động chuyển sang dữ liệu dự phòng chuẩn mực nếu kết nối mạng bên ngoài bị gián đoạn.

3. **Cinematic Discovery**:
   - Khám phá phim thông minh theo cảm xúc người xem: *Hồi hộp & Kịch tính*, *Nhẹ nhàng & Chữa lành*, *Khoa học viễn tưởng*, *Thế giới Anime*.

4. **Trang Khám Phá & Bộ Lọc Đa Năng ([`/explore`](src/pages/ExplorePage.tsx))**:
   - Tìm kiếm theo từ khóa tức thì.
   - Lọc theo phân loại: *Phim Mới Cập Nhật*, *Phim Lẻ*, *Phim Bộ*, *Anime*, *TV Shows*.
   - Phân trang mượt mà, đồng bộ trạng thái trực tiếp với URL query parameters.

5. **Trang Chi Tiết Phim Editorial ([`/movie/:slug`](src/pages/MovieDetailPage.tsx))**:
   - Backdrop khổ lớn, poster 2:3 với viền neon violet phát sáng.
   - Đầy đủ đạo diễn, dàn diễn viên, tóm tắt nội dung, chất lượng bản dịch.
   - Danh sách tập có thể click xem trực tiếp.
   - Hàng phim tương tự đề xuất tự động.

6. **Trình Phát Video Chuẩn Điện Ảnh ([`/watch/:slug`](src/pages/WatchPage.tsx))**:
   - Player video hỗ trợ cả `iframe embed` và `HTML5 / M3U8 video stream`.
   - Chọn nhanh tập trước / tập tiếp theo.
   - Chuyển đổi giữa các máy chủ (VIP 1, VIP 2...).
   - Bảng chọn tập phim cuộn mượt mà.
   - **Tự động lưu tiến độ**: Ghi nhớ tập bạn đang xem để bạn có thể tiếp tục xem bất cứ lúc nào.

7. **Bộ Sưu Tập Của Tôi ([`/my-list`](src/pages/MyListPage.tsx))**:
   - Lưu trữ phim yêu thích (Bookmarks) offline qua `localStorage`.
   - Quản lý lịch sử xem phim và nút **"Xem Tiếp"** tập đang dừng.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, Vite, TypeScript (Strict Mode).
- **Styling:** Tailwind CSS (Theme Cinematic Futurism, Midnight Palette).
- **Icons:** Lucide React.
- **Routing:** React Router DOM v7.
- **Lưu trữ cục bộ:** `localStorage` persistence cho Watch History & My List.

---

## 🚀 Cài Đặt Và Chạy Dự Án

### Yêu cầu:
- Node.js version 18+ trở lên.
- Trình quản lý gói `npm`.

### Khởi chạy:
```bash
# 1. Cài đặt thư viện (nếu chưa cài)
npm install

# 2. Khởi động môi trường phát triển
npm run dev
```

Mở trình duyệt tại đường dẫn: **`http://localhost:5173`**

### Kiểm tra build sản phẩm:
```bash
npm run build
```
Build hoàn tất đạt chuẩn production với 0 lỗi TypeScript và 0 cảnh báo.
