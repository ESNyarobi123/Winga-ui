import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

interface UploadResponse {
  url: string;
}

/** POST /upload with file. type: profile | job | proposal | general. Requires auth. */
export async function uploadFile(file: File, type: string = "general"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const { data } = await api.post<ApiResponse<UploadResponse>>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const url = data.data?.url;
  if (!url) throw new Error("Upload failed");
  return url;
}
