"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export async function saveContentAction(content: any) {
  try {
    const { error } = await supabase
      .from("site_settings")
      .update({ payload: content })
      .eq("id", 1);
      
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to save content" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to save content" };
  }
}
