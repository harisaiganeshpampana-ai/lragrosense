@echo off
echo ========================================================
echo   LR AgroSense — Uploading Updated Code to GitHub
echo ========================================================
echo.
cd /d "%~dp0"
"C:\Users\Hari Sai Ganesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" add .
"C:\Users\Hari Sai Ganesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" commit -m "fix: update index.html, internship.html and internships.html"
"C:\Users\Hari Sai Ganesh\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" push origin main --force
echo.
echo ========================================================
echo   SUCCESS! Your website lragrosense.in is updated!
echo ========================================================
pause
