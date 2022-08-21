import { Node } from '@/node'
import { HouseDrawComponent } from './components'
import { Entity } from '@/utils'
import { IBuilding } from './building.h'

export class House extends Entity implements IBuilding {
  public get Node(): Node {
    return this._node
  }

  constructor(private readonly _node: Node){
    super()
  }

  public Awake(): void {
    this.AddComponent(new HouseDrawComponent())
  }

  public Update(deltaTime: number): void {
    super.Update(deltaTime)
  }

  public Destroy(): void {
    console.log('house destroyed')
  }
}
