// lib/videoConfig.ts

const PROJECT_ID = "69bb0914000f7b4c9b38"
const BUCKET_ID  = "69bb097b00104898ce23"
const ENDPOINT   = "https://sgp.cloud.appwrite.io/v1"

const fileUrl = (fileId: string) =>
  `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`

export const VIDEO_SOURCES = [
  fileUrl("69bb0bcf0030c7b7e9a0"),
  fileUrl("69bb121c002ddb878750"),
  fileUrl("69bb131c0025adf8267f"),
  fileUrl("69bb139300188bf3025a"),
  fileUrl("PASTE_5TH_FILE_ID_HERE"), // replace once you upload the 5th video
]

export const CACHE_NAME = "mc-videos-v1"