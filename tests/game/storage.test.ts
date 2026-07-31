import assert from "node:assert/strict";
import test from "node:test";
import { createGame } from "../../src/lib/game-engine/index.ts";
import { clearGame, loadGame, loadTheme, saveGame } from "../../src/lib/storage/game-storage.ts";
import { DEFAULT_SETTINGS, EMPTY_STATS, type Team } from "../../src/types/game.ts";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const teams: Team[] = [
  { id: "a", name: "Equipe A", color: "#f00", avatar: "zap", players: ["Ana"], score: 0, totals: { ...EMPTY_STATS } },
  { id: "b", name: "Equipe B", color: "#0f0", avatar: "star", players: [], score: 0, totals: { ...EMPTY_STATS } },
];

const installStorage = () => {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
  return storage;
};

test("salva e recupera uma partida valida", () => {
  installStorage();
  const game = createGame("classic", teams, DEFAULT_SETTINGS);
  assert.equal(saveGame(game), null);
  assert.deepEqual(loadGame(), JSON.parse(JSON.stringify(game)));
  clearGame();
  assert.equal(loadGame(), null);
});

test("descarta JSON quebrado e partidas incompletas", () => {
  const storage = installStorage();
  storage.setItem("nao-fala:game:v1", "{quebrado");
  assert.equal(loadGame(), null);
  assert.equal(storage.getItem("nao-fala:game:v1"), null);

  storage.setItem("nao-fala:game:v1", JSON.stringify({ version: 1, screen: "playing" }));
  assert.equal(loadGame(), null);
  assert.equal(storage.getItem("nao-fala:game:v1"), null);
});

test("ignora temas desconhecidos", () => {
  const storage = installStorage();
  storage.setItem("nao-fala:theme", "tema-inexistente");
  assert.equal(loadTheme(), null);
  storage.setItem("nao-fala:theme", "arcade");
  assert.equal(loadTheme(), "arcade");
});