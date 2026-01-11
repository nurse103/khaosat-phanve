param(
    [string]$Message = "Update project: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

# 1. Add all changes
Write-Host "Drafting changes (git add)..." -ForegroundColor Cyan
git add .

# 2. Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
    exit
}

# 3. Commit
Write-Host "Committing changes (git commit)..." -ForegroundColor Cyan
git commit -m "$Message"

# 4. Push
Write-Host "Pushing to GitHub (git push)..." -ForegroundColor Cyan
git push origin main

Write-Host "SUCCESS: Your code has been pushed to GitHub!" -ForegroundColor Green
