import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  loginCustomer,
  findAccountForReset,
  sendForgotOtp,
  verifyForgotOtp,
  resetPasswordWithToken
} from "../../services/authService";
import "../../css/Auth.css";

function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Form states for normal login
  const [email, setEmail] = useState(() => localStorage.getItem("user_registered_email") || "");
  const [password, setPassword] = useState("");

  // Mode state: 'login' | 'forgot_find' | 'forgot_channel' | 'forgot_otp' | 'forgot_reset' | 'forgot_done'
  const [mode, setMode] = useState("login");

  // Forgot password flow state variables
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [accountInfo, setAccountInfo] = useState(null); // { userId, username, maskedEmail, maskedPhone, hasEmail, hasPhone }
  const [selectedChannel, setSelectedChannel] = useState("email");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status & loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validateEmailFormat = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val?.trim());
  };

  // ==========================================
  // 1. Normal Customer Login
  // ==========================================
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (!validateEmailFormat(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const authData = await loginCustomer({ email: cleanEmail, password });
      
      login({
        token: authData.token,
        userId: authData.userId,
        customerId: authData.customerId || authData.userId,
        username: authData.username || "Customer",
        email: authData.email || cleanEmail,
        phoneNumber: authData.phoneNumber || localStorage.getItem("user_registered_phone") || "",
        role: "Customer",
        roleId: 5
      });

      navigate("/customer/dashboard");
    } catch (err) {
      console.error("Customer login error:", err);
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || err.message || "Login failed. Please check your email and password.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. Forgot Password Flow Step 1: Find Account
  // ==========================================
  const handleFindAccount = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!forgotIdentifier.trim()) {
      setErrorMsg("Please enter your registered email address or phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await findAccountForReset(forgotIdentifier.trim());
      setAccountInfo(res);
      // Pre-select available channel
      if (res.hasEmail) {
        setSelectedChannel("email");
      } else if (res.hasPhone) {
        setSelectedChannel("sms");
      }
      setMode("forgot_channel");
    } catch (err) {
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || "No account found matching that email or phone number.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. Forgot Password Flow Step 2: Send OTP
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!accountInfo?.userId) {
      setErrorMsg("Session expired. Please try searching for your account again.");
      setMode("forgot_find");
      return;
    }

    setLoading(true);
    try {
      const res = await sendForgotOtp(accountInfo.userId, selectedChannel);
      setSuccessMsg(res.message || `OTP sent successfully to your registered ${selectedChannel === "sms" ? "SMS phone number" : "Email"}.`);
      setMode("forgot_otp");
    } catch (err) {
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || "Failed to send OTP code. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. Forgot Password Flow Step 3: Verify OTP
  // ==========================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyForgotOtp(accountInfo.userId, otpCode.trim());
      setResetToken(res.resetToken);
      setSuccessMsg("OTP verified successfully! Create a new password below.");
      setMode("forgot_reset");
    } catch (err) {
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || "Invalid or expired OTP code. OTPs are valid for 5 minutes.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5. Forgot Password Flow Step 4: Reset Password
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-type your confirm password.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithToken(accountInfo.userId, resetToken, newPassword);
      setSuccessMsg(res.message || "Your password has been successfully reset.");
      setMode("forgot_done");
    } catch (err) {
      const respData = err.response?.data;
      const msg = typeof respData === "string" ? respData : respData?.message || "Password reset failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForgotState = () => {
    setMode("login");
    setErrorMsg("");
    setSuccessMsg("");
    setForgotIdentifier("");
    setAccountInfo(null);
    setOtpCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-page-container centered-container">
      <div className="auth-card-wrapper glass-panel">
        <div className="auth-header">
          <span className="badge-pill badge-primary">
            {mode === "login" ? "Customer Access" : "Account Recovery"}
          </span>
          <h2>
            {mode === "login"
              ? "Customer Sign In"
              : mode === "forgot_done"
              ? "Password Reset Complete"
              : "Reset Your Password"}
          </h2>
          <p>
            {mode === "login"
              ? "Sign in to manage your shopping cart, wishlists, and track orders."
              : mode === "forgot_done"
              ? "Your password has been updated. You may now log into your account."
              : "Verify your identity using an Email or SMS OTP code to reset your password."}
          </p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}
        {successMsg && (
          <div
            className="auth-success-alert"
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid #10b981",
              color: "#10b981",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "0.88rem"
            }}
          >
            {successMsg}
          </div>
        )}

        {/* MODE: NORMAL LOGIN */}
        {mode === "login" && (
          <form className="auth-form" onSubmit={handleCustomerLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  className="auth-link-text"
                  onClick={() => {
                    setErrorMsg("");
                    setSuccessMsg("");
                    setForgotIdentifier(email);
                    setMode("forgot_find");
                  }}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.82rem", color: "var(--accent-color, #6366f1)" }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ marginTop: "6px" }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-block"
                onClick={() => {
                  setEmail("customer@webkadai.com");
                  setPassword("Customer@123!");
                }}
                style={{ background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.4)", color: "#818cf8", width: "100%", padding: "10px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
              >
                ⚡ Fill Quick Demo Credentials (customer@webkadai.com)
              </button>
            </div>
          </form>
        )}

        {/* MODE: FORGOT STEP 1 - FIND ACCOUNT */}
        {mode === "forgot_find" && (
          <form className="auth-form" onSubmit={handleFindAccount}>
            <div className="form-group">
              <label className="form-label">Registered Email or Phone Number</label>
              <input
                type="text"
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                placeholder="Enter your email or 10-digit phone"
                required
              />
              <small style={{ color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                We'll check our database for your registered user account.
              </small>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Searching Account..." : "Find Account"}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-block"
              style={{ marginTop: "10px" }}
              onClick={resetForgotState}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* MODE: FORGOT STEP 2 - SELECT CHANNEL (EMAIL vs SMS) */}
        {mode === "forgot_channel" && accountInfo && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-medium, rgba(255,255,255,0.1))", marginBottom: "16px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Account Found:</div>
              <strong style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>{accountInfo.username}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Choose OTP Delivery Method</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
                {accountInfo.hasEmail && (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: selectedChannel === "email" ? "2px solid #6366f1" : "1px solid var(--border-medium)",
                      background: selectedChannel === "email" ? "rgba(99, 102, 241, 0.1)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="radio"
                      name="channel"
                      value="email"
                      checked={selectedChannel === "email"}
                      onChange={() => setSelectedChannel("email")}
                    />
                    <div>
                      <strong>Send OTP via Email</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{accountInfo.maskedEmail}</div>
                    </div>
                  </label>
                )}

                {accountInfo.hasPhone && (
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: selectedChannel === "sms" ? "2px solid #6366f1" : "1px solid var(--border-medium)",
                      background: selectedChannel === "sms" ? "rgba(99, 102, 241, 0.1)" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="radio"
                      name="channel"
                      value="sms"
                      checked={selectedChannel === "sms"}
                      onChange={() => setSelectedChannel("sms")}
                    />
                    <div>
                      <strong>Send OTP via SMS</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{accountInfo.maskedPhone}</div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Sending 6-Digit OTP..." : `Send OTP Code to ${selectedChannel === "sms" ? "SMS" : "Email"}`}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-block"
              style={{ marginTop: "10px" }}
              onClick={() => setMode("forgot_find")}
            >
              ← Search Different Account
            </button>
          </form>
        )}

        {/* MODE: FORGOT STEP 3 - VERIFY OTP */}
        {mode === "forgot_otp" && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">Enter 6-Digit Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                style={{ letterSpacing: "6px", fontSize: "1.4rem", textAlign: "center", fontWeight: "bold" }}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <span>OTP expires in <strong>5 minutes</strong></span>
                <span>Single-use security code</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Verifying..." : "Verify Security Code"}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm btn-block"
              style={{ marginTop: "10px" }}
              onClick={() => setMode("forgot_channel")}
            >
              ← Resend / Change Channel
            </button>
          </form>
        )}

        {/* MODE: FORGOT STEP 4 - RESET PASSWORD */}
        {mode === "forgot_reset" && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password (min 6 characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create new strong password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? "Updating Password..." : "Update & Save Password"}
            </button>
          </form>
        )}

        {/* MODE: FORGOT STEP 5 - DONE CONFIRMATION */}
        {mode === "forgot_done" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>✅</div>
            <p style={{ marginBottom: "20px", color: "var(--text-muted)" }}>
              Your password has been successfully reset. You can now log into your account using your email and new password.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={resetForgotState}
            >
              Return to Sign In
            </button>
          </div>
        )}

        <div className="auth-footer-links">
          <Link to="/register" className="auth-link-text">
            New to AURA Luxe? <strong>Create an account</strong>
          </Link>
          <Link to="/login" className="back-link">
            Return to Portal Chooser
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;