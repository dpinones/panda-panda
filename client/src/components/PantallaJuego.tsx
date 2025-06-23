import React from 'react';
import type { Tile, GameState } from '../dojo/generated/typescript/models.gen';
import type { BigNumberish } from 'starknet';

interface PantallaJuegoProps {
  puntuacion: number;
  fichas: Tile[];
  slotTemporal: string[];
  clickFicha: (position: { x: number; y: number }, layer: number) => void;
  loading?: boolean;
  gameState?: GameState;
  powerUps?: any | null; // Using any for now since PowerUps doesn't exist
  remainingTiles?: number;
  onGoHome?: () => void; // Nueva prop para ir al inicio
  onNewGame?: () => void; // Nueva prop para nuevo juego
  isMusicEnabled?: boolean; // Estado de música
  isSoundEnabled?: boolean; // Estado de sonido
  onToggleMusic?: () => void; // Función para alternar música
  onToggleSound?: () => void; // Función para alternar sonido
}

const PantallaJuego: React.FC<PantallaJuegoProps> = ({ 
  puntuacion, 
  fichas,
  slotTemporal,
  clickFicha,
  loading = false,
  gameState,
  powerUps,
  remainingTiles = 0,
  onGoHome,
  onNewGame,
  isMusicEnabled = true,
  isSoundEnabled = true,
  onToggleMusic,
  onToggleSound
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [animatingTile, setAnimatingTile] = React.useState<string | null>(null);

  // Helper function to convert BigNumberish to number
  const toNumber = (value: BigNumberish): number => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'bigint') {
      return Number(value);
    }
    return 0;
  };

  // Pre-calculate which tiles are accessible (optimized with useMemo)
  const accessibleTiles = React.useMemo(() => {
    const accessible = new Set<string>();
    
    fichas.forEach(currentTile => {
      const currentX = toNumber(currentTile.position.x);
      const currentY = toNumber(currentTile.position.y);
      const currentLayer = toNumber(currentTile.layer);
      const tileKey = `${currentX}-${currentY}-${currentLayer}`;

      // Crear un diccionario de posiciones ocupadas por tiles en capas superiores
      const ocupiedPositions = new Set<string>();
      fichas.forEach(otherTile => {
        const otherX = toNumber(otherTile.position.x);
        const otherY = toNumber(otherTile.position.y);
        const otherLayer = toNumber(otherTile.layer);
        
        // Solo considerar tiles en capas superiores
        if (otherLayer > currentLayer) {
          ocupiedPositions.add(`${otherX}-${otherY}`);
        }
      });

      // Verificar si hay solapamiento en el área adyacente (3x3) similar al backend
      let isBlocked = false;
      for (let dx = 0; dx <= 2 && !isBlocked; dx++) {
        for (let dy = 0; dy <= 2; dy++) {
          // Evitar overflow verificando antes de la resta
          if (currentX + dx === 0 || currentY + dy === 0) {
            continue;
          }
          
          const nx = currentX + dx - 1;
          const ny = currentY + dy - 1;
          
          // No permitir fuera de rango (asumiendo MAX_BOARD_WIDTH = 15, MAX_BOARD_HEIGHT = 13)
          if (nx > 15 || ny > 13) {
            continue;
          }
          
          // Verificar si esta posición está ocupada por un tile en capa superior
          if (ocupiedPositions.has(`${nx}-${ny}`)) {
            isBlocked = true;
            break;
          }
        }
      }
      
      if (!isBlocked) {
        accessible.add(tileKey);
      }
    });

    console.log(`🎯 Accessible tiles: ${accessible.size}/${fichas.length}`);
    return accessible;
  }, [fichas]);

  const handleTileClick = (position: { x: number; y: number }, layer: number) => {
    if (!loading && animatingTile === null) {
      const tileKey = `${position.x}-${position.y}-${layer}`;
      setAnimatingTile(tileKey);
      
      // Ejecutar la animación y luego la acción del backend
      setTimeout(() => {
        clickFicha(position, layer);
        setAnimatingTile(null);
      }, 400); // 400ms de animación
    }
  };

  const renderTile = (tile: Tile, index: number) => {
    const xPos = toNumber(tile.position.x);
    const yPos = toNumber(tile.position.y);
    const layer = toNumber(tile.layer);
    
    // Check if this tile is accessible using pre-calculated data
    const tileKey = `${xPos}-${yPos}-${layer}`;
    const isAccessible = accessibleTiles.has(tileKey);
    const isAnimating = animatingTile === tileKey;
    
    // Posicionar según coordenadas reales del tablero (15x13)
    // Espaciado más compacto: 64px por posición
    const tileSpacing = 32;
    const leftPos = xPos * tileSpacing;
    const topPos = yPos * tileSpacing + (layer * 2); // pequeña separación entre capas
    
    return (
      <div 
        key={`tile-${xPos}-${yPos}-${layer}`}
        className={`ficha nivel-${layer} ${!isAccessible ? 'bloqueada' : ''} ${loading ? 'loading' : ''} ${isAnimating ? 'animating-select' : ''}`}
        style={{
          left: `${leftPos}px`,
          top: `${topPos}px`,
          zIndex: layer + 10
        }}
        onClick={() => isAccessible && handleTileClick({ x: xPos, y: yPos }, layer)}
        title={`Posición: (${xPos}, ${yPos}) Capa: ${layer} ${!isAccessible ? '(BLOQUEADO)' : '(CLICKEABLE)'}`}
      >
        {getTileEmoji(tile.tile_type)}
      </div>
    );
  };

  const getTileEmoji = (tileType: any): string => {
    // Handle CairoCustomEnum
    if (tileType && typeof tileType === 'object' && 'activeVariant' in tileType) {
      const variant = tileType.activeVariant();
      const emojiMap: Record<string, string> = {
        'Empty': '',
        'Sheep': '🐑',
        'Wolf': '🐺',
        'Grass': '🌱',
        'Flower': '🌸',
        'Carrot': '🥕',
        'Bone': '🦴',
        'Corn': '🌽',
        'Tool': '🔧',
        'Bucket': '🪣',
        'Wood': '🪵',
        'Glove': '🧤',
        'Cabbage': '🥬',
        'Apple': '🍎',
        'Strawberry': '🍓',
        'Pumpkin': '🎃',
        'Cherry': '🍒',
      };
      return emojiMap[variant] || '❓';
    }
    
    // Handle numeric values - usando el mismo mapeo que en App.tsx
    const emojiMap: Record<number, string> = {
      0: '',       // Empty
      1: '🐑',      // Sheep
      2: '🐺',      // Wolf
      3: '🌱',      // Grass
      4: '🌸',      // Flower
      5: '🥕',      // Carrot
      6: '🦴',      // Bone
      7: '🌽',      // Corn
      8: '🔧',      // Tool
      9: '🪣',      // Bucket
      10: '🪵',     // Wood
      11: '🧤',     // Glove
      12: '🥬',     // Cabbage
      13: '🍎',     // Apple
      14: '🍓',     // Strawberry
      15: '🎃',     // Pumpkin
      16: '🍒',     // Cherry
    };
    return emojiMap[tileType] || '❓';
  };

  const getGameStateText = (state?: GameState): string => {
    if (!state) return 'Desconocido';
    
    // Handle CairoCustomEnum
    if (typeof state === 'object' && 'activeVariant' in state) {
      const variant = (state as any).activeVariant();
      switch (variant) {
        case 'NotStarted': return 'No iniciado';
        case 'InProgress': return 'En progreso';
        case 'Won': return '¡Ganaste! 🎉';
        case 'Lost': return 'Perdiste 😢';
        case 'Paused': return 'Pausado';
        default: return 'Desconocido';
      }
    }
    
    return 'Desconocido';
  };

  const handleHomeClick = () => {
    // TODO: Navigate to home
    console.log('Navigate to home');
    setShowSettings(false);
    onGoHome?.();
  };

  const handleNewGameClick = () => {
    // TODO: Start new game
    console.log('Start new game');
    setShowSettings(false);
    onNewGame?.();
  };

  const handleContinueClick = () => {
    // Continue current game
    setShowSettings(false);
  };

  const SettingsPopup = () => (
    <div className="settings-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Ajustes</h3>
          <button 
            className="close-button"
            onClick={() => setShowSettings(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="settings-content">
          <div className="setting-item">
            <button 
              className={`toggle-button ${isMusicEnabled ? 'active' : 'inactive'}`}
              onClick={() => onToggleMusic?.()}
            >
              <span className="setting-icon">🎵</span>
              <span className="setting-label">Música:</span>
              <span className="setting-status">{isMusicEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="setting-item">
            <button 
              className={`toggle-button ${isSoundEnabled ? 'active' : 'inactive'}`}
              onClick={() => onToggleSound?.()}
            >
              <span className="setting-icon">🔊</span>
              <span className="setting-label">Efectos:</span>
              <span className="setting-status">{isSoundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="settings-buttons">
            <button className="action-btn home-btn" onClick={handleHomeClick}>
              🏠 Inicio
            </button>
            
            <button className="action-btn continue-btn" onClick={handleContinueClick}>
              ▶️ Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pantalla-juego pantalla-juego-background">      
      {/* Botón de configuración */}
      <button 
        className="settings-button"
        onClick={() => setShowSettings(true)}
        title="Configuración"
      >
        ⚙️
      </button>

      {/* Popup de configuración */}
      {showSettings && <SettingsPopup />}

      <div className="slot-temporal">
        <div className="slot-container">
          {slotTemporal.map((emoji, index) => (
            <div key={`slot-${index}`} className="ficha-slot">
              {emoji}
            </div>
          ))}
          {/* Mostrar slots vacíos */}
          {Array.from({ length: 7 - slotTemporal.length }, (_, index) => (
            <div key={`empty-slot-${index}`} className="ficha-slot empty"></div>
          ))}
        </div>
      </div>
      
      <div className="tablero-juego">
        {loading && <div className="loading-overlay">⏳ Procesando...</div>}
        {fichas.length === 0 ? (
          <div className="no-tiles">
            {/* <p>🎯 No hay fichas disponibles</p> */}
          </div>
        ) : (
          fichas.map((tile, index) => renderTile(tile, index))
        )}
      </div>
    </div>
  );
};

export default PantallaJuego; 