/**
 * Post a package size report comment on a PR.
 * Called by the pkg-size GitHub Actions workflow via actions/github-script.
 */

function formatBytes(bytes) {
  if (bytes >= 1048576)
    return `${(bytes / 1048576).toFixed(2)} MB`
  return `${(bytes / 1024).toFixed(2)} KB`
}

function formatDiff(current, base) {
  const diff = current - base
  if (diff === 0)
    return '±0'
  const sign = diff > 0 ? '+' : '-'
  if (!base)
    return `${sign}${formatBytes(Math.abs(diff))}`
  return `${sign}${formatBytes(Math.abs(diff))} (${sign}${((Math.abs(diff) / base) * 100).toFixed(1)}%)`
}

function formatReport({ size, unpackSize, baseSize, baseUnpackSize }) {
  return [
    '## 📦 Package Size Report',
    '',
    '| Metric | Size | Diff |',
    '| --- | --- | --- |',
    `| Packed | ${formatBytes(size)} | ${formatDiff(size, baseSize)} |`,
    `| Unpacked | ${formatBytes(unpackSize)} | ${formatDiff(unpackSize, baseUnpackSize)} |`,
  ].join('\n')
}

function isCommentPermissionError(error) {
  return error?.status === 403 && /Resource not accessible by integration/i.test(error.message ?? '')
}

module.exports = async ({ github, context, size, unpackSize, baseSize, baseUnpackSize }) => {
  const body = formatReport({ size, unpackSize, baseSize, baseUnpackSize })

  if (!context.issue?.number) {
    console.info('No issue or PR number found in context. Skipping package size PR comment.')
    console.log(body)
    return
  }

  try {
    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    })
    const existing = comments.find(c => c.body?.includes('📦 Package Size Report'))

    if (existing) {
      await github.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: existing.id,
        body,
      })
    }
    else {
      await github.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        body,
      })
    }
  }
  catch (error) {
    if (!isCommentPermissionError(error))
      throw error
    console.warn('Skipping package size PR comment because the GitHub token cannot write comments.')
    console.log(body)
  }
}
