import { IComponent } from '@/utils'
import { CanvasLayer } from '@/canvas-layer'
import { Settings } from '@/settings'
import { Building } from '@/buildings'

export class BuildingDrawHouseComponent implements IComponent {
  public Entity: Building

  public Awake(): void {
    this.Draw()
  }

  public Update(deltaTime: number): void {
    this.Draw()
  }

  private Draw(): void {
    CanvasLayer.Background.FillRect(
      this.Entity.Node.Start,
      this.Entity.Node.Size,
      Settings.buildings.house.color
    )
  }
}
