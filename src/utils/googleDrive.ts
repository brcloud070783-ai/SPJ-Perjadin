import { ProjectSPJ } from '../types';

const FOLDER_NAME = 'SiDinas SPJ Backup';

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
}

/**
 * Helper to search or create the dedicated folder in Google Drive
 */
async function getOrCreateSiDinasFolder(accessToken: string): Promise<string> {
  // Search for existing folder
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`);
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error('Gagal mengakses Google Drive.');
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create new folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!createRes.ok) {
    throw new Error('Gagal membuat folder SiDinas di Google Drive.');
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * Upload or update an SPJ Project to Google Drive
 */
export async function uploadProjectToDrive(
  accessToken: string,
  project: ProjectSPJ
): Promise<DriveFileInfo> {
  const folderId = await getOrCreateSiDinasFolder(accessToken);
  const fileName = `${project.namaProject.replace(/[^a-zA-Z0-0\s_-]/g, '')}_${project.id}.spj`;
  const fileContent = JSON.stringify(project, null, 2);

  // Check if file already exists in folder
  const searchQuery = encodeURIComponent(`'${folderId}' in parents and name='${fileName}' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${searchQuery}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const searchData = await searchRes.json();
  const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

  if (existingFile) {
    // Update existing file
    const updateRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: fileContent
    });

    if (!updateRes.ok) throw new Error('Gagal memperbarui file di Google Drive.');
    const updated = await updateRes.json();
    return {
      id: updated.id,
      name: fileName,
      modifiedTime: new Date().toISOString()
    };
  } else {
    // Multipart upload new file
    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/json',
      appProperties: { sidinasSpjId: project.id }
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!createRes.ok) throw new Error('Gagal menyimpan file ke Google Drive.');
    const created = await createRes.json();
    return {
      id: created.id,
      name: fileName,
      modifiedTime: new Date().toISOString()
    };
  }
}

/**
 * List all SPJ files saved in Google Drive folder
 */
export async function listDriveSPJFiles(accessToken: string): Promise<DriveFileInfo[]> {
  try {
    const folderId = await getOrCreateSiDinasFolder(accessToken);
    const query = encodeURIComponent(`'${folderId}' in parents and name contains '.spj' and trashed=false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size,webViewLink)&orderBy=modifiedTime desc`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) throw new Error('Gagal mengambil daftar file Drive');
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('listDriveSPJFiles error:', err);
    return [];
  }
}

/**
 * Download / Read an SPJ project from Google Drive by File ID
 */
export async function downloadProjectFromDrive(accessToken: string, fileId: string): Promise<ProjectSPJ> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) throw new Error('Gagal mengunduh file dari Google Drive.');
  const project: ProjectSPJ = await res.json();
  if (!project.id || !project.namaProject) {
    throw new Error('Format file SPJ dari Google Drive tidak valid.');
  }
  return project;
}

/**
 * Delete a file from Google Drive
 */
export async function deleteProjectFromDrive(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error('Gagal menghapus file dari Google Drive.');
  }
}
