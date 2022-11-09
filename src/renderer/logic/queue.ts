import PromisePool from "@supercharge/promise-pool";
import { useLocalStorage } from "@vueuse/core";
import { fisherYatesShuffle } from "./math";
import { Track } from "./track";
import {ref} from "vue";

export class Queue {
  private savedQueue = useLocalStorage<string[]>("queue", []);
  public list = ref(new Map<string, Track>()).value;

  public constructor(paths?: string[]) {
    paths 
      ? this.add(paths)
      : this.add(this.savedQueue.value);
  }

  /**
   * Saves the current queue to local storage for persistance
   */
  private syncLocalStorage() {
    this.savedQueue.value = Array.from(this.list.values()).map(t => t.path);
  }

  /**
   * Fetches all async data for each track concurrently
   */
  private fetchAsyncData(){
    PromisePool
			.for(Array.from(this.list.values()))
			.withConcurrency(5)
			.process(track => track.fetchAsyncData());
  }

  public getTrack(idx: number){
    return Array.from(this.list.values())[idx];
  }

  /**
   * Adds a track to the queue
   * @param path A filepath to the track
   */
  public add(path: string | string[]) {
    if (path instanceof Array) {
      path.forEach(path => this.list.set(path, new Track(path)));
      this.fetchAsyncData();
    } else {
      const track = new Track(path);
      this.list.set(path, track);
      track.fetchAsyncData();
    }

    this.syncLocalStorage();
  }

  /**
   * Removes a track from the queue
   * @param target An index or Track instance to remove
   */
  public remove(target: number| Track) {
    target instanceof Track ? this.list.delete(target.path) : this.list.delete(this.getTrack(target).path);
    this.syncLocalStorage();
  }

  public clear(){
    this.list.clear();
  }

  /**
   * Shuffles the queue
   */
  public shuffle() {
		this.list = new Map(fisherYatesShuffle(Array.from(this.list.entries())));
  }
}