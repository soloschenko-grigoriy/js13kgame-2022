import { Enemy } from '@/enemy/enemy'
import { Grid } from '@/grid'
import { Settings } from '@/settings'
import { Entity } from '@/utils'

export class EnemyController extends Entity {
  private _enemies: Enemy[] = []

  public get Grid(): Grid {
    return this._grid
  }

  constructor(
    private readonly _grid: Grid
  ) {
    super()
  }
  public Awake(): void {
    super.Awake()

    this.SpawnEnemies()
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    this._enemies.map(enemy => enemy.Update(deltaTime))
  }

  public Destroy(enemy: Enemy): void {
    this._enemies = this._enemies.filter(item => item != enemy)
  }

  private SpawnEnemies(): void {
    const nodes = this._grid.Nodes
    const dimension = Settings.grid.dimension

    const node = nodes[dimension * Math.round(dimension / 2) - 1]
    const enemy = new Enemy(node, this)

    this._enemies.push(enemy)
    this._grid.ActiveEnemy = enemy
    enemy.Awake()
  }
}

