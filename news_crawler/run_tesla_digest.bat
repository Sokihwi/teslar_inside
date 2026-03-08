@echo off
cd /d "%~dp0"
echo ============================================
echo  Tesla Inside - News Digest Service
echo ============================================

echo.
echo [1/2] Fetching Tesla news from Naver + Google...
python fetch_tesla_news.py

echo.
echo [2/2] Sending Email Digest...
python send_tesla_digest.py

echo.
echo ============================================
echo  Mission Complete!
echo ============================================
timeout /t 5
