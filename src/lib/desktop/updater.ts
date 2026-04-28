export interface DesktopUpdateResult {
  status: 'unsupported' | 'none' | 'installed';
  version?: string;
}

export async function checkDesktopUpdate(): Promise<DesktopUpdateResult> {
  const isDesktop = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  if (!isDesktop) {
    return { status: 'unsupported' };
  }

  const { check } = await import('@tauri-apps/plugin-updater');
  const update = await check();

  if (!update) {
    return { status: 'none' };
  }

  await update.downloadAndInstall();
  return { status: 'installed', version: update.version };
}
