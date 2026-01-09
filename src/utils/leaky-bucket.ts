
export class LeakyBucket {
  private level = 0;
  private lastTime = os.clock()

  constructor(
    private readonly capacity: number,
    private readonly leakRatePerSec: number
  ) {}

  private leak(now: number): void {
    const elapsedSec = math.max(0, (now - this.lastTime));
    const leaked = elapsedSec * this.leakRatePerSec;

    this.level = math.max(0, this.level - leaked);
    this.lastTime = now;
  }

  allow(cost = 1, now = os.clock()): boolean {
    assert(cost > 0);

    this.leak(now);

    if (this.level + cost > this.capacity) return false;

    this.level += cost;
    return true;
  }

  getLevel(now = os.time()): number {
    this.leak(now);
    return this.level;
  }

  public static getTimestamp() {
    return os.clock()
  }
}
