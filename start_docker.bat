@echo off
echo ===============================
echo   Subindo containers Docker...
echo ===============================
docker compose up -d --build

echo.
echo ===============================
echo   Aguardando inicializacao...
echo ===============================
timeout /t 5 >nul

echo.
echo Aguardando o servidor Angular iniciar...

:wait_for_frontend
powershell -Command ^
    try { ^
        $resp = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 2; ^
        if ($resp.StatusCode -eq 200) { exit 0 } ^
        else { exit 1 } ^
    } catch { exit 1 }
if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto wait_for_frontend
)

echo.
echo ===============================
echo   Abrindo navegador no Frontend
echo ===============================
start http://localhost:4200

echo.
echo ===============================
echo   Tudo pronto!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:4200
echo ===============================
pause
