import { IComponent } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Building } from '@/buildings'

export class BuildingDrawTurretComponent implements IComponent {
  public Entity: Building

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {
    CanvasLayer.Background.FillCircle(
      this.Entity.Node.Center,
      Settings.buildings.turret.radius,
      Settings.buildings.turret.color
    )
  }
}
