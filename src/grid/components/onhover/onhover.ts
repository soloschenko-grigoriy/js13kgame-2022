import { OnhoverComponent, Vector2D } from '@/utils'
import { Grid } from '@/grid'

export class GridOnhoverComponent extends OnhoverComponent {
  public Entity: Grid

  public Awake(): void {
    // @todo
  }

  public Update(deltaTime: number): void {
    // @todo
  }

  public HoverOn(point: Vector2D): void {
    this.Entity.Nodes.forEach(node => node.isHovered = node.Occupies(point))
  }
}
