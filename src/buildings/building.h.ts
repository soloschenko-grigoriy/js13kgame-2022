import { Node } from '@/node'
import { IAwake, IUpdate } from '@/utils'
export enum BuildingType {
  Turret,
  House
}

export interface IBuilding extends IAwake, IUpdate {
  Node: Node
  Add(people: number): void
  Destroy(): void
  ShowModal(): void
}
