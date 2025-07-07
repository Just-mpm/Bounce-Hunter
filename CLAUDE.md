# Bounce Hunter - Documentação do Projeto

## 📱 Sobre o Projeto

**Bounce Hunter** é um jogo de física e predição onde o jogador deve prever onde uma bola estará após 1 segundo. A bola quica nas paredes e obstáculos, tornando o desafio progressivamente mais difícil.

- **Tecnologia**: React + TypeScript + Vite
- **Mobile**: Capacitor (Android)
- **Estado**: ✅ Pronto para publicação na Play Store
- **Package Name**: `com.bouncehunter.app`
- **Versão**: 0.1.4 (versionCode 4)

## 🎮 Características do Jogo

- Sistema de física realista com gravidade e colisões
- Dificuldade progressiva com obstáculos aleatórios
- Sistema de vidas (3 vidas por partida)
- Suporte a múltiplos idiomas (PT/EN)
- Sistema de pontuação e recorde pessoal
- Modo pausar e configurações
- PWA com service worker para funcionar offline

## 🛠️ Estrutura do Projeto

```
bounce-hunter/
├── components/          # Componentes React do jogo
├── context/            # Context API (GameContext)
├── hooks/              # Hooks customizados
├── i18n/               # Traduções (PT/EN)
├── public/             # Assets públicos (incluindo i18n/locales/)
├── resources/          # Recursos Android (ícones e splash screens)
├── android/            # Projeto Android (gerado pelo Capacitor)
├── src/                # Código fonte
├── dist/               # Build de produção
├── App.tsx             # Componente principal
├── package.json        # Dependências
├── vite.config.ts      # Configuração Vite
├── capacitor.config.json
├── build-release.ps1   # Script de build
└── bounce-hunter-release.aab  # AAB pronto
```

## 📋 Como Fazer o Build

### Pré-requisitos
- Node.js instalado
- Java JDK (para Android)
- PowerShell (Windows)

### Passos para Build

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Build de produção**:
   ```bash
   npm run build
   ```

3. **Sincronizar com Capacitor**:
   ```bash
   npx cap sync android
   ```

4. **Gerar AAB assinado**:
   ```powershell
   .\build-release.ps1
   ```

### Comandos Manuais (WSL/PowerShell)

Se preferir fazer manualmente:

```bash
# 1. Build web
npm run build

# 2. Sincronizar
npx cap sync android
```

```powershell
# 3. Gerar AAB (PowerShell do Windows)
cd "D:\Users\Matheus Pimenta\Pictures\Bounce Hunter"
cd android
.\gradlew.bat bundleRelease
```

## 📱 Informações da Play Store

### Dados do App
- **Nome**: Bounce Hunter
- **Package**: com.bouncehunter.app
- **Categoria**: Jogos > Casual
- **Classificação**: Livre (E for Everyone)
- **Idiomas**: Português, Inglês
- **Tamanho**: ~4.3 MB

### Assets
- ✅ Ícone 512x512: `resources/playstore-icon.png`
- ✅ Ícones Android: `resources/android/`
- ✅ Splash screens: Portrait e landscape

## 🔧 Manutenção e Atualizações

### Para atualizar versão:
1. Incremente versão no `package.json`
2. Incremente `versionCode` e `versionName` em:
   - `android-config/build.gradle.patch`
   - `android/app/build.gradle`
3. Execute build completo
4. **Importante**: Use as MESMAS senhas do keystore

### Comandos úteis:
```bash
# Desenvolvimento local
npm run dev

# Build web
npm run build

# Sincronizar com Capacitor
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

## ⚠️ Importante

### Segurança
- **NUNCA** commite arquivos `.keystore` ou `keystore.properties`
- **GUARDE** as senhas do keystore em local seguro
- **USE** as mesmas senhas para todas as atualizações

### Ambiente WSL
- Projeto está em WSL (Windows Subsystem for Linux)
- Para comandos gradle, use PowerShell do Windows
- Caminhos devem usar formato Windows (`D:\...`)

## 📊 Dados Técnicos
- **Min SDK**: 21 (Android 5.0)
- **Target SDK**: 34 (Android 14)
- **Tamanho**: ~4.3 MB
- **Permissões**: Apenas INTERNET
- **Versão atual**: 0.1.4 (versionCode 4)
- **Arquivos importantes**:
  - Keystore: `android/bounce-hunter-release.keystore`
  - AAB: `bounce-hunter-release.aab`

## 📝 Histórico de Correções

### Problema Tela Azul (Resolvido v0.1.3)
- **Causa**: Arquivos de tradução `i18n/locales/*.json` não incluídos no build
- **Solução**: Movidos para `public/i18n/locales/` para inclusão automática
- **Correções adicionais**:
  - I18nProvider corrigido para não bloquear aplicação
  - allowNavigation configurado no Capacitor
  - Debug logging adicionado
  - Versões sincronizadas em todos os arquivos de configuração

### Precisão de Acerto Melhorada (v0.1.4)
- **Problema**: Jogo considerava acerto mesmo quando bola estava apenas próxima do círculo
- **Causa**: Tolerância de 50px entre centros (muito permissiva)
- **Solução**: Ajustada para 40px (raio da bola 15px + raio do círculo 25px)
- **Resultado**: Agora a bola deve realmente tocar o círculo amarelo para acertar
- **Arquivos modificados**:
  - `constants.ts`: Nova constante `PREDICTION_MARKER_RADIUS`
  - `context/GameContext.tsx`: Lógica de colisão atualizada

### Chaves de Assinatura (Resolvido)
- Reset de chaves realizado na Play Console
- Keystore atual funcionando corretamente

---

**Última atualização**: 7 de Janeiro de 2025  
**Status**: ✅ **PRONTO PARA PUBLICAÇÃO** (v0.1.4)

Todos os problemas foram resolvidos e o jogo agora possui precisão melhorada de acerto. O AAB v0.1.4 está pronto para publicação na Play Store.