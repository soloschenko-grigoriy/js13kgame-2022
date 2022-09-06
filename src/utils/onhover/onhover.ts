import { Entity, IComponent, Vector2D } from '@/utils'

export abstract class OnhoverComponent implements IComponent {
  public abstract Entity: Entity | null

  public abstract Awake(): void

  public abstract Update(deltaTime: number): void

  public abstract HoverOn(point: Vector2D): void
}
