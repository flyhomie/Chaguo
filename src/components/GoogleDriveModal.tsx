import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  Trash2, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Cloud, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle,
  Database,
  Lock,
  LogOut
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, getAccessToken, logoutDrive } from '../lib/firebaseAuth';
import { 
  listDriveFiles, 
  getOrCreateChaguoFolder, 
  uploadToDrive, 
  deleteDriveFile, 
  getDriveFileText,
  DriveFile 
} from '../lib/driveService';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBackup?: (backupData: any) => void;
  onExportData?: () => any;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onImportBackup,
  onExportData,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chaguoFolderId, setChaguoFolderId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // User Confirmation state for file deletion
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<DriveFile | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAuthChecking(true);
      const unsubscribe = initAuth(
        (authUser, token) => {
          setUser(authUser);
          setAccessToken(token);
          setAuthChecking(false);
        },
        () => {
          setUser(null);
          setAccessToken(null);
          setAuthChecking(false);
        }
      );
      return () => unsubscribe();
    }
  }, [isOpen]);

  useEffect(() => {
    if (accessToken) {
      loadDriveData(accessToken);
    }
  }, [accessToken]);

  const loadDriveData = async (token: string) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const folderId = await getOrCreateChaguoFolder(token);
      setChaguoFolderId(folderId);
      const fileList = await listDriveFiles(token, folderId, searchQuery);
      setFiles(fileList);
    } catch (err: any) {
      console.error('Error loading Google Drive files:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load files from Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setStatusMsg({ type: 'success', text: `Signed in as ${res.user.email}. Connected to Google Drive!` });
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to sign in with Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutDrive();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setChaguoFolderId(null);
    setStatusMsg({ type: 'info', text: 'Disconnected from Google Drive.' });
  };

  const handleBackupToDrive = async () => {
    if (!accessToken || !chaguoFolderId) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      // Gather application data from local storage / state
      const exportPayload = onExportData ? onExportData() : {
        version: '2027.1',
        exportedAt: new Date().toISOString(),
        ballot: JSON.parse(localStorage.getItem('chaguo_saved_candidates') || '[]'),
        citizenReports: JSON.parse(localStorage.getItem('chaguo_citizen_reports') || '[]'),
        customCandidates: JSON.parse(localStorage.getItem('chaguo_custom_candidates') || '[]'),
      };

      const fileName = `Chaguo_Voter_Guide_Backup_${new Date().toISOString().split('T')[0]}.json`;
      const jsonString = JSON.stringify(exportPayload, null, 2);

      const uploadedFile = await uploadToDrive(
        accessToken,
        fileName,
        'application/json',
        jsonString,
        chaguoFolderId
      );

      setStatusMsg({
        type: 'success',
        text: `Successfully saved voter guide backup "${uploadedFile.name}" to Google Drive!`,
      });

      // Refresh file list
      await loadDriveData(accessToken);
    } catch (err: any) {
      console.error('Backup failed:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to upload backup to Google Drive.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFile = async (file: DriveFile) => {
    if (!accessToken) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const contentText = await getDriveFileText(accessToken, file.id);
      const parsedData = JSON.parse(contentText);

      if (onImportBackup) {
        onImportBackup(parsedData);
      } else {
        if (parsedData.ballot) {
          localStorage.setItem('chaguo_saved_candidates', JSON.stringify(parsedData.ballot));
        }
        if (parsedData.citizenReports) {
          localStorage.setItem('chaguo_citizen_reports', JSON.stringify(parsedData.citizenReports));
        }
        if (parsedData.customCandidates) {
          localStorage.setItem('chaguo_custom_candidates', JSON.stringify(parsedData.customCandidates));
        }
      }

      setStatusMsg({
        type: 'success',
        text: `Successfully restored data from "${file.name}"! Page data updated.`,
      });
    } catch (err: any) {
      console.error('Restore failed:', err);
      setStatusMsg({ type: 'error', text: 'Failed to restore backup. Invalid JSON format.' });
    } finally {
      setLoading(false);
    }
  };

  // Delete handler with user confirmation requirement
  const confirmDeleteFile = async () => {
    if (!accessToken || !deleteConfirmFile) return;
    const fileToDelete = deleteConfirmFile;
    setDeleteConfirmFile(null);
    setLoading(true);
    setStatusMsg(null);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setStatusMsg({ type: 'info', text: `Deleted "${fileToDelete.name}" from Google Drive.` });
      await loadDriveData(accessToken);
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete file.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">Google Drive Integration</h2>
              <p className="text-[10px] text-neutral-400 font-medium">Cloud Evidence Storage & Voter Guide Backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : statusMsg.type === 'error'
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
              }`}
            >
              {statusMsg.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />}
              {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
              {statusMsg.type === 'info' && <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {authChecking ? (
            <div className="py-12 text-center text-xs font-semibold text-neutral-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span>Verifying Google Auth status...</span>
            </div>
          ) : !accessToken || !user ? (
            /* Sign In Prompt */
            <div className="bg-neutral-50 dark:bg-neutral-800/60 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Connect Your Google Drive</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Sign in with Google to store citizen watchdog evidence, backup your custom candidate lists, and synchronize voter guide records safely across devices.
                </p>
              </div>

              {/* Official Google Material Sign-In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="gsi-material-button inline-flex items-center gap-3 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 dark:border-neutral-600 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  <div className="w-5 h-5 shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Encrypted OAuth2 session. Files stored in dedicated "Chaguo Civic Watchdog" folder.</span>
              </div>
            </div>
          ) : (
            /* Connected View */
            <div className="space-y-4">
              {/* Account Banner */}
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-between gap-3 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2.5 min-w-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'Google User'} className="w-8 h-8 rounded-full border border-neutral-300 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 text-white font-black text-xs rounded-full flex items-center justify-center shrink-0">
                      {(user.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email} • Chaguo Folder Connected
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded border border-red-200 dark:border-red-900 transition-colors flex items-center gap-1 shrink-0"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Disconnect</span>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleBackupToDrive}
                  disabled={loading}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Backup Voter Guide to Drive</span>
                </button>

                <button
                  onClick={() => accessToken && loadDriveData(accessToken)}
                  disabled={loading}
                  className="p-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer border border-neutral-300 dark:border-neutral-700"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Drive Files</span>
                </button>
              </div>

              {/* File Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && accessToken && loadDriveData(accessToken)}
                  placeholder="Filter Drive files by name..."
                  className="w-full pl-8 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Files Table / List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>Chaguo Google Drive Backups & Files</span>
                  <span className="text-[10px] text-neutral-400 font-normal">{files.length} items</span>
                </h4>

                {loading ? (
                  <div className="py-8 text-center text-xs font-semibold text-neutral-500 flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Syncing with Google Drive...</span>
                  </div>
                ) : files.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-400 text-xs">
                    <Cloud className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                    <p className="font-semibold text-neutral-600 dark:text-neutral-400">No backup files found in Drive</p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Click "Backup Voter Guide to Drive" above to create your first cloud sync file.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                              {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Drive File'} •{' '}
                              {file.size ? `${(parseInt(file.size) / 1024).toFixed(1)} KB` : 'JSON Document'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {file.name.endsWith('.json') && (
                            <button
                              onClick={() => handleRestoreFile(file)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase rounded transition-colors flex items-center gap-1"
                              title="Restore backup into Chaguo Voter Guide"
                            >
                              <Download className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          )}

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-neutral-400 hover:text-blue-600 transition-colors rounded"
                              title="View in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => setDeleteConfirmFile(file)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition-colors rounded"
                            title="Delete file from Google Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Delete Confirmation Dialog Modal */}
        {deleteConfirmFile && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-white dark:bg-neutral-900 border-2 border-red-600 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-black uppercase tracking-wider">Confirm File Deletion</h3>
              </div>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-neutral-900 dark:text-white">{deleteConfirmFile.name}</strong> from your Google Drive? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmFile(null)}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFile}
                  className="px-4 py-1.5 text-xs font-black uppercase text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
