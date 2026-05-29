@echo off
REM ============================================================
REM  Launch Dr. Asna Zehra Naqvi website in your browser.
REM  Double-click this file to start the site.
REM ============================================================
cd /d "%~dp0"

echo Starting the website server...
start "Dr Asna Website Server" /min py -3 -m http.server 8765

echo Waiting for the server to be ready...
timeout /t 2 /nobreak >nul

echo Opening the website in your browser...
start "" "http://localhost:8765/index.html"

echo.
echo ============================================================
echo  The website is now running at:
echo      http://localhost:8765/index.html
echo.
echo  A minimized window named "Dr Asna Website Server" is
echo  running the site. CLOSE that window to stop the site.
echo ============================================================
echo.
pause
