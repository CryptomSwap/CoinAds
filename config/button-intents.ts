/**
 * Button Intent Configuration
 * 
 * Maps button identifiers to their intended behavior.
 * Used by ButtonBinder to provide consistent button behavior across the app.
 */

export type ButtonIntent =
  | { type: "nav"; to: string; requiresAuth?: boolean; role?: "ADVERTISER" | "PUBLISHER" | "ADMIN" }
  | { type: "action"; id: string; requiresAuth?: boolean; role?: "ADVERTISER" | "PUBLISHER" | "ADMIN" };

export const BUTTON_INTENTS: Record<string, ButtonIntent> = {
  // Marketing & Public Pages
  "btn-start-advertising": { type: "nav", to: "/auth/signup?role=advertiser" },
  "btn-start-publishing": { type: "nav", to: "/auth/signup?role=publisher" },
  "btn-sign-in": { type: "nav", to: "/auth/signin" },
  "btn-sign-up": { type: "nav", to: "/auth/signup" },
  "btn-contact": { type: "nav", to: "/contact" },
  "btn-schedule-demo": { type: "nav", to: "/contact?subject=Schedule%20Demo" },
  "btn-view-docs": { type: "nav", to: "/docs/publisher-integration" },
  "btn-learn-more": { type: "nav", to: "/about" },

  // Advertiser Actions
  "btn-create-campaign": { type: "nav", to: "/app/advertiser/campaigns/new", requiresAuth: true, role: "ADVERTISER" },
  "btn-upload-creative": { type: "nav", to: "/app/advertiser/creatives", requiresAuth: true, role: "ADVERTISER" },
  "btn-top-up-wallet": { type: "nav", to: "/app/advertiser/wallet", requiresAuth: true, role: "ADVERTISER" },
  "btn-view-reports": { type: "nav", to: "/app/advertiser/reports", requiresAuth: true, role: "ADVERTISER" },
  "btn-advertiser-dashboard": { type: "nav", to: "/app/advertiser/overview", requiresAuth: true, role: "ADVERTISER" },
  "btn-export-campaigns": { type: "action", id: "export-campaigns", requiresAuth: true, role: "ADVERTISER" },
  "btn-preview-creative": { type: "action", id: "preview-creative", requiresAuth: true, role: "ADVERTISER" },
  "btn-edit-campaign": { type: "action", id: "edit-campaign", requiresAuth: true, role: "ADVERTISER" },
  "btn-pause-campaign": { type: "action", id: "pause-campaign", requiresAuth: true, role: "ADVERTISER" },
  "btn-delete-campaign": { type: "action", id: "delete-campaign", requiresAuth: true, role: "ADVERTISER" },
  "btn-associate-creative": { type: "action", id: "associate-creative", requiresAuth: true, role: "ADVERTISER" },
  "btn-delete-creative": { type: "action", id: "delete-creative", requiresAuth: true, role: "ADVERTISER" },

  // Publisher Actions
  "btn-add-site": { type: "nav", to: "/app/publisher/sites/new", requiresAuth: true, role: "PUBLISHER" },
  "btn-new-placement": { type: "nav", to: "/app/publisher/placements/new", requiresAuth: true, role: "PUBLISHER" },
  "btn-request-payout": { type: "nav", to: "/app/publisher/payouts", requiresAuth: true, role: "PUBLISHER" },
  "btn-publisher-dashboard": { type: "nav", to: "/app/publisher/overview", requiresAuth: true, role: "PUBLISHER" },
  "btn-view-earnings": { type: "nav", to: "/app/publisher/earnings", requiresAuth: true, role: "PUBLISHER" },
  "btn-generate-tag": { type: "action", id: "generate-tag", requiresAuth: true, role: "PUBLISHER" },
  "btn-verify-site": { type: "action", id: "verify-site", requiresAuth: true, role: "PUBLISHER" },
  "btn-export-earnings": { type: "action", id: "export-earnings", requiresAuth: true, role: "PUBLISHER" },
  "btn-export-sites": { type: "action", id: "export-sites", requiresAuth: true, role: "PUBLISHER" },

  // Admin Actions
  "btn-admin-approvals": { type: "nav", to: "/app/admin/approvals", requiresAuth: true, role: "ADMIN" },
  "btn-admin-dashboard": { type: "nav", to: "/app/admin/overview", requiresAuth: true, role: "ADMIN" },
  "btn-manage-users": { type: "nav", to: "/app/admin/users", requiresAuth: true, role: "ADMIN" },
  "btn-view-logs": { type: "nav", to: "/app/admin/logs", requiresAuth: true, role: "ADMIN" },
  "btn-manage-pricing": { type: "nav", to: "/app/admin/pricing", requiresAuth: true, role: "ADMIN" },
  "btn-approve": { type: "action", id: "approve", requiresAuth: true, role: "ADMIN" },
  "btn-reject": { type: "action", id: "reject", requiresAuth: true, role: "ADMIN" },
  "btn-edit-pricing": { type: "action", id: "edit-pricing", requiresAuth: true, role: "ADMIN" },
  "btn-edit-pacing": { type: "action", id: "edit-pacing", requiresAuth: true, role: "ADMIN" },

  // Common Actions
  "btn-save": { type: "action", id: "save", requiresAuth: true },
  "btn-cancel": { type: "action", id: "cancel" },
  "btn-delete": { type: "action", id: "delete", requiresAuth: true },
  "btn-edit": { type: "action", id: "edit", requiresAuth: true },
  "btn-refresh": { type: "action", id: "refresh" },
  "btn-export": { type: "action", id: "export", requiresAuth: true },
  "btn-download": { type: "action", id: "download", requiresAuth: true },
  "btn-upload": { type: "action", id: "upload", requiresAuth: true },
  "btn-submit": { type: "action", id: "submit", requiresAuth: true },
  "btn-reset": { type: "action", id: "reset" },
  "btn-close": { type: "action", id: "close" },
  "btn-back": { type: "action", id: "back" },
  "btn-next": { type: "action", id: "next" },
  "btn-previous": { type: "action", id: "previous" },

  // Settings & Profile
  "btn-save-settings": { type: "action", id: "save-settings", requiresAuth: true },
  "btn-save-preferences": { type: "action", id: "save-preferences", requiresAuth: true },
  "btn-save-privacy": { type: "action", id: "save-privacy", requiresAuth: true },
  "btn-change-password": { type: "action", id: "change-password", requiresAuth: true },
  "btn-update-profile": { type: "action", id: "update-profile", requiresAuth: true },

  // Support & Help
  "btn-live-chat": { type: "action", id: "live-chat", requiresAuth: true },
  "btn-contact-support": { type: "nav", to: "/contact?subject=Support" },
  "btn-view-help": { type: "nav", to: "/docs" },

  // Wallet & Financial
  "btn-withdraw": { type: "action", id: "withdraw", requiresAuth: true },
  "btn-deposit": { type: "action", id: "deposit", requiresAuth: true },
  "btn-view-transactions": { type: "nav", to: "/app/transactions", requiresAuth: true },
  "btn-view-billing": { type: "nav", to: "/app/billing", requiresAuth: true },

  // Notifications
  "btn-save-notifications": { type: "action", id: "save-notifications", requiresAuth: true },
  "btn-mark-read": { type: "action", id: "mark-read", requiresAuth: true },
  "btn-clear-notifications": { type: "action", id: "clear-notifications", requiresAuth: true },

  // Cookie Preferences
  "btn-save-cookies": { type: "action", id: "save-cookies" },
  "btn-accept-all": { type: "action", id: "accept-all-cookies" },
  "btn-reject-all": { type: "action", id: "reject-all-cookies" },
  "btn-customize": { type: "action", id: "customize-cookies" },

  // Theme & UI
  "btn-toggle-theme": { type: "action", id: "toggle-theme" },
  "btn-toggle-sidebar": { type: "action", id: "toggle-sidebar" },

  // Error & Recovery
  "btn-retry": { type: "action", id: "retry" },
  "btn-reload": { type: "action", id: "reload" },
  "btn-go-home": { type: "nav", to: "/" },
  "btn-go-back": { type: "action", id: "go-back" },
};

/**
 * Get intent by key with fallback
 */
export function getButtonIntent(key: string): ButtonIntent | null {
  return BUTTON_INTENTS[key] || null;
}

/**
 * Check if a button intent requires authentication
 */
export function requiresAuth(intent: ButtonIntent): boolean {
  return intent.requiresAuth === true;
}

/**
 * Check if a button intent requires a specific role
 */
export function requiresRole(intent: ButtonIntent, userRole?: string): boolean {
  if (!intent.role) return true;
  return userRole === intent.role;
}
