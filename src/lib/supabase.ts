import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided by the user
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://kiwpzxjdbcwkfafngdgj.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xm7uE87p3W55MfNzg1aLlw_KGhNNC-P';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export interface BookingPayload {
  full_name: string;
  phone: string;
  section: string;
  sharing_type: string;
  move_in_date?: string | null;
  message?: string;
  status?: string;
}

/**
 * Saves a new booking inquiry to the Supabase database.
 * Attempts inserting into 'bookings' table first, with fallback to camelCase or 'inquiries' if needed.
 */
export async function saveBookingToSupabase(payload: BookingPayload) {
  // Try inserting with standard snake_case column names into 'bookings' table
  const insertData = {
    full_name: payload.full_name,
    phone: payload.phone,
    section: payload.section,
    sharing_type: payload.sharing_type,
    move_in_date: payload.move_in_date || null,
    message: payload.message || '',
    status: payload.status || 'pending',
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert([insertData])
    .select();

  if (error) {
    // If the table 'bookings' doesn't exist or column names mismatch, try 'inquiries' as fallback
    if (error.code === '42P01') { // undefined_table
      const fallback = await supabase
        .from('inquiries')
        .insert([insertData])
        .select();

      if (!fallback.error) {
        return { success: true, data: fallback.data, table: 'inquiries' };
      }
    }
    
    console.error('Supabase booking insert error:', error);
    return { success: false, error };
  }

  return { success: true, data, table: 'bookings' };
}

export interface BookingRecord {
  id: string | number;
  created_at: string;
  full_name: string;
  phone: string;
  section: string;
  sharing_type: string;
  move_in_date?: string | null;
  message?: string;
  status: 'pending' | 'confirmed' | 'visited' | 'cancelled' | 'admitted' | string;
  notes?: string | null;
  assigned_room?: string | null;
}

/**
 * Fetches all bookings (for the admin dashboard)
 */
export async function getAllBookingsFromSupabase(): Promise<{ success: boolean; data: BookingRecord[]; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback check if table is named inquiries
      if (error.code === '42P01') {
        const fallback = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (!fallback.error) {
          return { success: true, data: (fallback.data as any) || [] };
        }
      }
      console.error('Failed to load bookings:', error);
      return { success: false, data: [], error };
    }

    return { success: true, data: (data as any) || [] };
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return { success: false, data: [], error: err };
  }
}

/**
 * Fetches recent bookings (for manager/admin quick view)
 */
export async function getRecentBookings(limit = 20) {
  return getAllBookingsFromSupabase();
}

/**
 * Updates an existing booking record (status, remarks, room assignment, details)
 */
export async function updateBookingInSupabase(
  id: string | number,
  updates: Partial<BookingRecord>
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update booking error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Update booking exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Deletes a booking or cancels permanently
 */
export async function deleteBookingFromSupabase(
  id: string | number
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete booking error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete booking exception:', err);
    return { success: false, error: err };
  }
}
