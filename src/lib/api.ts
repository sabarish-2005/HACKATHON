import { supabase } from "@/integrations/supabase/client";

// ===================
// REGISTRATION SERVICES
// ===================

export type RegistrationStatus = "pending" | "selected" | "not_selected";

export type RegistrationPayload = {
  team_name: string;
  leader_name: string;
  email: string;
  mobile: string;
  college: string;
  leader_dept: string;
  member2_name: string;
  member2_email: string;
  member2_dept: string;
  member3_name?: string;
  member3_email?: string;
  member3_dept?: string;
  project_title?: string;
  project_description?: string;
  git_link?: string;
  notes?: string;
  status?: RegistrationStatus;
};

export type RegistrationRecord = RegistrationPayload & {
  id: number;
  created_at: string;
  updated_at?: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const getApiBaseUrl = (): string => {
  return API_BASE_URL || "";
};

const LOCAL_STORAGE_KEY = "registrations";
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const getLocalRegistrations = (): RegistrationRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RegistrationRecord[]) : [];
  } catch {
    return [];
  }
};

const saveLocalRegistrations = (records: RegistrationRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
};

const filterLocalRegistrations = (
  records: RegistrationRecord[],
  search: string,
  dept: string
): RegistrationRecord[] => {
  const normalizedSearch = search.trim().toLowerCase();
  return records.filter((item) => {
    const matchesSearch = !normalizedSearch
      || item.team_name.toLowerCase().includes(normalizedSearch)
      || item.leader_name.toLowerCase().includes(normalizedSearch)
      || item.email.toLowerCase().includes(normalizedSearch);
    const matchesDept = !dept || dept === "All" || item.leader_dept === dept;
    return matchesSearch && matchesDept;
  });
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

/**
 * Create a new team registration
 */
export const createRegistration = async (
  payload: RegistrationPayload
): Promise<RegistrationRecord> => {
  const normalizedPayload = { ...payload, status: payload.status || "pending" };
  const apiBaseUrl = getApiBaseUrl();

  if (apiBaseUrl) {
    try {
      const request = fetch(`${apiBaseUrl}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedPayload),
      }).then(async (response) => {
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Failed to create registration");
        }
        return response.json() as Promise<RegistrationRecord>;
      });

      return await withTimeout(
        request,
        10000,
        "Request timed out. Please check your network and try again."
      );
    } catch (error) {
      console.error("API registration failed, falling back:", error);
    }
  }

  if (isSupabaseConfigured) {
    try {
      const request = supabase
        .from("registrations")
        .insert([normalizedPayload])
        .select()
        .single();
      const { data, error } = await withTimeout(
        request,
        10000,
        "Request timed out. Please check your network and try again."
      );

      if (error) {
        throw new Error(error.message || "Failed to create registration");
      }

      return data as RegistrationRecord;
    } catch (error) {
      console.error("Supabase registration failed, falling back:", error);
    }
  }

  const localRecords = getLocalRegistrations();
  const newRecord: RegistrationRecord = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    ...normalizedPayload,
  };
  saveLocalRegistrations([newRecord, ...localRecords]);
  return newRecord;
};

/**
 * Fetch all registrations with optional filtering
 */
export const fetchRegistrations = async (
  search: string = "",
  dept: string = "All"
): Promise<RegistrationRecord[]> => {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("registrations").select("*");

      if (search) {
        query = query.or(
          `team_name.ilike.%${search}%,leader_name.ilike.%${search}%,email.ilike.%${search}%`
        );
      }

      if (dept && dept !== "All") {
        query = query.eq("leader_dept", dept);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message || "Failed to fetch registrations");
      }

      return (data || []) as RegistrationRecord[];
    } catch (error) {
      console.error("Supabase fetch failed, falling back:", error);
    }
  }

  const localRecords = getLocalRegistrations();
  return filterLocalRegistrations(localRecords, search, dept).sort(
    (a, b) => (b.created_at || "").localeCompare(a.created_at || "")
  );
};

/**
 * Get a single registration by ID
 */
export const getRegistrationById = async (
  id: number
): Promise<RegistrationRecord> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message || "Failed to fetch registration");
      }

      return data as RegistrationRecord;
    } catch (error) {
      console.error("Supabase fetch by id failed, falling back:", error);
    }
  }

  const localRecord = getLocalRegistrations().find((item) => item.id === id);
  if (!localRecord) {
    throw new Error("Registration not found");
  }
  return localRecord;
};

/**
 * Update a registration
 */
export const updateRegistration = async (
  id: number,
  payload: Partial<RegistrationPayload>
): Promise<RegistrationRecord> => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Failed to update registration");
      }

      return data as RegistrationRecord;
    } catch (error) {
      console.error("Supabase update failed, falling back:", error);
    }
  }

  const localRecords = getLocalRegistrations();
  const index = localRecords.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Registration not found");
  }
  const updatedRecord: RegistrationRecord = {
    ...localRecords[index],
    ...payload,
    updated_at: new Date().toISOString(),
  };
  localRecords[index] = updatedRecord;
  saveLocalRegistrations(localRecords);
  return updatedRecord;
};

/**
 * Update registration status
 */
export const updateRegistrationStatus = async (
  id: number,
  status: RegistrationStatus
): Promise<RegistrationRecord> => {
  return updateRegistration(id, { status });
};

/**
 * Delete a registration
 */
export const deleteRegistration = async (id: number): Promise<void> => {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message || "Failed to delete registration");
      }
      return;
    } catch (error) {
      console.error("Supabase delete failed, falling back:", error);
    }
  }

  const localRecords = getLocalRegistrations();
  const nextRecords = localRecords.filter((item) => item.id !== id);
  if (nextRecords.length === localRecords.length) {
    throw new Error("Registration not found");
  }
  saveLocalRegistrations(nextRecords);
};

/**
 * Get registration statistics
 */
export const getRegistrationStats = async () => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("status, leader_dept");

      if (error) {
        throw new Error(error.message || "Failed to fetch statistics");
      }

      const stats = {
        total: data?.length || 0,
        pending: data?.filter((r: any) => r.status === "pending").length || 0,
        selected: data?.filter((r: any) => r.status === "selected").length || 0,
        rejected: data?.filter((r: any) => r.status === "not_selected").length || 0,
        byDept: {} as Record<string, number>,
      };

      // Count by department
      data?.forEach((registration: any) => {
        const dept = registration.leader_dept;
        stats.byDept[dept] = (stats.byDept[dept] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Supabase stats failed, falling back:", error);
    }
  }

  const localRecords = getLocalRegistrations();
  const stats = {
    total: localRecords.length,
    pending: localRecords.filter((r) => r.status === "pending").length,
    selected: localRecords.filter((r) => r.status === "selected").length,
    rejected: localRecords.filter((r) => r.status === "not_selected").length,
    byDept: {} as Record<string, number>,
  };

  localRecords.forEach((registration) => {
    const dept = registration.leader_dept;
    stats.byDept[dept] = (stats.byDept[dept] || 0) + 1;
  });

  return stats;
};

/**
 * Export registrations as CSV
 */
export const exportRegistrationsAsCSV = async (registrations: RegistrationRecord[]): Promise<string> => {
  try {
    const headers = [
      "ID",
      "Team Name",
      "Leader Name",
      "Email",
      "Mobile",
      "College",
      "Department",
      "Member 2",
      "Member 3",
      "Project Title",
      "Status",
      "Created At",
    ];

    const rows = registrations.map((reg) => [
      reg.id,
      reg.team_name,
      reg.leader_name,
      reg.email,
      reg.mobile,
      reg.college,
      reg.leader_dept,
      `${reg.member2_name} (${reg.member2_email})`,
      `${reg.member3_name || "N/A"} (${reg.member3_email || "N/A"})`,
      reg.project_title || "N/A",
      reg.status,
      new Date(reg.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return csv;
  } catch (error) {
    console.error("Error exporting registrations:", error);
    throw error;
  }
};

// ===================
// BATCH OPERATIONS
// ===================

/**
 * Update multiple registrations status
 */
export const bulkUpdateRegistrationStatus = async (
  ids: number[],
  status: RegistrationStatus
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("registrations")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) {
      throw new Error(error.message || "Failed to bulk update registrations");
    }
  } catch (error) {
    console.error("Error bulk updating registrations:", error);
    throw error;
  }
};

/**
 * Delete multiple registrations
 */
export const bulkDeleteRegistrations = async (ids: number[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .in("id", ids);

    if (error) {
      throw new Error(error.message || "Failed to bulk delete registrations");
    }
  } catch (error) {
    console.error("Error bulk deleting registrations:", error);
    throw error;
  }
};
