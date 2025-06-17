# Fix Plan: Git Commit Separation

## Problem
The developer needs to separate changes into two distinct commits:
1. Dashboard analytics fix
2. Code context tool relocation and cleanup

## Steps

### 1. Create a temporary branch
```bash
git checkout -b temp-fix-branch
```

### 2. Reset to last good commit
```bash
git reset --hard HEAD~1
```

### 3. Re-apply changes in two stages
First, apply only the dashboard fix:
```bash
git checkout HEAD@{1} -- admin/admin/src/lib/actions.ts
git commit -m "feat: Fix dashboard analytics to use valid fields"
```

Then apply the code context tool changes:
```bash
git checkout HEAD@{1} -- tools/
git checkout HEAD@{1} -- .cct_config.json
git checkout HEAD@{1} -- NEEDS_REFACTOR.md
git checkout HEAD@{1} -- logs/system_events.log
git rm -r src/code_context_tool
git commit -m "feat: Move code context tool to tools/ and clean up"
```

### 4. Verify and clean up
```bash
git log --oneline  # Should show two new commits
git branch -D new
git branch -m new
git push -f origin new
```

### 5. Finalize
```bash
rm NEEDS_ASSISTANCE.md
touch COMMIT_COMPLETE.md