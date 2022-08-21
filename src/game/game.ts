import { Entity } from '@/utils'
import { Grid } from '@/grid'
import { GameInputComponent } from './components'
import { EnemyController } from '@/enemy-controller'
import { Nation } from '@/nation'
import { GameHUDComponent } from './components'

export class Game extends Entity {
  private _lastTimestamp = 0

  private _entities: Entity[] = []

  public get Nation(): Nation {
    return this._nation
  }

  public get Entities(): Entity[] {
    return this._entities
  }

  constructor(grid: Grid, enemyController: EnemyController, private readonly _nation: Nation) {
    super()

    this._entities.push(grid, enemyController, _nation)
  }

  public Awake(): void {
    this.AddComponent(new GameInputComponent())
    this.AddComponent(new GameHUDComponent())

    super.Awake()

    // awake all children
    for (const entity of this._entities) {
      entity.Awake()
    }

    // Make sure Update starts after all entities are awaken
    window.requestAnimationFrame(() => {
      // set initial timestamp
      this._lastTimestamp = Date.now()

      // start update loop
      this.Update()
    })
  }

  public Update(): void {
    const deltaTime = (Date.now() - this._lastTimestamp) / 1000

    // update all components
    super.Update(deltaTime)

    // update all children
    for (const entity of this._entities) {
      entity.Update(deltaTime)
    }

    // update the timestamp
    this._lastTimestamp = Date.now()

    // Invoke on next frame
    window.requestAnimationFrame(() => this.Update())
  }
}
