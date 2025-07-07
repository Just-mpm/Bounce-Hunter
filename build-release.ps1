# Script para build de release do Bounce Hunter
# Execute este script no PowerShell como administrador

Write-Host "=== Bounce Hunter - Build de Release ===" -ForegroundColor Cyan

# Verificar se o node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Build do projeto web
Write-Host "`nCriando build de produção..." -ForegroundColor Yellow
npm run build

# Sincronizar com Capacitor
Write-Host "`nSincronizando com Capacitor..." -ForegroundColor Yellow
npx cap sync android

# Verificar se a pasta android existe
if (-not (Test-Path "android")) {
    Write-Host "`nPasta android não encontrada. Executando 'npx cap add android'..." -ForegroundColor Red
    npx cap add android
    npx cap sync android
}

# Copiar arquivo de configuração do gradle se existir
if (Test-Path "../android-config/app-build.gradle") {
    Write-Host "Aplicando configurações do gradle..." -ForegroundColor Yellow
    Copy-Item "../android-config/app-build.gradle" "android/app/build.gradle" -Force
}

# Navegar para a pasta android
Set-Location android

# Verificar se o keystore existe
$keystorePath = "bounce-hunter-release.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "`n=== Criando Keystore ===" -ForegroundColor Cyan
    Write-Host "IMPORTANTE: Guarde as senhas em local seguro!" -ForegroundColor Red
    
    $storePassword = Read-Host "Digite a senha do keystore" -AsSecureString
    $keyPassword = Read-Host "Digite a senha da chave" -AsSecureString
    
    # Converter SecureString para texto
    $storePasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($storePassword))
    $keyPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))
    
    # Criar keystore
    keytool -genkey -v -keystore $keystorePath -alias bounce-hunter -keyalg RSA -keysize 2048 -validity 10000 -storepass $storePasswordText -keypass $keyPasswordText -dname "CN=Koda AI Studio, OU=Games, O=Koda AI Studio, L=City, ST=State, C=BR"
    
    # Salvar senhas em arquivo local (CUIDADO!)
    @"
storeFile=$keystorePath
storePassword=$storePasswordText
keyPassword=$keyPasswordText
keyAlias=bounce-hunter
"@ | Out-File -FilePath "keystore.properties" -Encoding UTF8
    
    Write-Host "Keystore criado com sucesso!" -ForegroundColor Green
}

# Build do AAB
Write-Host "`nGerando AAB assinado..." -ForegroundColor Yellow

# Verificar se o gradlew.bat existe
if (-not (Test-Path "gradlew.bat")) {
    Write-Host "ERRO: gradlew.bat não encontrado!" -ForegroundColor Red
    Write-Host "Certifique-se de que o projeto Android foi criado corretamente." -ForegroundColor Yellow
    exit 1
}

# Executar build
.\gradlew.bat bundleRelease

# Verificar se o build foi bem sucedido
$aabPath = "app/build/outputs/bundle/release/app-release.aab"
if (Test-Path $aabPath) {
    $aabSize = (Get-Item $aabPath).Length / 1MB
    Write-Host "`n=== Build Concluído com Sucesso! ===" -ForegroundColor Green
    Write-Host "AAB gerado em: $aabPath" -ForegroundColor Cyan
    Write-Host "Tamanho: $([math]::Round($aabSize, 2)) MB" -ForegroundColor Cyan
    
    # Copiar AAB para pasta principal
    Copy-Item $aabPath "../bounce-hunter-release.aab"
    Write-Host "`nAAB copiado para: bounce-hunter-release.aab" -ForegroundColor Green
} else {
    Write-Host "`nERRO: AAB não foi gerado!" -ForegroundColor Red
}

# Voltar para pasta principal
Set-Location ..

Write-Host "`n=== Processo Finalizado ===" -ForegroundColor Cyan
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Faça upload do arquivo 'bounce-hunter-release.aab' na Play Console"
Write-Host "2. Preencha todas as informações do app (descrição, screenshots, etc.)"
Write-Host "3. Envie para teste interno"