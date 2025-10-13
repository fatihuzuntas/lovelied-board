// Electron IPC Renderer Interface
interface ElectronIpcRenderer {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  on: (channel: string, func: (...args: any[]) => void) => void;
  removeListener: (channel: string, func: (...args: any[]) => void) => void;
  removeAllListeners: (channel: string) => void;
}

// Electron API Interface
interface ElectronAPI {
  ipcRenderer: ElectronIpcRenderer;
}

// Window interface extension
interface Window {
  electron?: ElectronAPI;
  process?: {
    versions?: {
      electron?: string;
    };
  };
}

// IPC Channel Types
declare namespace ElectronIPC {
  // Database channels
  type DatabaseChannels = 
    | 'db:get-board-data'
    | 'db:save-board-data'
    | 'db:backup'
    | 'db:restore';

  // Upload channels
  type UploadChannels = 
    | 'upload:media';

  // Updater channels
  type UpdaterChannels = 
    | 'updater:check-for-updates'
    | 'updater:download-update'
    | 'updater:install-update';

  // App metadata channels
  type AppChannels = 
    | 'app:get-version'
    | 'app:get-metadata'
    | 'app:set-metadata';

  // All valid channels
  type AllChannels = 
    | DatabaseChannels 
    | UploadChannels 
    | UpdaterChannels 
    | AppChannels;

  // Event channels
  type EventChannels = 
    | 'updater:checking-for-update'
    | 'updater:update-available'
    | 'updater:update-not-available'
    | 'updater:error'
    | 'updater:download-progress'
    | 'updater:update-downloaded';
}

// Response types
interface DatabaseResponse {
  success: boolean;
  error?: string;
}

interface BackupResponse extends DatabaseResponse {
  path?: string;
}

interface RestoreResponse extends DatabaseResponse {
  oldBackupPath?: string;
}

interface UploadResponse extends DatabaseResponse {
  url?: string;
}

interface UpdateCheckResponse extends DatabaseResponse {
  updateInfo?: {
    version: string;
    releaseNotes?: string;
    releaseDate?: string;
  };
}

interface MetadataResponse extends DatabaseResponse {
  value?: string;
}

// Progress info for downloads
interface DownloadProgress {
  bytesPerSecond: number;
  percent: number;
  transferred: number;
  total: number;
}

export {};
