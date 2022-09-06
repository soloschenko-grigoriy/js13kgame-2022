import { Node } from '@/node'
import { TurretDrawComponent, TurretExplosionComponent } from './components'
import { Settings } from '@/settings'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Enemy } from '@/enemy'
import { Nation } from '@/nation'
import { House } from './house'
import { Game } from '@/game'
import { BuildingState } from './state'

export class Turret extends Entity implements IBuilding {
  private _population = 0
  private _templateEml: HTMLElement
  private _defendersLeftElm: HTMLElement
  private _state = BuildingState.Idle

  public get State(): BuildingState {
    return this._state
  }

  public get Population(): number {
    return this._population
  }

  public get Node(): Node {
    return this._node
  }

  constructor(protected readonly _node: Node, private readonly _nation: Nation, moveFrom: House){
    super()

    moveFrom.Move(Settings.buildings.turret.population, this)
  }

  public Awake(): void {
    this.AddComponent(new TurretDrawComponent())
    this.AddComponent(new TurretExplosionComponent())

    this._nation.ReduceTotalPopulation(this._population)

    this._templateEml = document.body.querySelector('#tower') as HTMLElement
    this._defendersLeftElm = this._templateEml.querySelector('#defenders') as HTMLElement
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(this._state === BuildingState.Exploding){
      return
    }

    const neighborWithEnemy = this._node.Neighbors.find(n => !!n.Enemy)
    if(neighborWithEnemy && neighborWithEnemy.Enemy){
      this.Attack(neighborWithEnemy.Enemy)
    }
  }

  public Add(people: number): void {
    this._population += people
  }

  public ShowModal(): void {
    this._defendersLeftElm.innerText = this._population.toString()
    Game.GetInstance().ShowModal(this._templateEml)
  }

  public Destroy(): void {
    // console.log(`Turret destroyed, ${this._population} people died`)
    this.GetComponent(TurretDrawComponent).Clear()
    this.RemoveComponent(TurretDrawComponent)

    this._node.Release()
  }

  private Attack(enemy: Enemy): void{
    enemy.Attack()
    this._population--
    this._nation.ReduceTotalPopulation(1)


    if(this._population < 1){
      this._state = BuildingState.Exploding
    }
  }
}
