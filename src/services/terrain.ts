/**
 * Terrain & Mountain Geology Engine — Le Mythe de Sisyphe
 * Replaces the flat mathematical diagonal line with living, organic,
 * geological mountain terrain inspired by antique engravings (Doré) and Limbo.
 * 
 * Features:
 * - Ancient pilgrimage stone steps carved into the rock face
 * - Undulating granite shelves and rough crags
 * - Weathered flagstones, bedrock fractures, and loose gravel
 * - Multi-layered crosshatch shading beneath the path surface
 */

export interface TerrainPoint {
  x: number;
  y: number;
  surfaceAngle: number;
}

export class MountainTerrain {
  private static readonly BASE_SLOPE_ANGLE = 0.44; // ~25.2 degrees

  /**
   * Calculates the organic elevation displacement at any world horizontal position.
   * Creates an alternating rhythm of:
   * 1. Ancient stone steps (flat tread ledges + small vertical rises)
   * 2. Natural granite crags & rolling rock shelves
   * 3. Rocky outcroppings and crevices
   */
  public static getDisplacement(worldX: number): {
    offsetY: number;
    stepTread: boolean;
    cragType: 'SMOOTH' | 'STEP' | 'CRAG' | 'GRAVEL';
  } {
    // 1. Ancient worn stone steps carved into the mountain
    // Repeating sequence every 80px: 55px gently sloping tread, followed by a 4-7px drop/rise
    const stepPeriod = 90;
    const stepPhase = ((worldX % stepPeriod) + stepPeriod) % stepPeriod;
    let stepOffset = 0;
    let isStep = false;

    if (stepPhase < 65) {
      // Flatter carved stone tread (easier footing)
      const u = stepPhase / 65;
      stepOffset = Math.sin(u * Math.PI) * 2.5;
      isStep = true;
    } else {
      // The riser edge of the ancient stone flag
      const u = (stepPhase - 65) / 25;
      stepOffset = Math.sin(u * Math.PI * 0.5) * -4.5;
    }

    // 2. Geological undulation (undulating mountain shelves)
    const shelfWave = Math.sin(worldX * 0.007) * 9.0 + Math.cos(worldX * 0.019) * 4.5;

    // 3. High-frequency craggy roughness (pebbles, fissures, fractures)
    const cragRoughness = Math.sin(worldX * 0.08) * 1.8 + Math.cos(worldX * 0.17) * 1.2;

    const totalOffset = stepOffset + shelfWave + cragRoughness;
    const cragType = isStep ? 'STEP' : Math.abs(cragRoughness) > 2 ? 'CRAG' : 'SMOOTH';

    return {
      offsetY: totalOffset,
      stepTread: isStep,
      cragType
    };
  }

  /**
   * Computes the screen Y coordinate of the terrain at any screen X
   */
  public static getScreenTerrainY(
    screenX: number,
    baseStartY: number,
    slopeStartX: number,
    scrollOffset: number
  ): number {
    const rawDiagonalY = baseStartY - (screenX - slopeStartX) * Math.tan(this.BASE_SLOPE_ANGLE);
    const worldX = screenX + scrollOffset;
    const disp = this.getDisplacement(worldX);
    return rawDiagonalY + disp.offsetY;
  }

  /**
   * Renders the complete multi-layered mountain terrain:
   * - Living rocky path contour with carved steps
   * - Cross-hatched bedrock strata (Gustave Doré / copperplate style)
   * - Loose pebbles, ancient stones, and embedded flagstones
   */
  public static renderTerrain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    slopeStartX: number,
    baseStartY: number,
    scrollOffset: number,
    nightTime: boolean,
    biomeColor: string
  ) {
    ctx.save();

    // 1. Compute path vertices across the screen
    const stepSize = 12; // High-resolution polygon
    const points: { x: number; y: number }[] = [];

    const startX = -60;
    const endX = width + 60;

    for (let x = startX; x <= endX; x += stepSize) {
      const y = this.getScreenTerrainY(x, baseStartY, slopeStartX, scrollOffset);
      points.push({ x, y });
    }

    // 2. Fill Main Mountain Mass (Bedrock)
    ctx.fillStyle = nightTime ? '#0B0A0C' : '#141210';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(endX, height + 40);
    ctx.lineTo(startX, height + 40);
    ctx.closePath();
    ctx.fill();

    // 3. Geological Strata & Copperplate Crosshatching Under the Surface
    // Gives deep tactile solidity instead of an empty dark void
    const numStrata = 9;
    ctx.strokeStyle = nightTime ? 'rgba(50, 48, 56, 0.45)' : 'rgba(80, 72, 62, 0.35)';
    ctx.lineWidth = 1.2;

    for (let s = 1; s <= numStrata; s++) {
      const depth = s * 22;
      ctx.beginPath();
      for (let i = 0; i < points.length; i += 3) {
        const px = points[i].x;
        const py = points[i].y + depth + Math.sin((px + scrollOffset) * 0.04 + s) * 3;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Diagonal Doré hatching strokes along the bedrock face
    ctx.strokeStyle = nightTime ? 'rgba(40, 38, 45, 0.35)' : 'rgba(68, 60, 50, 0.28)';
    ctx.lineWidth = 1.0;
    const hatchSpacing = 28;
    const hatchOffset = (scrollOffset * 0.8) % hatchSpacing;

    for (let hx = startX - hatchOffset; hx < endX; hx += hatchSpacing) {
      const surfaceY = this.getScreenTerrainY(hx, baseStartY, slopeStartX, scrollOffset);
      ctx.beginPath();
      ctx.moveTo(hx, surfaceY + 6);
      ctx.lineTo(hx - 16, surfaceY + 44);
      ctx.stroke();

      // Second counter-hatch on lower layer
      ctx.beginPath();
      ctx.moveTo(hx - 8, surfaceY + 48);
      ctx.lineTo(hx - 22, surfaceY + 76);
      ctx.stroke();
    }

    // 4. Highlight & Rocky Rim Line of the Trail
    ctx.strokeStyle = nightTime ? '#605E6B' : '#7D6F5E';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 5. Embedded Ancient Stone Flagstones & Steps Detail
    // Draw worn pavers embedded into the trail surface
    ctx.strokeStyle = nightTime ? '#45424D' : '#5E5244';
    ctx.fillStyle = nightTime ? '#1C1A20' : '#26221C';
    ctx.lineWidth = 1.4;

    const stepInterval = 90;
    const firstStepWorldX = Math.floor(scrollOffset / stepInterval) * stepInterval;

    for (let w = firstStepWorldX - stepInterval; w < firstStepWorldX + width + stepInterval * 2; w += stepInterval) {
      const stepScreenX = w - scrollOffset;
      if (stepScreenX >= -40 && stepScreenX <= width + 40) {
        const stepY = this.getScreenTerrainY(stepScreenX, baseStartY, slopeStartX, scrollOffset);

        // Draw a stone paver block embedded in the soil
        ctx.beginPath();
        ctx.moveTo(stepScreenX - 16, stepY + 1);
        ctx.lineTo(stepScreenX + 18, stepY + 1);
        ctx.lineTo(stepScreenX + 16, stepY + 7);
        ctx.lineTo(stepScreenX - 14, stepY + 7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Chisel mark lines on the stone flag
        ctx.beginPath();
        ctx.moveTo(stepScreenX - 8, stepY + 2);
        ctx.lineTo(stepScreenX - 8, stepY + 6);
        ctx.moveTo(stepScreenX + 6, stepY + 2);
        ctx.lineTo(stepScreenX + 6, stepY + 6);
        ctx.stroke();
      }
    }

    // 6. Scattered Crags & Loose Pebbles on Trail
    // Adds organic texture where grit breaks loose
    ctx.fillStyle = nightTime ? '#3A3842' : '#4E4438';
    const pebbleInterval = 44;
    const firstPebbleX = Math.floor(scrollOffset / pebbleInterval) * pebbleInterval;

    for (let p = firstPebbleX; p < firstPebbleX + width + 100; p += pebbleInterval) {
      const pScreenX = p - scrollOffset;
      if (pScreenX > -20 && pScreenX < width + 20) {
        const pY = this.getScreenTerrainY(pScreenX, baseStartY, slopeStartX, scrollOffset);
        const pSize = 1.5 + ((p * 13) % 4);
        ctx.beginPath();
        ctx.ellipse(pScreenX, pY - 0.5, pSize, pSize * 0.6, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
