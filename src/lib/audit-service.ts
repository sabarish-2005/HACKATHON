import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type AuditLog = {
  id: number;
  action: string;
  table_name: string;
  record_id?: number | null;
  admin_id?: number | null;
  old_values?: Json | null;
  new_values?: Json | null;
  performed_at: string | null;
};

/**
 * Log an action to audit trail
 */
export const logAuditAction = async (
  action: string,
  tableName: string,
  recordId?: number,
  oldValues?: Json,
  newValues?: Json,
  adminId?: number
): Promise<AuditLog> => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert([
        {
          action,
          table_name: tableName,
          record_id: recordId,
          admin_id: adminId,
          old_values: oldValues,
          new_values: newValues,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to log audit action");
    }

    return data as AuditLog;
  } catch (error) {
    console.error("Error logging audit action:", error);
    throw error;
  }
};

/**
 * Get audit logs for a specific table
 */
export const getAuditLogs = async (
  tableName: string,
  recordId?: number,
  limit: number = 100
): Promise<AuditLog[]> => {
  try {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .eq("table_name", tableName);

    if (recordId) {
      query = query.eq("record_id", recordId);
    }

    query = query.order("performed_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || "Failed to fetch audit logs");
    }

    return (data || []) as AuditLog[];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

/**
 * Get audit logs by action
 */
export const getAuditLogsByAction = async (
  action: string,
  limit: number = 100
): Promise<AuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("action", action)
      .order("performed_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message || "Failed to fetch audit logs");
    }

    return (data || []) as AuditLog[];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

/**
 * Get audit logs by admin
 */
export const getAuditLogsByAdmin = async (
  adminId: number,
  limit: number = 100
): Promise<AuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("admin_id", adminId)
      .order("performed_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message || "Failed to fetch audit logs");
    }

    return (data || []) as AuditLog[];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

/**
 * Get complete history of a record
 */
export const getRecordHistory = async (
  tableName: string,
  recordId: number
): Promise<AuditLog[]> => {
  return getAuditLogs(tableName, recordId);
};

/**
 * Log registration creation
 */
export const logRegistrationCreated = async (
  registrationId: string,
  registrationData: Record<string, any>
): Promise<AuditLog> => {
  return logAuditAction(
    "CREATE",
    "registrations",
    parseInt(registrationId),
    undefined,
    registrationData
  );
};

/**
 * Log registration update
 */
export const logRegistrationUpdated = async (
  registrationId: string,
  oldData: Record<string, any>,
  newData: Record<string, any>
): Promise<AuditLog> => {
  return logAuditAction(
    "UPDATE",
    "registrations",
    parseInt(registrationId),
    oldData,
    newData
  );
};

/**
 * Log registration deletion
 */
export const logRegistrationDeleted = async (
  registrationId: string,
  registrationData: Record<string, any>
): Promise<AuditLog> => {
  return logAuditAction(
    "DELETE",
    "registrations",
    parseInt(registrationId),
    registrationData,
    undefined
  );
};

/**
 * Clean up old audit logs (older than days)
 */
export const cleanupOldAuditLogs = async (daysOld: number = 90): Promise<void> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await supabase
      .from("audit_logs")
      .delete()
      .lt("performed_at", cutoffDate.toISOString());

    if (error) {
      throw new Error(error.message || "Failed to cleanup audit logs");
    }
  } catch (error) {
    console.error("Error cleaning up audit logs:", error);
    throw error;
  }
};
