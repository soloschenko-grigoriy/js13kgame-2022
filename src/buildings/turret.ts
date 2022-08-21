import { Node } from '@/node'
import { TurretDrawComponent } from './components'
import { Settings } from '@/settings'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Enemy } from '@/enemy'
import { Nation } from '@/nation'

export class Turret extends Entity implements IBuilding {
  private _charge: number = Settings.buildings.turret.charge

  private _population = 0

  public get Population(): number {
    return this._population
  }

  public get Charge(): number{
    return this._charge
  }

  public get Node(): Node {
    return this._node
  }

  constructor(protected readonly _node: Node, private readonly _nation: Nation){
    super()

    this._population = Settings.buildings.turret.population
  }

  public Awake(): void {
    this.AddComponent(new TurretDrawComponent())
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)

    if(this._charge < 1){
      return
    }

    const neighborWithEnemy = this._node.Neighbors.find(n => !!n.Enemy)
    if(neighborWithEnemy && neighborWithEnemy.Enemy){
      this.Attack(neighborWithEnemy.Enemy)
    }
  }

  public Destroy(): void {
    this._nation.ReduceTotalPopulation(this._population)
    console.log(`Turret destroyed, ${this._population} people died`)
  }

  private Attack(enemy: Enemy): void{
    enemy.Kill()

    this._charge--
  }
}
