export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * List files from user's Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  folderId?: string,
  searchQuery?: string
): Promise<DriveFile[]> {
  let q = 'trashed = false';
  if (folderId) {
    q += ` and '${folderId}' in parents`;
  }
  if (searchQuery && searchQuery.trim() !== '') {
    q += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
  }

  const params = new URLSearchParams({
    q,
    fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, webContentLink, thumbnailLink, iconLink)',
    orderBy: 'modifiedTime desc',
    pageSize: '50',
  });

  const response = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Get or create "Chaguo Civic Watchdog" folder in Google Drive
 */
export async function getOrCreateChaguoFolder(accessToken: string): Promise<string> {
  const q = "mimeType = 'application/vnd.google-apps.folder' and name = 'Chaguo Civic Watchdog' and trashed = false";
  const params = new URLSearchParams({ q, fields: 'files(id, name)' });

  const res = await fetch(`${DRIVE_API_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.ok) {
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(DRIVE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Chaguo Civic Watchdog',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Directory for Chaguo Kenyan Voter Guide evidence backups, ballot syncs, and reports.',
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Chaguo folder in Google Drive`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Upload file to Google Drive using multipart upload
 */
export async function uploadToDrive(
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string | Blob,
  folderId?: string
): Promise<DriveFile> {
  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: fileName,
    mimeType: mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );

  if (typeof content === 'string') {
    form.append('file', new Blob([content], { type: mimeType }));
  } else {
    form.append('file', content);
  }

  const res = await fetch(`${UPLOAD_API_URL}?uploadType=multipart&fields=id,name,mimeType,webViewLink,thumbnailLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Drive Upload Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Delete a file from Google Drive
 * NOTE: UI caller MUST require user confirmation prior to calling this function.
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to delete file from Google Drive: ${err}`);
  }
}

/**
 * Fetch text/JSON content of a file
 */
export async function getDriveFileText(accessToken: string, fileId: string): Promise<string> {
  const res = await fetch(`${DRIVE_API_URL}/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download file content from Drive (${res.status})`);
  }

  return await res.text();
}
