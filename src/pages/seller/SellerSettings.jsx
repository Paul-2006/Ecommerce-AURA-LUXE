import { useState } from "react";
import { Settings, Lock, Bell, Globe, Key, ShieldAlert, CheckCircle2, Save } from "lucide-react";
import "../../css/SellerPortal.css";

function SellerSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockThreshold: 10,
    dailySummaryEmail: true,
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST +5:30)",
    apiKey: "ak_live_98a7f6e5d4c3b2a10987654321098765",
    webhookUrl: "https://api.auraluxestore.com/webhooks/orders",
    twoFactorEnabled: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [passError, setPassError] = useState("");

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Seller Portal settings saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPassError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError("New password and confirmation do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassError("Password must be at least 6 characters long.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccessMsg("Password updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 800);
  };

  return (
    <div className="seller-page-container">
      {/* Header */}
      <div className="seller-page-header">
        <div>
          <h1 className="seller-page-title">Settings</h1>
          <p className="seller-page-subtitle">
            Configure account security, automated email notifications, API webhooks, and preferences
          </p>
        </div>
        <button type="submit" form="seller-settings-form" className="btn btn-primary" disabled={saving}>
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? "Saving..." : "Save Preferences"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="seller-alert seller-alert-success mb-4">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {passError && (
        <div className="seller-alert seller-alert-danger mb-4">
          <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          <span>{passError}</span>
        </div>
      )}

      <div className="seller-grid seller-grid-3">
        {/* Main Settings Column (2 Spans) */}
        <div className="seller-col-span-2 space-y-6">
          <form id="seller-settings-form" onSubmit={handleSubmitSettings} className="space-y-6">
            {/* Notifications & Thresholds */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Notifications & Automation
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>Instant Order Email Alerts</h4>
                    <p style={{ margin: 0, fontSize: "0.825rem", color: "#667085" }}>
                      Receive email notifications immediately when a customer places an order
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.orderAlerts}
                    onChange={() => handleToggle("orderAlerts")}
                    style={{ width: "18px", height: "18px", accentColor: "var(--merchant-accent)" }}
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>Daily Settlement Payout Digest</h4>
                    <p style={{ margin: 0, fontSize: "0.825rem", color: "#667085" }}>
                      Receive a daily summary of total net sales and bank transfer status
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailySummaryEmail}
                    onChange={() => handleToggle("dailySummaryEmail")}
                    style={{ width: "18px", height: "18px", accentColor: "var(--merchant-accent)" }}
                  />
                </div>

                <div>
                  <label className="seller-form-label">Low Stock Warning Threshold (Units)</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    className="seller-form-input"
                    value={settings.lowStockThreshold}
                    onChange={handleInputChange}
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              </div>
            </div>

            {/* API Keys & Webhooks */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Key className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Developer API & Webhooks
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div>
                  <label className="seller-form-label">Merchant Live API Key</label>
                  <input
                    type="text"
                    name="apiKey"
                    className="seller-form-input"
                    value={settings.apiKey}
                    readOnly
                    style={{ backgroundColor: "#F8FAF9", fontFamily: "monospace" }}
                  />
                </div>

                <div>
                  <label className="seller-form-label">Order Webhook Event URL</label>
                  <input
                    type="url"
                    name="webhookUrl"
                    className="seller-form-input"
                    value={settings.webhookUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Localization & Region */}
            <div className="seller-card">
              <div className="seller-card-header">
                <h3 className="seller-card-title flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                  Regional & Currency Configuration
                </h3>
              </div>
              <div className="seller-card-body space-y-4">
                <div className="seller-grid seller-grid-2 gap-4">
                  <div>
                    <label className="seller-form-label">Display Currency</label>
                    <input
                      type="text"
                      name="currency"
                      className="seller-form-input"
                      value={settings.currency}
                      readOnly
                      style={{ backgroundColor: "#F8FAF9" }}
                    />
                  </div>
                  <div>
                    <label className="seller-form-label">Operating Timezone</label>
                    <input
                      type="text"
                      name="timezone"
                      className="seller-form-input"
                      value={settings.timezone}
                      readOnly
                      style={{ backgroundColor: "#F8FAF9" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Side Password / Security Column (1 Span) */}
        <div className="space-y-6">
          {/* Change Password Card */}
          <div className="seller-card">
            <div className="seller-card-header">
              <h3 className="seller-card-title flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Change Account Password
              </h3>
            </div>
            <div className="seller-card-body">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="seller-form-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="seller-form-input"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div>
                  <label className="seller-form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="seller-form-input"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div>
                  <label className="seller-form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="seller-form-input"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          </div>

          {/* Security Status Card */}
          <div className="seller-card">
            <div className="seller-card-header">
              <h3 className="seller-card-title flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-muted-gold" aria-hidden="true" />
                Security Baseline
              </h3>
            </div>
            <div className="seller-card-body space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Two-Factor Auth</span>
                <span className="seller-badge seller-badge-success">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Session Timeout</span>
                <span className="seller-badge seller-badge-info">30 Minutes</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded border" style={{ backgroundColor: "#F8FAF9" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>IP Lockdown</span>
                <span className="seller-badge seller-badge-secondary">Disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerSettings;
