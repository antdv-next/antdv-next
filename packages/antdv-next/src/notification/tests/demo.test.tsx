import demoTest from '/@tests/shared/demoTest'

// `_semantic` renders a notice with `duration: 999999` + `showProgress: true`,
// so the rendered `<progress value>` depends on rAF/Date.now() timing. Stable
// at runtime, but flakes under coverage instrumentation (e.g. 99.9999998...
// instead of 100). Skipped here; covered by Notification.semantic.test.tsx.
demoTest('notification', { skip: ['_semantic'] })
