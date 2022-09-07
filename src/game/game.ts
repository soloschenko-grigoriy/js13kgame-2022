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
  Paused,
  Over
}

export class Game extends Entity {
  private static _instance: Game
  private _lastTimestamp = 0
  private _isModalOpen = false

  private _modalElm: HTMLElement
  private _templateEml: HTMLElement
  private _finalScoreElm: HTMLElement
  private _closeModalBtn: HTMLButtonElement
  private _onClose = ():void => this.HideModal()
  private _entities: Entity[] = []
  private _state: GameState = GameState.Init
  private readonly _grid: Grid
  private readonly _nation: Nation

  public get Nation(): Nation {
    return this._nation
  }

  public get Grid(): Grid {
    return this._grid
  }

  public get IsModalOpen(): boolean {
    return this._isModalOpen
  }

  public get IsRunning(): boolean {
    return this._state === GameState.Running
  }

  public get Entities(): Entity[] {
    return this._entities
  }

  public static GetInstance(): Game {
    if(!this._instance){
      this._instance = new Game()
    }

    return this._instance
  }

  private constructor() {
    super()

    this._grid = new Grid()
    this._nation = new Nation(this._grid)

    const enemyController = new EnemyController(this._grid)

    this._entities.push(this._grid, enemyController, this._nation)
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

  public ShowModal(template: HTMLElement): void {
    if(this._isModalOpen){
      return
    }

    this._isModalOpen = true
    this.Pause()

    this._templateEml = template
    this._closeModalBtn = template.querySelector('.closeModal') as HTMLButtonElement

    this._modalElm.appendChild(this._templateEml)
    this._modalElm.classList.remove(Settings.hiddenClassName)
    this._templateEml.classList.remove(Settings.hiddenClassName)

    if(this._closeModalBtn){
      this._closeModalBtn.addEventListener('click', this._onClose)
    }
  }

  public HideModal(): void {
    this._modalElm.classList.add(Settings.hiddenClassName)
    this._templateEml.classList.add(Settings.hiddenClassName)

    document.body.appendChild(this._templateEml)

    if(this._closeModalBtn){
      this._closeModalBtn.removeEventListener('click', this._onClose)
    }

    this.Resume()

    setTimeout(() => {
      this._isModalOpen = false
    }, 0)
  }

  private Pause(): void {
    if(this._state !== GameState.Running){
      return
    }

    this._state = GameState.Paused
  }

  private Resume(): void {
    if(this._state !== GameState.Paused){
      return
    }

    this._state = GameState.Running
    this.Update()
  }

  private GameOver(): void {
    this.RemoveComponent(GameInputComponent)

    const template = document.body.querySelector('#gameOverTemplate') as HTMLElement
    this._finalScoreElm.innerHTML = this._nation.PeopleSaved.toString()

    this._state = GameState.Over

    setTimeout(() => {
      this.ShowModal(template)
    }, 0)
  }
}
