export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  favoriteGenres?: string[];
}

const AUTH_USER_KEY = 'cinemora_current_user';
const USERS_DATABASE_KEY = 'cinemora_registered_users';

export const authStorage = {
  // Lấy người dùng đang đăng nhập
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Đăng ký tài khoản mới
  register(name: string, email: string, password: string): { success: boolean; message: string; user?: UserProfile } {
    try {
      const usersStr = localStorage.getItem(USERS_DATABASE_KEY);
      const users: Array<UserProfile & { password: string }> = usersStr ? JSON.parse(usersStr) : [];

      // Kiểm tra email trùng
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email này đã được đăng ký tài khoản!' };
      }

      const newUser: UserProfile & { password: string } = {
        id: 'usr_' + Date.now(),
        name,
        email,
        password,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      };

      users.push(newUser);
      localStorage.setItem(USERS_DATABASE_KEY, JSON.stringify(users));

      // Tự động đăng nhập
      const userProfile: UserProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinedDate: newUser.joinedDate,
        avatar: newUser.avatar
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));

      return { success: true, message: 'Đăng ký thành công!', user: userProfile };
    } catch (e) {
      return { success: false, message: 'Lỗi khi lưu trữ tài khoản!' };
    }
  },

  // Đăng nhập
  login(email: string, password: string): { success: boolean; message: string; user?: UserProfile } {
    try {
      const usersStr = localStorage.getItem(USERS_DATABASE_KEY);
      const users: Array<UserProfile & { password: string }> = usersStr ? JSON.parse(usersStr) : [];

      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!found) {
        return { success: false, message: 'Email hoặc mật khẩu không chính xác!' };
      }

      const userProfile: UserProfile = {
        id: found.id,
        name: found.name,
        email: found.email,
        joinedDate: found.joinedDate,
        avatar: found.avatar
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));
      return { success: true, message: 'Đăng nhập thành công!', user: userProfile };
    } catch {
      return { success: false, message: 'Lỗi hệ thống khi đăng nhập!' };
    }
  },

  // Tạo mã xác minh khôi phục mật khẩu (OTP) gửi đến email
  sendResetCode(email: string): { success: boolean; message: string; mockOtp?: string } {
    try {
      const usersStr = localStorage.getItem(USERS_DATABASE_KEY);
      const users: Array<UserProfile & { password: string }> = usersStr ? JSON.parse(usersStr) : [];

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { success: false, message: 'Email này chưa được đăng ký trong hệ thống!' };
      }

      // Tạo mã OTP 6 chữ số ngẫu nhiên
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem('reset_otp_' + email.toLowerCase(), JSON.stringify({
        code: otp,
        expiresAt: Date.now() + 5 * 60 * 1000 // Hết hạn sau 5 phút
      }));

      return { 
        success: true, 
        message: `Mã bảo mật 6 số đã được tạo cho email ${email}!`, 
        mockOtp: otp 
      };
    } catch {
      return { success: false, message: 'Lỗi khi gửi mã xác nhận!' };
    }
  },

  // Xác minh mã OTP và cập nhật mật khẩu mới an toàn
  verifyAndResetPassword(email: string, otpCode: string, newPassword: string): { success: boolean; message: string } {
    try {
      const savedOtpStr = sessionStorage.getItem('reset_otp_' + email.toLowerCase());
      if (!savedOtpStr) {
        return { success: false, message: 'Yêu cầu đặt lại mật khẩu đã hết hạn hoặc chưa gửi mã!' };
      }

      const { code, expiresAt } = JSON.parse(savedOtpStr);
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem('reset_otp_' + email.toLowerCase());
        return { success: false, message: 'Mã xác nhận đã hết hạn (chỉ có hiệu lực trong 5 phút)!' };
      }

      if (code !== otpCode.trim()) {
        return { success: false, message: 'Mã xác nhận bảo mật không đúng! Vui lòng kiểm tra lại.' };
      }

      // Đổi mật khẩu
      const usersStr = localStorage.getItem(USERS_DATABASE_KEY);
      const users: Array<UserProfile & { password: string }> = usersStr ? JSON.parse(usersStr) : [];
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex === -1) {
        return { success: false, message: 'Không tìm thấy người dùng!' };
      }

      users[userIndex].password = newPassword;
      localStorage.setItem(USERS_DATABASE_KEY, JSON.stringify(users));
      sessionStorage.removeItem('reset_otp_' + email.toLowerCase());

      return { success: true, message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.' };
    } catch {
      return { success: false, message: 'Lỗi hệ thống khi cập nhật mật khẩu!' };
    }
  },

  // Đăng xuất
  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};
