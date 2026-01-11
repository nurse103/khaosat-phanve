
$key = Read-Host "Please paste your NEW Supabase 'anon' key here"
$key = $key.Trim()

if ([string]::IsNullOrWhiteSpace($key)) {
    Write-Host "Key cannot be empty." -ForegroundColor Red
    exit
}

$envContent = @"
VITE_SUPABASE_URL=https://qpqojinnyfkcpfxlqohk.supabase.co
VITE_SUPABASE_ANON_KEY=$key
"@

[System.IO.File]::WriteAllText("$PSScriptRoot\.env.local", $envContent)
Write-Host "Successfully updated .env.local with the new key!" -ForegroundColor Green
Write-Host "Please restart your dev server (Ctrl+C, then 'npm run dev') to apply changes." -ForegroundColor Yellow
