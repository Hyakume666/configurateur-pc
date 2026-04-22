// Pre-dismisses the storage notice banner so it doesn't intercept clicks
// during E2E. Wired via context.addInitScript in beforeEach across specs.
export const dismissStorageNotice = () => {
  localStorage.setItem('storage_notice_v1', '1')
}
