import { Node } from '@/node'
import { TurretDrawComponent, TurretExplosionComponent } from './components'
import { Settings } from '@/settings'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Nation } from '@/nation'
import { House } from './house'
import { Game } from '@/game'
import { BuildingState } from './state'

export class Turret extends Entity implements IBuilding {
  private _population = 0
  private _templateEml: HTMLElement
  private _defendersLeftElm: HTMLElement
  private _state = BuildingState.Idle
  private _nodeWithEnemyToAttack: Node | null

  public get State(): BuildingState {
    return this._state
  }

  public get Population(): number {
    return this._population
  }

  public get Node(): Node {
    return this._node
  }

  public get NodeWithEnemyToAttack(): Node | null {
    return this._nodeWithEnemyToAttack
  }

  constructor(protected readonly _node: Node, private readonly _nation: Nation, movePeopleFrom: House){
    super()

    movePeopleFrom.Move(Settings.buildings.turret.population, this)
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

    const neighborWithEnemy = this._node.Neighbors.find(n => !!n.Enemy && !n.Enemy.AttackedFrom)
    if(neighborWithEnemy && neighborWithEnemy.Enemy){
      this._nodeWithEnemyToAttack = neighborWithEnemy
      this.Attack()
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

  private Attack(): void{
    if(!this._nodeWithEnemyToAttack || !this._nodeWithEnemyToAttack.Enemy){
      return
    }

    this._nodeWithEnemyToAttack.Enemy.Attack(this._node)
    this._population--

    if(this._population < 1){
      this._state = BuildingState.Exploding
    }
  }
}
