/**
 * Terrain & Mountain Geology Engine — Le Mythe de Sisyphe
 * High-fidelity organic mountain terrain inspired by acclaimed indie classics
 * (Getting Over It, Limbo, Gustave Doré antique engravings, and Itch.io community favorites).
 * 
 * Features:
 * - Natural geological strata, weathered granite shelves & carved pilgrimage steps
 * - Multi-layered bedrock shading with copperplate crosshatching & sediment faults
 * - Chiseled stone pavers with cracks, bevels, and antique chisel marks
 * - Alpine moss, mountain lichen, and rock fissures
 * - Tactile trail rim with stone bevel highlight and deep ambient occlusion
 * - Loose scree pebbles, gravel, and mineral flecks
 */

export class MountainTerrain {
  private static readonly BASE_SLOPE_ANGLE = 0.44; // ~25.2 degrees in radians

  /**
   * Calculates organic elevation displacement at any world horizontal position.
   * Alternates between:
   * 1. Ancient carved stone steps with flat treads and small vertical rises
   * 2. Natural granite crags & rolling rock shelves
   * 3. Micro-roughness (fissures, gravel, uneven pavers)
   */
  public static getDisplacement(worldX: number): {
    offsetY: number;
    stepTread: boolean;
    cragType: 'SMOOTH' | 'STEP' | 'CRAG' | 'GRAVEL';
  } {
    // 1. Ancient carved stone steps
    const stepPeriod = 85;
    const stepPhase = ((worldX % stepPeriod) + stepPeriod) % stepPeriod;
    let stepOffset = 0;
    let isStep = false;

    if (stepPhase < 60) {
      // Carved stone tread
      const u = stepPhase / 60;
      stepOffset = Math.sin(u * Math.PI) * 2.8;
      isStep = true;
    } else {
      // Step riser
      const u = (stepPhase - 60) / 25;
      stepOffset = Math.sin(u * Math.PI * 0.5) * -5.0;
    }

    // 2. Rolling geological shelves (medium frequency)
    const shelfWave = Math.sin(worldX * 0.008) * 8.5 + Math.cos(worldX * 0.021) * 4.8;

    // 3. High-frequency craggy roughness & rock fractures
    const cragRoughness = Math.sin(worldX * 0.075) * 2.0 + Math.cos(worldX * 0.16) * 1.4;

    const totalOffset = stepOffset + shelfWave + cragRoughness;
    const cragType = isStep ? 'STEP' : Math.abs(cragRoughness) > 2.2 ? 'CRAG' : 'SMOOTH';

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
   * Renders the complete multi-layered mountain slope
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
    const stepSize = 10;
    const points: { x: number; y: number }[] = [];
    const startX = -80;
    const endX = width + 80;

    for (let x = startX; x <= endX; x += stepSize) {
      const y = this.getScreenTerrainY(x, baseStartY, slopeStartX, scrollOffset);
      points.push({ x, y });
    }

    // 2. Fill Main Mountain Mass (Deep Bedrock with rich vertical gradient)
    const mountainGrad = ctx.createLinearGradient(0, height * 0.2, 0, height);
    if (nightTime) {
      mountainGrad.addColorStop(0, '#121118');
      mountainGrad.addColorStop(0.35, '#0E0D12');
      mountainGrad.addColorStop(1, '#060608');
    } else {
      mountainGrad.addColorStop(0, '#221E18');
      mountainGrad.addColorStop(0.35, '#171410');
      mountainGrad.addColorStop(1, '#0C0A08');
    }

    ctx.fillStyle = mountainGrad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(endX, height + 60);
    ctx.lineTo(startX, height + 60);
    ctx.closePath();
    ctx.fill();

    // 3. Subterranean Sediment Fault Lines & Copperplate Crosshatching
    const numStrata = 11;
    ctx.strokeStyle = nightTime ? 'rgba(65, 62, 75, 0.42)' : 'rgba(92, 82, 70, 0.38)';
    ctx.lineWidth = 1.3;

    for (let s = 1; s <= numStrata; s++) {
      const depth = s * 19;
      ctx.beginPath();
      for (let i = 0; i < points.length; i += 2) {
        const px = points[i].x;
        const py = points[i].y + depth + Math.sin((px + scrollOffset) * 0.035 + s * 1.2) * 4;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Copperplate diagonal hatching strokes
    ctx.strokeStyle = nightTime ? 'rgba(50, 48, 58, 0.32)' : 'rgba(78, 68, 56, 0.28)';
    ctx.lineWidth = 1.0;
    const hatchSpacing = 24;
    const hatchOffset = (scrollOffset * 0.8) % hatchSpacing;

    for (let hx = startX - hatchOffset; hx < endX; hx += hatchSpacing) {
      const surfaceY = this.getScreenTerrainY(hx, baseStartY, slopeStartX, scrollOffset);
      ctx.beginPath();
      ctx.moveTo(hx, surfaceY + 5);
      ctx.lineTo(hx - 18, surfaceY + 48);
      ctx.stroke();

      // Deeper counter-hatching
      ctx.beginPath();
      ctx.moveTo(hx - 6, surfaceY + 52);
      ctx.lineTo(hx - 22, surfaceY + 84);
      ctx.stroke();
    }

    // 4. Embedded Ancient Stone Flagstones & Steps (Worn Ancient Masonry)
    const stepInterval = 85;
    const firstStepWorldX = Math.floor(scrollOffset / stepInterval) * stepInterval;

    for (let w = firstStepWorldX - stepInterval; w < firstStepWorldX + width + stepInterval * 2; w += stepInterval) {
      const stepScreenX = w - scrollOffset;
      if (stepScreenX >= -50 && stepScreenX <= width + 50) {
        const stepY = this.getScreenTerrainY(stepScreenX, baseStartY, slopeStartX, scrollOffset);

        // Stone Paver Block
        ctx.fillStyle = nightTime ? '#22202A' : '#2D2821';
        ctx.strokeStyle = nightTime ? '#524E5C' : '#685C4D';
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        ctx.moveTo(stepScreenX - 18, stepY + 1);
        ctx.lineTo(stepScreenX + 22, stepY + 1);
        ctx.lineTo(stepScreenX + 19, stepY + 8);
        ctx.lineTo(stepScreenX - 15, stepY + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Paver top stone bevel highlight
        ctx.strokeStyle = nightTime ? 'rgba(160, 155, 175, 0.35)' : 'rgba(215, 195, 165, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(stepScreenX - 17, stepY + 1.5);
        ctx.lineTo(stepScreenX + 21, stepY + 1.5);
        ctx.stroke();

        // Chisel grooves & ancient cracks
        ctx.strokeStyle = nightTime ? 'rgba(15, 14, 18, 0.7)' : 'rgba(18, 16, 13, 0.7)';
        ctx.beginPath();
        ctx.moveTo(stepScreenX - 8, stepY + 2);
        ctx.lineTo(stepScreenX - 7, stepY + 7);
        ctx.moveTo(stepScreenX + 8, stepY + 2);
        ctx.lineTo(stepScreenX + 9, stepY + 7);
        ctx.stroke();

        // Alpine moss tuft on the paver edge
        ctx.fillStyle = nightTime ? 'rgba(45, 65, 50, 0.65)' : 'rgba(84, 102, 58, 0.65)';
        ctx.beginPath();
        ctx.ellipse(stepScreenX - 16, stepY + 2, 3.5, 2.0, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Ambient Occlusion Layer directly under surface
    ctx.strokeStyle = nightTime ? 'rgba(8, 7, 10, 0.85)' : 'rgba(12, 10, 8, 0.85)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y + 3);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y + 3);
    }
    ctx.stroke();

    // 6. Sculpted Trail Surface Rim Line (Sunlit Granite Ridge)
    const rimGrad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.9);
    if (nightTime) {
      rimGrad.addColorStop(0, '#7A768A');
      rimGrad.addColorStop(0.5, '#9490A6');
      rimGrad.addColorStop(1, '#656173');
    } else {
      rimGrad.addColorStop(0, '#B8A48D');
      rimGrad.addColorStop(0.5, '#D5C4AB');
      rimGrad.addColorStop(1, '#8C7A65');
    }

    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 7. Scattered Loose Scree, Pebbles & Mineral Flecks
    ctx.fillStyle = nightTime ? '#484452' : '#5A4E3E';
    const pebbleInterval = 38;
    const firstPebbleX = Math.floor(scrollOffset / pebbleInterval) * pebbleInterval;

    for (let p = firstPebbleX; p < firstPebbleX + width + 80; p += pebbleInterval) {
      const pScreenX = p - scrollOffset;
      if (pScreenX > -20 && pScreenX < width + 20) {
        const pY = this.getScreenTerrainY(pScreenX, baseStartY, slopeStartX, scrollOffset);
        const pSize = 1.6 + ((p * 17) % 3.5);
        ctx.beginPath();
        ctx.ellipse(pScreenX, pY - 0.5, pSize, pSize * 0.65, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Tiny white mineral sparkle on some pebbles
        if (p % 3 === 0) {
          ctx.fillStyle = nightTime ? '#B0ACC2' : '#F2E8DC';
          ctx.fillRect(pScreenX - 0.5, pY - 1.2, 1, 1);
          ctx.fillStyle = nightTime ? '#484452' : '#5A4E3E';
        }
      }
    }

    ctx.restore();
  }
}
