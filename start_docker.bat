@echo off
title Intranet Casa Azul - Inicializando...
color 0A

echo ============================================
echo        INICIANDO AMBIENTE DA INTRANET
echo ============================================
echo.

:: Subir containers
echo > Iniciando containers Docker...
docker compose up -d --build

echo.
echo ============================================
echo   Aguardando APIs e Frontend iniciarem...
echo ============================================
echo.

:: -------- Função de espera por porta --------
:wait_for_port
set PORT=%1
set NAME=%2

echo Aguardando %NAME% (porta %PORT%) iniciar...

:check_port
powershell -Command ^
  try { ^
    $socket = New-Object Net.Sockets.TcpClient; ^
    $socket.Connect('localhost', %PORT%); ^
    if ($socket.Connected) { exit 0 } ^
    else { exit 1 } ^
  } catch { exit 1 }

if %errorlevel% neq 0 (
    timeout /t 2 >nul
    goto check_port
)

echo %NAME% está ONLINE!
echo.
exit /B 0

:: -------- Aguarda as APIs e o Front --------

call :wait_for_port 8080 "API-Demanda"
call :wait_for_port 8082 "API-Gestão"
call :wait_for_port 4200 "Frontend Angular"

echo.
echo ============================================
echo   Abrindo navegador na aplicação...
echo ============================================
start http://localhost:4200

echo.
echo ============================================
echo     AMBIENTE PRONTO PARA USO! 🚀
echo     API Demanda: http://localhost:8080
echo     API Gestão:  http://localhost:8082
echo     Frontend:    http://localhost:4200
echo ============================================
echo.
pause
