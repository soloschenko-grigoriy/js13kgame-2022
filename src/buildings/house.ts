import { Node } from '@/node'
import { HouseDrawComponent } from './components'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'
import { Settings } from '@/settings'
import { Nation } from '@/nation'

export class House extends Entity implements IBuilding {
  private _population = 0

  public get Population(): number {
    return this._population
  }

  public get Node(): Node {
    return this._node
  }

  constructor(private readonly _node: Node, private readonly _nation: Nation){
    super()

    this._population = Settings.buildings.house.population
  }

  public Awake(): void {
    this.AddComponent(new HouseDrawComponent())
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)
  }

  public Destroy(): void {
    this._nation.ReduceTotalPopulation(this._population)
    console.log(`House destroyed, ${this._population} people died`)
  }
}
