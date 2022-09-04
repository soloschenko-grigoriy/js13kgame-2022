import { Entity } from '@/utils'
import { Grid } from '@/grid'
import { GameInputComponent } from './components'
import { EnemyController } from '@/enemy-controller'
import { Nation } from '@/nation'
import { GameHUDComponent } from './components'
import { Settings } from '@/settings/settings'

enum GameState {
  Init,
  Running,
  Over
}

export class Game extends Entity {
  private _lastTimestamp = 0
  private _modalElm: HTMLElement
  private _templateEml: HTMLElement
  private _finalScoreElm: HTMLElement


  private _entities: Entity[] = []

  private _state: GameState = GameState.Init

  public get Nation(): Nation {
    return this._nation
  }

  public get Entities(): Entity[] {
    return this._entities
  }

  constructor(private readonly _grid: Grid, enemyController: EnemyController, private readonly _nation: Nation) {
    super()

    this._entities.push(_grid, enemyController, _nation)
  }

  public Awake(): void {
    this._state = GameState.Running

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

    this._modalElm = document.body.querySelector('.modal') as HTMLElement
    this._templateEml = document.body.querySelector('#gameOverTemplate') as HTMLElement
    this._finalScoreElm = document.body.querySelector('#finalScore') as HTMLElement
  }

  public Update(): void {
    if(this._state !== GameState.Running){
      return
    }

    const hasAnyNonCorrupted = this._grid.Nodes.some(n => !n.IsCorrupted)
    if(this.Nation.PeopleInDanger <= 0 || !hasAnyNonCorrupted){
      this.GameOver()
      return
    }

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

  private GameOver(): void {
    this._state = GameState.Over
    console.log('game is done for')

    this._finalScoreElm.innerHTML = this._nation.PeopleSaved.toString()

    this._modalElm.appendChild(this._templateEml)
    this._modalElm.classList.remove(Settings.hiddenClassName)
    this._templateEml.classList.remove(Settings.hiddenClassName)
  }
}
