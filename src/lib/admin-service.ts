import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type AdminUserRow = Tables<"admin_users">;
export type AdminUser = Omit<AdminUserRow, "password_hash">;
export type AdminUserCreate = Omit<
  AdminUserRow,
  "id" | "created_at" | "updated_at" | "last_login"
>;
type AdminUserUpdate = Partial<Omit<AdminUserRow, "id" | "created_at">>;

const ADMIN_USER_SELECT =
  "id, username, email, role, is_active, last_login, created_at, updated_at";

/**
 * Admin login (local authentication)
 * For production, use Supabase Auth
 */
export const adminLogin = async (
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: AdminUser }> => {
  try {
    // This is a simplified version - in production, use Supabase Auth
    // For now, use hardcoded credentials (as in AdminLogin.tsx)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "hackathon2026";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = btoa(JSON.stringify({ username, timestamp: Date.now() }));
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminToken", token);

      return {
        success: true,
        token,
        user: {
          id: 1,
          username,
          email: "admin@aihmackathon.com",
          role: "super_admin",
          is_active: true,
          last_login: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

/**
 * Admin logout
 */
export const adminLogout = (): void => {
  localStorage.removeItem("adminAuth");
  localStorage.removeItem("adminToken");
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem("adminAuth") === "true";
};

/**
 * Get authenticated admin user
 */
export const getAuthenticatedAdmin = (): AdminUser | null => {
  if (!isAdminAuthenticated()) {
    return null;
  }

  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;

    const decoded = JSON.parse(atob(token));
    return {
      id: 1,
      username: decoded.username,
      email: "admin@aihmackathon.com",
      role: "super_admin",
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error getting authenticated admin:", error);
    return null;
  }
};

/**
 * Fetch admin user by ID
 */
export const getAdminById = async (id: number): Promise<AdminUser> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select(ADMIN_USER_SELECT)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to fetch admin user");
    }

    return data as AdminUser;
  } catch (error) {
    console.error("Error fetching admin user:", error);
    throw error;
  }
};

/**
 * Get all admin users
 */
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select(ADMIN_USER_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message || "Failed to fetch admin users");
    }

    return data as AdminUser[];
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

/**
 * Create a new admin user
 */
export const createAdminUser = async (
  adminData: AdminUserCreate
): Promise<AdminUser> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .insert([adminData])
      .select(ADMIN_USER_SELECT)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create admin user");
    }

    return data as AdminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

/**
 * Update admin user
 */
export const updateAdminUser = async (
  id: number,
  updates: AdminUserUpdate
): Promise<AdminUser> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select(ADMIN_USER_SELECT)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update admin user");
    }

    return data as AdminUser;
  } catch (error) {
    console.error("Error updating admin user:", error);
    throw error;
  }
};

/**
 * Deactivate admin user (soft delete)
 */
export const deactivateAdminUser = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from("admin_users")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to deactivate admin user");
    }
  } catch (error) {
    console.error("Error deactivating admin user:", error);
    throw error;
  }
};

/**
 * Update admin's last login
 */
export const updateAdminLastLogin = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to update last login");
    }
  } catch (error) {
    console.error("Error updating last login:", error);
    throw error;
  }
};
