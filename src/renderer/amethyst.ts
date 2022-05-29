import ElectronEventManager from "./electronEventManager";
import Player from "./player";
import Shortcuts from "./shortcuts";
import AppState from "./state";

export class Amethyst {
  public appState: AppState = new AppState();
	public electron: ElectronEventManager = new ElectronEventManager(this.appState);
  public player: Player = new Player(this.appState, this.electron);
  public shortcuts: Shortcuts = new Shortcuts(this.player);
}

const amethyst = new Amethyst();

export const useState = () => amethyst.appState;
export const useElectron = () => amethyst.electron;
export const useShortcuts = () => amethyst.shortcuts;
export const usePlayer = () => amethyst.player;