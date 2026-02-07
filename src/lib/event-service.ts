import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Event = {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  location?: string;
  event_type?: string;
  max_capacity?: number;
  registered_count?: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "published";
  created_by?: number;
  created_at: string;
  updated_at: string;
};

/**
 * Create a new event
 */
export const createEvent = async (
  eventData: Omit<Event, "id" | "created_at" | "updated_at" | "registered_count">
): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .insert([{ ...eventData, registered_count: 0 }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create event");
    }

    return data as Event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Get all available events
 */
export const getEvents = async (
  status?: string
): Promise<Event[]> => {
  try {
    let query = supabase.from("events").select("*");

    if (status) {
      query = query.eq("status", status);
    } else {
      query = query.eq("status", "published");
    }

    query = query.order("event_date", { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || "Failed to fetch events");
    }

    return (data || []) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (id: number): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message || "Failed to fetch event");
    }

    return data as Event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

/**
 * Update an event
 */
export const updateEvent = async (
  id: number,
  updates: Partial<Event>
): Promise<Event> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update event");
    }

    return data as Event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message || "Failed to delete event");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Increment registered count for an event
 */
export const incrementEventRegistrationCount = async (
  id: number,
  count: number = 1
): Promise<Event> => {
  try {
    const event = await getEventById(id);
    const newCount = (event.registered_count || 0) + count;

    return updateEvent(id, { registered_count: newCount });
  } catch (error) {
    console.error("Error incrementing event registration count:", error);
    throw error;
  }
};

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", today)
      .eq("status", "upcoming")
      .order("event_date", { ascending: true });

    if (error) {
      throw new Error(error.message || "Failed to fetch upcoming events");
    }

    return (data || []) as Event[];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};
