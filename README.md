# Lê Đình Khiêm - Android Developer Portfolio

Trang web Portfolio cá nhân hiện đại, trực quan và có tính tương tác cao dành cho Android Developer, được thiết kế theo phong cách Dark Mode cao cấp với tông màu tươi mát **Mint Green & Teal/Cyan**.

Trang web này được tối ưu hóa đầy đủ cho việc hiển thị trên mọi thiết bị (Mobile, Tablet, Desktop) và sẵn sàng để lưu trữ trên GitHub Pages.

## 🚀 Tính Năng Nổi Bật

- **Thiết kế Premium & Dark Mode**: Bố cục hiện đại, độ tương phản cao kết hợp hiệu ứng kính mờ (Glassmorphism) và các vòng tròn mờ ảo chuyển động chậm ở nền.
- **Đồ họa Động ở Hero Section**: Vòng tròn stack công nghệ di động xoay ngược chiều nhau quanh một lõi thông minh phát sáng, với các icon lập trình tự động căn thẳng đứng.
- **Hiệu Ứng Chữ Chạy (Typing Effect)**: Tự động gõ giới thiệu các vai trò chuyên môn như Android Developer, Mobile Engineer... ở ngay đầu trang.
- **Hiệu Ứng Xuất Hiện Khi Cuộn (Scroll Reveal)**: Các phần nội dung tự động trượt lên và hiện ra mượt mà khi người dùng cuộn tới bằng cách sử dụng `IntersectionObserver` tối ưu hiệu năng.
- **Thanh Điều Hướng Thông Minh**: Cố định (Sticky Header) tự động áp dụng hiệu ứng kính mờ khi cuộn trang và tự động đổi màu (Active Highlight) theo phần nội dung đang xem.
- **Form Liên Hệ Tương Tác**: Xử lý gửi tin nhắn giả lập có vòng xoay tải dữ liệu (Loading Spinner) và hiện thông báo thành công đẹp mắt.

## 🛠️ Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc ngữ nghĩa (Semantic HTML) chuẩn SEO và dễ tiếp cận.
- **CSS3 (Vanilla)**: Hệ thống Design System đồng bộ qua CSS Variables, Flexbox/Grid layouts và CSS Animations mượt mà không cần Tailwind.
- **JavaScript (Vanilla)**: Xử lý toàn bộ logic tương tác mượt mà mà không phụ thuộc vào thư viện bên ngoài nặng nề.
- **Lucide Icons**: Bộ sưu tập icon dạng vector sắc nét hiển thị hoàn hảo trên màn hình Retina.
- **Google Fonts**: Sử dụng font chữ **Outfit** (Tiêu đề) và **Inter** (Nội dung).

## 💻 Hướng Dẫn Chạy Dưới Local

Bạn có thể chạy thử trực tiếp trang web trên máy tính cá nhân theo các cách sau:

### Cách 1: Mở trực tiếp
Nhấp đúp chuột vào file `index.html` để mở trực tiếp trên bất kỳ trình duyệt web nào.

### Cách 2: Sử dụng Local Web Server (Khuyên dùng)
Để các hiệu ứng tải font và icon hoạt động mượt mà nhất, hãy chạy một server tĩnh nội bộ:

Sử dụng Node.js/npm:
```bash
# Cài đặt và chạy http-server nhanh không cần tải về
npx http-server -p 8080
```
Sau đó truy cập địa chỉ: [http://127.0.0.1:8080](http://127.0.0.1:8080)

## 🌐 Deploy Lên GitHub Pages

Vì dự án được xây dựng hoàn toàn từ các file tĩnh (`index.html`, `style.css`, `script.js`), việc deploy lên GitHub Pages cực kỳ đơn giản:

1. Đẩy mã nguồn lên repository GitHub có tên trùng với tên miền của bạn (ví dụ: `khiemledinh.github.io`):
   ```bash
   git add .
   git commit -m "feat: add README.md and complete portfolio"
   git push origin main
   ```
2. Truy cập vào **Settings** của repository trên GitHub -> Chọn mục **Pages**.
3. Tại phần **Build and deployment**, đảm bảo nguồn chọn là **Deploy from a branch** và chọn nhánh `main` (hoặc `master`).
4. Nhấn **Save**. Trang web sẽ tự động được xuất bản tại địa chỉ `https://khiemledinh.github.io/` sau vài phút.
