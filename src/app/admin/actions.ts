"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) return supabase;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function uploadImageAction(base64Image: string) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "wedding_invitation",
    });
    return { success: true, url: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

export async function uploadAudioAction(base64Audio: string) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Audio, {
      folder: "wedding_invitation",
      resource_type: "video",
    });
    return { success: true, url: uploadResponse.secure_url };
  } catch (error) {
    console.error("Cloudinary audio upload error:", error);
    return { success: false, error: "Audio upload failed" };
  }
}

export async function saveContentAction(content: any) {
  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, payload: content }) // Use upsert instead of update
      .select();
      
    if (error) {
      console.error("Supabase Save Error:", error);
      return { success: false, error: `${error.message} (Code: ${error.code})` };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Save Action Exception:", err);
    return { success: false, error: err.message || "Unknown error occurred" };
  }
}

export async function deleteWishAction(id: string) {
  try {
    const { error } = await getAdminSupabase().from("wedding_wishes").delete().eq("id", id);
    if (error) {
      console.error("Supabase Delete Error:", error);
      return { success: false, error: `${error.message} (Code: ${error.code})` };
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
