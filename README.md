# 🐑 Sheep a Sheep - Dojo Edition

Un juego de eliminación de fichas construido con **Dojo** y **React** en la blockchain de **Starknet**.

## 🚀 Descripción

Sheep a Sheep es un juego adictivo donde debes eliminar todas las fichas del tablero seleccionando grupos de 3 fichas iguales. Esta versión está completamente integrada con Dojo, lo que significa que:

- 🔗 Tu progreso se guarda en la blockchain
- 🎮 Cada partida es verificable
- 🏆 Las estadísticas son permanentes
- ⚡ Usa Cartridge Connector para una experiencia sin fricciones

## 🎯 Cómo Jugar

1. **Conecta tu wallet** usando Cartridge Controller o cuentas predeployadas
2. **Inicia un nuevo juego** desde la pantalla de inicio
3. **Selecciona fichas accesibles** (que brillan) para añadirlas a tu slot temporal
4. **Haz match de 3 fichas iguales** para eliminarlas y ganar puntos
5. **¡Elimina todas las fichas** antes de llenar tu slot (máximo 7 fichas)

### 🎮 Controles
- **Click**: Seleccionar ficha accesible
- **Power-ups**: Usa mezclar, pistas, deshacer o bomba estratégicamente

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Dojo (ECS framework) en Starknet
- **Wallet**: Cartridge Controller & Predeployed Accounts
- **Styling**: Tailwind CSS + CSS personalizado
- **State Management**: Dojo SDK

## 📦 Instalación y Desarrollo

### Prerrequisitos

```bash
# Instalar Dojo
curl -L https://install.dojoengine.org | bash
dojoup

# Verificar instalación
sozo --version
katana --version
torii --version
```

### Configuración del Proyecto

1. **Clonar y configurar**:
```bash
git clone <tu-repo>
cd sheep-a-sheep
```

2. **Instalar dependencias del cliente**:
```bash
cd client
npm install
```

3. **Configurar variables de entorno**:
```bash
# .env (ya incluido)
VITE_RPC_URL=http://localhost:5050
VITE_TORII_URL=http://localhost:8080
VITE_RELAY_URL=/dns4/localhost/tcp/9090/http
```

### Ejecutar el Desarrollo

1. **Terminal 1 - Katana (blockchain local)**:
```bash
cd contracts
katana --disable-fee --allowed-origins "*"
```

2. **Terminal 2 - Construir y migrar contratos**:
```bash
cd contracts
sozo build
sozo migrate
```

3. **Terminal 3 - Torii (indexador)**:
```bash
cd contracts
torii --world 0x... --allowed-origins "*"
# Reemplaza 0x... con la dirección del mundo de la migración
```

4. **Terminal 4 - Cliente React**:
```bash
cd client
npm run dev
```

### Scripts Útiles

```bash
# En /contracts
sozo build              # Construir contratos
sozo migrate           # Migrar al mundo
sozo execute <contract> <function>  # Ejecutar función

# En /client  
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
```

## 🏗️ Arquitectura Dojo

### Modelos (ECS Components)
- **Game**: Estado del juego, puntuación, jugador
- **Tile**: Fichas individuales con posición y tipo  
- **PlayerInventory**: Slot temporal del jugador
- **PlayerStats**: Estadísticas permanentes
- **PowerUps**: Power-ups disponibles

### Sistemas (ECS Systems)
- **start_new_game**: Iniciar nueva partida
- **select_tile**: Seleccionar ficha del tablero
- **use_power_up**: Usar power-ups especiales

### Eventos
- **GameStarted**: Nueva partida iniciada
- **TileSelected**: Ficha seleccionada
- **MatchFound**: Match encontrado
- **GameFinished**: Partida terminada

## 🔧 Estructura del Proyecto

```
sheep-a-sheep/
├── contracts/          # Contratos Dojo (Cairo)
│   ├── src/
│   │   ├── models.cairo     # Modelos ECS
│   │   └── systems/         # Sistemas del juego
│   ├── Scarb.toml          # Configuración Cairo
│   └── dojo_dev.toml       # Configuración Dojo
└── client/             # Frontend React
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── dojo/           # Configuración Dojo
    │   ├── hooks/          # Hooks personalizados
    │   └── store/          # Providers
    ├── package.json
    └── vite.config.ts
```

## 🎨 Características

### 🔗 Integración Blockchain
- ✅ Wallet connection con Cartridge
- ✅ Transacciones automáticas
- ✅ Estado persistente en blockchain
- ✅ Eventos indexados por Torii

### 🎮 Gameplay
- ✅ Sistema de capas (3D layering)
- ✅ Detección de fichas accesibles
- ✅ Power-ups estratégicos
- ✅ Sistema de puntuación

### 🎯 UI/UX
- ✅ Diseño responsive
- ✅ Animaciones fluidas
- ✅ Estados de carga
- ✅ Manejo de errores

## 🚀 Producción

### Build para Producción
```bash
# Contracts
cd contracts
sozo build --release

# Client
cd client
npm run build
```

### Deploy
1. Deploy contratos a Starknet mainnet/testnet
2. Actualizar variables de entorno
3. Deploy cliente a Vercel/Netlify

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## 🙏 Agradecimientos

- [Dojo Engine](https://www.dojoengine.org/) - Framework ECS
- [Cartridge](https://cartridge.gg/) - Wallet & Infrastructure
- [Starknet](https://starknet.io/) - Blockchain Layer 2

---

**¿Tienes preguntas?** Abre un issue o contacta al equipo de desarrollo.

🐑 ¡Diviértete jugando Sheep a Sheep en la blockchain! 🐑
