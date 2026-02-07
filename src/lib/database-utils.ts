import { supabase } from "@/integrations/supabase/client";

type TableName = "registrations" | "admin_users" | "events" | "audit_logs";

/**
 * Database utility functions
 */

/**
 * Test database connection
 */
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("registrations").select("count()", { count: "exact" });
    
    if (error) {
      console.error("Database connection error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error testing database:", error);
    return false;
  }
};

/**
 * Get database health status
 */
export const getDatabaseHealthStatus = async () => {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      return {
        status: "error",
        message: "Unable to connect to database",
        timestamp: new Date().toISOString(),
      };
    }

    // Get table counts
    const { count: registrationCount } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    const { count: eventCount } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    const { count: auditCount } = await supabase
      .from("audit_logs")
      .select("*", { count: "exact", head: true });

    return {
      status: "healthy",
      message: "Database connection successful",
      tables: {
        registrations: registrationCount || 0,
        events: eventCount || 0,
        audit_logs: auditCount || 0,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error checking database health:", error);
    return {
      status: "error",
      message: "Unexpected error checking database health",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Count records in a table
 */
export const countRecords = async (tableName: TableName): Promise<number> => {
  try {
    const { count } = await supabase
      .from(tableName)
      .select("*", { count: "exact", head: true });

    return count || 0;
  } catch (error) {
    console.error(`Error counting records in ${tableName}:`, error);
    return 0;
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const stats = {
      registrations: await countRecords("registrations"),
      events: await countRecords("events"),
      admin_users: await countRecords("admin_users"),
      audit_logs: await countRecords("audit_logs"),
      generated_at: new Date().toISOString(),
    };

    return stats;
  } catch (error) {
    console.error("Error getting database stats:", error);
    throw error;
  }
};

/**
 * Clear all data from a table (dangerous - use with caution)
 * @deprecated Only use in development
 */
export const clearTable = async (tableName: TableName): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot clear table in production");
  }

  try {
    const { error } = await supabase.from(tableName).delete().neq("id", 0);

    if (error) {
      throw new Error(`Failed to clear ${tableName}: ${error.message}`);
    }

    console.warn(`✓ Cleared table: ${tableName}`);
  } catch (error) {
    console.error(`Error clearing table ${tableName}:`, error);
    throw error;
  }
};

/**
 * Reset all tables to initial state (dangerous - development only)
 * @deprecated Only use in development
 */
export const resetDatabase = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot reset database in production");
  }

  try {
    await clearTable("registrations");
    await clearTable("events");
    await clearTable("audit_logs");
    
    console.warn("✓ Database reset complete");
  } catch (error) {
    console.error("Error resetting database:", error);
    throw error;
  }
};

/**
 * Backup database (exports data as JSON)
 */
export const backupDatabase = async () => {
  try {
    const registrations = await supabase.from("registrations").select("*");
    const events = await supabase.from("events").select("*");
    const admins = await supabase.from("admin_users").select("username, email, role, is_active");
    const auditLogs = await supabase.from("audit_logs").select("*");

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        registrations: registrations.data || [],
        events: events.data || [],
        admin_users: admins.data || [],
        audit_logs: auditLogs.data || [],
      },
    };

    return backup;
  } catch (error) {
    console.error("Error creating database backup:", error);
    throw error;
  }
};

/**
 * Export backup as JSON file
 */
export const downloadBackup = async (): Promise<void> => {
  try {
    const backup = await backupDatabase();
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `db-backup-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading backup:", error);
    throw error;
  }
};

/**
 * Restore database from backup JSON
 */
export const restoreBackup = async (backupData: any): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot restore database in production");
  }

  try {
    // First clear all tables
    await resetDatabase();

    // Then insert data
    if (backupData.data.registrations?.length > 0) {
      await supabase.from("registrations").insert(backupData.data.registrations);
    }

    if (backupData.data.events?.length > 0) {
      await supabase.from("events").insert(backupData.data.events);
    }

    if (backupData.data.audit_logs?.length > 0) {
      await supabase.from("audit_logs").insert(backupData.data.audit_logs);
    }

    console.log("✓ Database restored successfully");
  } catch (error) {
    console.error("Error restoring backup:", error);
    throw error;
  }
};

/**
 * Get real-time connection status
 */
export const getRealtimeStatus = async (): Promise<string> => {
  try {
    // Subscribe to a test channel
    const channel = supabase.channel("test-channel");
    
    channel.on("presence", { event: "sync" }, () => {
      // Subscription successful
    }).subscribe();

    // Check subscription status
    if (channel.state === "joined") {
      channel.unsubscribe();
      return "connected";
    }

    return "disconnected";
  } catch (error) {
    console.error("Error checking realtime status:", error);
    return "error";
  }
};

/**
 * Log database metrics to console
 */
export const logDatabaseMetrics = async (): Promise<void> => {
  try {
    const health = await getDatabaseHealthStatus();
    const stats = await getDatabaseStats();

    console.group("📊 Database Metrics");
    console.log("Health Status:", health);
    console.log("Statistics:", stats);
    console.groupEnd();
  } catch (error) {
    console.error("Error logging metrics:", error);
  }
};
