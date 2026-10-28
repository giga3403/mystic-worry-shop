import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Receipt } from '../types';

const STORAGE_KEY_CONFIG = 'mystic_worry_supabase_config';
const STORAGE_KEY_FALLBACK_RECEIPTS = 'mystic_worry_local_receipts';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read config from localStorage', e);
  }

  return { url: '', anonKey: '' };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  initClient();
}

let supabaseClient: SupabaseClient | null = null;

function initClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey) {
    try {
      supabaseClient = createClient(url, anonKey);
      return supabaseClient;
    } catch (e) {
      console.warn('Supabase client initialization failed:', e);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }
  return null;
}

initClient();

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && supabaseClient);
}

function getLocalReceipts(): Receipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FALLBACK_RECEIPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReceipts(receipts: Receipt[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FALLBACK_RECEIPTS, JSON.stringify(receipts));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export async function saveReceiptToBackend(receipt: Receipt): Promise<{ success: boolean; isCloud: boolean; error?: string }> {
  if (isSupabaseConnected() && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('receipts').insert([
        {
          id: receipt.id,
          created_at: receipt.created_at,
          customer_name: receipt.customer_name,
          category: receipt.category,
          worry_content: receipt.worry_content,
          worry_weight: receipt.worry_weight,
          spell: receipt.spell,
          receipt_data: {
            items: receipt.items,
            subtotal: receipt.subtotal,
            discounts: receipt.discounts,
            final_price: receipt.final_price,
            payment_method: receipt.payment_method,
            remedy_title: receipt.remedy_title,
            remedy_desc: receipt.remedy_desc,
            lucky_item: receipt.lucky_item,
            lucky_color: receipt.lucky_color,
            barcode_number: receipt.barcode_number,
            category_label: receipt.category_label,
            worry_expiry: receipt.worry_expiry,
            worry_weight_unit: receipt.worry_weight_unit
          },
          is_public: receipt.is_public,
          likes_count: receipt.likes_count
        }
      ]);

      if (error) {
        console.warn('Supabase save error, falling back to local:', error);
        saveToLocalFallback(receipt);
        return { success: true, isCloud: false, error: error.message };
      }

      return { success: true, isCloud: true };
    } catch (err: any) {
      console.warn('Network or Supabase exception, falling back to local:', err);
      saveToLocalFallback(receipt);
      return { success: true, isCloud: false, error: err?.message };
    }
  }

  saveToLocalFallback(receipt);
  return { success: true, isCloud: false };
}

function saveToLocalFallback(receipt: Receipt) {
  const current = getLocalReceipts();
  const filtered = current.filter(r => r.id !== receipt.id);
  saveLocalReceipts([receipt, ...filtered]);
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
  if (isSupabaseConnected() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('receipts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        const d = data.receipt_data || {};
        return {
          id: data.id,
          created_at: data.created_at,
          customer_name: data.customer_name,
          category: data.category,
          category_label: d.category_label || data.category,
          worry_content: data.worry_content,
          worry_weight: data.worry_weight,
          worry_weight_unit: d.worry_weight_unit || 'g',
          worry_expiry: d.worry_expiry || '오늘 밤',
          spell: data.spell,
          items: d.items || [],
          subtotal: d.subtotal || '',
          discounts: d.discounts || [],
          final_price: d.final_price || '0원',
          payment_method: d.payment_method || '',
          remedy_title: d.remedy_title || '',
          remedy_desc: d.remedy_desc || '',
          lucky_item: d.lucky_item || '',
          lucky_color: d.lucky_color || '',
          barcode_number: d.barcode_number || '',
          likes_count: data.likes_count || 0,
          is_public: data.is_public
        };
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to local', e);
    }
  }

  const locals = getLocalReceipts();
  return locals.find(r => r.id === id) || null;
}

export async function getPublicReceipts(limit = 20): Promise<Receipt[]> {
  if (isSupabaseConnected() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('receipts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map(item => {
          const d = item.receipt_data || {};
          return {
            id: item.id,
            created_at: item.created_at,
            customer_name: item.customer_name,
            category: item.category,
            category_label: d.category_label || item.category,
            worry_content: item.worry_content,
            worry_weight: item.worry_weight,
            worry_weight_unit: d.worry_weight_unit || 'g',
            worry_expiry: d.worry_expiry || '',
            spell: item.spell,
            items: d.items || [],
            subtotal: d.subtotal || '',
            discounts: d.discounts || [],
            final_price: d.final_price || '0원',
            payment_method: d.payment_method || '',
            remedy_title: d.remedy_title || '',
            remedy_desc: d.remedy_desc || '',
            lucky_item: d.lucky_item || '',
            lucky_color: d.lucky_color || '',
            barcode_number: d.barcode_number || '',
            likes_count: item.likes_count || 0,
            is_public: item.is_public
          };
        });
      }
    } catch (e) {
      console.warn('Supabase fetch error, fallback to local', e);
    }
  }

  return getLocalReceipts().filter(r => r.is_public);
}

export async function likeReceipt(id: string): Promise<number> {
  if (isSupabaseConnected() && supabaseClient) {
    try {
      const { data: current } = await supabaseClient
        .from('receipts')
        .select('likes_count')
        .eq('id', id)
        .single();
      
      const nextLikes = (current?.likes_count || 0) + 1;
      await supabaseClient
        .from('receipts')
        .update({ likes_count: nextLikes })
        .eq('id', id);

      return nextLikes;
    } catch (e) {
      console.warn('Like failed in Supabase', e);
    }
  }

  const locals = getLocalReceipts();
  let updatedCount = 1;
  const next = locals.map(r => {
    if (r.id === id) {
      updatedCount = (r.likes_count || 0) + 1;
      return { ...r, likes_count: updatedCount };
    }
    return r;
  });
  saveLocalReceipts(next);
  return updatedCount;
}
