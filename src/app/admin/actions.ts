"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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
