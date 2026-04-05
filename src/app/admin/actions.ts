"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function saveContentAction(newData: any) {
  try {
    const filePath = path.join(process.cwd(), "src/data/content.json");
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf-8");
    
    // Revalidate the home page so new data shows immediately
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to save content" };
  }
}
