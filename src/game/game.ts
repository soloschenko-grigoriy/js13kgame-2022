import { Entity } from '@/utils'
import { Grid } from '@/grid'
import { GameInputComponent } from './components'

export class Game extends Entity {
  private _lastTimestamp = 0

  private _entities: Entity[] = []

  public get Entities(): Entity[] {
    return this._entities
  }

  constructor(grid: Grid) {
    super()

    this._entities.push(grid)
  }

  public Awake(): void {
    this.AddComponent(new GameInputComponent())

    super.Awake()

    // awake all children
    for (const entity of this.Entities) {
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
    for (const entity of this.Entities) {
      entity.Update(deltaTime)
    }

    // update the timestamp
    this._lastTimestamp = Date.now()

    // Invoke on next frame
    window.requestAnimationFrame(() => this.Update())
  }
}
