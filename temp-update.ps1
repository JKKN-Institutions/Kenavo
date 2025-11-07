$content = Get-Content 'C:\Users\brabu\Documents\GitHub\Kenavo\app\directory\[id]\page.tsx' -Raw
$content = $content -replace 'isExpanded=\{index === 0\}', 'isExpanded={true}'
Set-Content 'C:\Users\brabu\Documents\GitHub\Kenavo\app\directory\[id]\page.tsx' -Value $content
