@ECHO OFF

IF %1.==. GOTO MissingArg

dotnet build -c Release -o build-output /p:Version=%1
GOTO End

:MissingArg
ECHO Missing version argument

:End