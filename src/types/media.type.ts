export interface Media {
  originalName: string;
  fileName: string;
  filePath: string;
  relativePath: string;
  relatedToId: string;
  fileUrl: string;
  supabaseBackupUrl: string;
  mimetype: string;
  size: number;
  category: "image" | "audio" | "video" | "document" | "spreadsheet" | "others";
  uploadedBy: string;
  uploadKey: string;
  tags: string[];
  description: string;
  uploadedAt: Date;
  isActive: boolean;
  downloadCount: number;
  lastAccessedAt: Date;
  imageMetadata?: {
    width?: number;
    height?: number;
    format?: string;
    colorSpace?: string;
  } | null;
  videoMetadata?: {
    duration?: number;
    width?: number;
    height?: number;
    codec?: string;
    bitrate?: number;
  } | null;
  audioMetadata?: {
    duration?: number;
    bitrate?: number;
    codec?: string;
    channels?: number;
  } | null;
}
