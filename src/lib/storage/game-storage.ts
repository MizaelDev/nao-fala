import { CATEGORIES, type GameScreen, type SavedGame, type ThemeId } from "@/types/game";

const GAME_KEY = "nao-fala:game:v1";
const THEME_KEY = "nao-fala:theme";
const THEMES: ThemeId[] = ["arcade", "junina", "space", "football", "spooky", "minimal"];
const SCREENS: GameScreen[] = ["home", "howTo", "modeSelection", "setup", "ready", "countdown", "playing", "paused", "roundSummary", "scoreboard", "tieBreaker", "finished"];
const MODES = ["classic", "lightning", "chaos"];
const DIFFICULTIES = ["easy", "medium", "hard", "mixed"];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

export function saveGame(game: SavedGame): string | null {
  try { localStorage.setItem(GAME_KEY, JSON.stringify(game)); return null; }
  catch { return "Não foi possível salvar. A partida continua nesta tela."; }
}

export function isSavedGame(value: unknown): value is SavedGame {
  if (!isRecord(value) || value.version !== 1 || !SCREENS.includes(value.screen as GameScreen) || !MODES.includes(String(value.mode))) return false;
  if (!Array.isArray(value.teams) || value.teams.length < 2 || value.teams.length > 6) return false;
  if (!value.teams.every((team) => isRecord(team) && typeof team.id === "string" && typeof team.name === "string" && team.name.trim().length > 0 && Array.isArray(team.players) && isFiniteNumber(team.score) && isRecord(team.totals))) return false;
  if (!isRecord(value.settings) || !Array.isArray(value.settings.categories) || value.settings.categories.length === 0) return false;
  if (!value.settings.categories.every((category) => CATEGORIES.includes(category as (typeof CATEGORIES)[number]))) return false;
  if (!DIFFICULTIES.includes(String(value.settings.difficulty)) || !THEMES.includes(value.settings.theme as ThemeId)) return false;
  if (!isFiniteNumber(value.turnIndex) || value.turnIndex < 0 || !isFiniteNumber(value.remainingMs) || value.remainingMs < 0) return false;
  if (!Array.isArray(value.usedCardIds) || !value.usedCardIds.every((id) => typeof id === "string")) return false;
  if (!Array.isArray(value.actionHistory) || !isRecord(value.roundStats) || !isRecord(value.playerIndexes) || !isRecord(value.tieScores)) return false;
  if (!Array.isArray(value.tieTeamIds) || !isFiniteNumber(value.tieRound) || !isFiniteNumber(value.seed)) return false;
  if (value.currentCardId !== null && typeof value.currentCardId !== "string") return false;
  if (value.endAt !== null && !isFiniteNumber(value.endAt)) return false;
  if (value.screen === "playing" && value.endAt === null) return false;
  return true;
}

export function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isSavedGame(parsed)) return parsed;
    localStorage.removeItem(GAME_KEY);
    return null;
  } catch {
    try { localStorage.removeItem(GAME_KEY); } catch {}
    return null;
  }
}

export function clearGame(): void { try { localStorage.removeItem(GAME_KEY); } catch {} }
export function saveTheme(theme: ThemeId): void { try { localStorage.setItem(THEME_KEY, theme); } catch {} }
export function loadTheme(): ThemeId | null { try { const theme = localStorage.getItem(THEME_KEY); return THEMES.includes(theme as ThemeId) ? theme as ThemeId : null; } catch { return null; } }
