/**
 * Biomechanical Stickman Engine — Le Mythe de Sisyphe
 * Physics-based articulated stickman with 2-Bone Analytical Inverse Kinematics (IK),
 * authentic muscular strain, heavy boulder weight transmission, and ground-locking feet.
 * 
 * Inspired by classic Flash physics stickman games, Pivot Animator, and Box2D ragdolls.
 */

import { GameStatus } from '../types/game';

interface Point2D {
  x: number;
  y: number;
}

export class StickmanRenderer {
  // Constant rigid bone lengths (prevents noodle/rubber legs!)
  private static readonly THIGH_LEN = 26;
  private static readonly SHIN_LEN = 27;
  private static readonly UPPER_ARM_LEN = 21;
  private static readonly FOREARM_LEN = 21;

  /**
   * Solves 2-Bone Analytical Inverse Kinematics (Law of Cosines)
   * Guarantees bone lengths remain 100% constant during all movements.
   * @param root Starting joint (Hip or Shoulder)
   * @param target End effector (Foot or Hand)
   * @param l1 Length of bone 1 (Thigh or Upper arm)
   * @param l2 Length of bone 2 (Shin or Forearm)
   * @param bendPositive Direction of joint bend (+1 for forward knee / backward elbow)
   */
  public static solve2BoneIK(
    root: Point2D,
    target: Point2D,
    l1: number,
    l2: number,
    bendPositive: boolean = true
  ): Point2D {
    const dx = target.x - root.x;
    const dy = target.y - root.y;
    const distSq = dx * dx + dy * dy;
    let dist = Math.sqrt(distSq);

    // Prevent hyper-extension or zero division
    const maxReach = l1 + l2 - 0.4;
    const minReach = Math.abs(l1 - l2) + 0.5;
    dist = Math.max(minReach, Math.min(maxReach, dist));

    // Law of Cosines
    const cosAngle1 = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
    const clampedCos = Math.max(-1, Math.min(1, cosAngle1));
    const angleOffset = Math.acos(clampedCos);

    const baseAngle = Math.atan2(dy, dx);
    const jointAngle = baseAngle + (bendPositive ? angleOffset : -angleOffset);

    return {
      x: root.x + Math.cos(jointAngle) * l1,
      y: root.y + Math.sin(jointAngle) * l1
    };
  }

  /**
   * Main Stickman Render Routine
   * Coordinates torso, curved spine, articulated legs, and gripped hands.
   */
  public static renderStickman(
    ctx: CanvasRenderingContext2D,
    status: GameStatus,
    isPushing: boolean,
    distance: number,
    time: number,
    boulderRadius: number,
    onFootstep?: () => void
  ) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (status === 'DESCENDING') {
      this.renderDescentStroll(ctx, time);
    } else if (status === 'CRASHING') {
      this.renderCollapsedPosture(ctx, time);
    } else {
      this.renderBoulderPushing(ctx, status, isPushing, distance, time, boulderRadius);
    }

    ctx.restore();
  }

  /**
   * PUSHING / ISOMETRIC HOLD / SLIPPING
   * Here we transmit the colossal weight of the boulder into the stickman's body!
   */
  private static renderBoulderPushing(
    ctx: CanvasRenderingContext2D,
    status: GameStatus,
    isPushing: boolean,
    distance: number,
    time: number,
    boulderRadius: number
  ) {
    const isActivelyPushing = status === 'PUSHING' && isPushing;
    const isSlipping = status === 'SLIPPING';

    // 1. Muscular strain tremble: High-frequency muscle contraction under immense load
    const strainTremor = isActivelyPushing
      ? Math.sin(time * 0.09) * 1.6 + Math.cos(time * 0.22) * 0.8
      : isSlipping
      ? Math.sin(time * 0.18) * 3.2
      : Math.sin(time * 0.04) * 0.7; // subtle isometric tremble when holding

    // 2. Heavy Heave-and-Surge Cadence
    // When pushing uphill, movement comes in powerful rhythmic surges
    const strideScale = 3.6; // Stride cycle frequency
    const rawCycle = (distance * strideScale) % (Math.PI * 2);
    const strideCycle = (rawCycle + Math.PI * 2) % (Math.PI * 2);

    // Effort heave: Sisyphus surges into the rock during power strokes
    const effortHeave = isActivelyPushing ? Math.sin(strideCycle * 2) * 2.5 : 0;

    // 3. Torso & Hips Posture
    // Extreme forward lean (center of mass thrown deep into the boulder!)
    const leanForwardX = isActivelyPushing ? 24 : isSlipping ? -4 : 14;
    const crouchY = isActivelyPushing ? 3 : isSlipping ? -2 : 0;

    // Hip Anchor (Root of legs and spine)
    const hip: Point2D = {
      x: -24 + (isSlipping ? -8 : 0) + strainTremor * 0.2,
      y: -29 + crouchY + effortHeave * 0.8
    };

    // Shoulder Anchor (High forward lean into the boulder)
    const shoulder: Point2D = {
      x: hip.x + 22 + leanForwardX + strainTremor * 0.3,
      y: -46 - crouchY + effortHeave * 0.4
    };

    // Spine Midpoint (Curved thoracic arch under heavy load)
    const spineMid: Point2D = {
      x: (hip.x + shoulder.x) * 0.5 + (isActivelyPushing ? 4.5 : 2),
      y: (hip.y + shoulder.y) * 0.5 - 2
    };

    // Head Position (Tucked forward and down against the boulder)
    const head: Point2D = {
      x: shoulder.x + (isActivelyPushing ? 9 : 7),
      y: shoulder.y - (isActivelyPushing ? 7 : 9)
    };

    // Hand Contact Points on the Boulder Surface
    // Boulder center is at (boulderRadius * 0.95, -boulderRadius)
    // Hands brace firmly against the curved stone surface
    const handNear: Point2D = {
      x: shoulder.x + (isActivelyPushing ? 17 : 12),
      y: -36 + (isActivelyPushing ? 0 : 2)
    };
    const handFar: Point2D = {
      x: shoulder.x + (isActivelyPushing ? 20 : 15),
      y: -47 + (isActivelyPushing ? 0 : -2)
    };

    // -----------------------------------------------------------
    // 4. LEGS - CALCULATING REALISTIC WEIGHT & GROUND CONTACT
    // -----------------------------------------------------------
    // We compute exact ground contact points (feet) with heel & toe articulation,
    // then use analytical 2-bone IK to solve the knee joint!

    const computeLegFootPos = (phase: number, isFar: boolean): { foot: Point2D; isGrounded: boolean } => {
      const normPhase = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

      if (isSlipping) {
        // Frantic skidding backward on the slope
        const skidOffset = isFar ? -12 : 4;
        return {
          foot: { x: hip.x - 14 + skidOffset + strainTremor, y: 0 },
          isGrounded: true
        };
      }

      if (isActivelyPushing) {
        // Full mechanical push stroke:
        // Half cycle: Drive stroke (Foot locked to ground, hip surges forward over it)
        // Half cycle: Recovery stroke (Foot lifts, knee bends sharp forward, foot plants)
        if (normPhase < Math.PI) {
          // DRIVE STROKE: Foot firmly planted on stone, driving backwards relative to hip
          const u = normPhase / Math.PI; // 0 to 1
          // Foot starts forward (+12px ahead of hip), extends back (-28px behind hip)
          const fx = hip.x + 10 - u * 38;
          return {
            foot: { x: fx, y: 0 },
            isGrounded: true
          };
        } else {
          // RECOVERY / STEP STROKE: Foot lifts off ground and swings forward
          const u = (normPhase - Math.PI) / Math.PI; // 0 to 1
          const fx = hip.x - 28 + u * 38;
          // Parabolic foot lift off ground
          const liftHeight = Math.sin(u * Math.PI) * 12;
          return {
            foot: { x: fx, y: -liftHeight },
            isGrounded: false
          };
        }
      }

      // ISOMETRIC BRACE (Idle holding):
      // Feet are braced into rock crevices!
      if (isFar) {
        // Rear brace leg: extended far back to prevent boulder from rolling down
        return {
          foot: { x: hip.x - 26, y: 0 },
          isGrounded: true
        };
      } else {
        // Front support leg: bent under hip
        return {
          foot: { x: hip.x + 6, y: 0 },
          isGrounded: true
        };
      }
    };

    // Calculate feet positions
    const farLegData = computeLegFootPos(strideCycle + Math.PI, true);
    const nearLegData = computeLegFootPos(strideCycle, false);

    // Solve knees via Analytical 2-Bone IK
    // Bend knee forward (bendPositive = false in screen coordinate system where +Y is down)
    const farKnee = this.solve2BoneIK(hip, farLegData.foot, this.THIGH_LEN, this.SHIN_LEN, false);
    const nearKnee = this.solve2BoneIK(hip, nearLegData.foot, this.THIGH_LEN, this.SHIN_LEN, false);

    // -----------------------------------------------------------
    // 5. DRAWING THE STICKMAN IN DEPTH LAYERS
    // Layer 1: Far Arm (Behind boulder)
    // Layer 2: Far Leg (Darker tone, background)
    // Layer 3: Torso & Spine (Muscular curved line)
    // Layer 4: Head & Face
    // Layer 5: Near Leg (Main foreground leg)
    // Layer 6: Near Arm (Braced against boulder)
    // -----------------------------------------------------------

    // A. Far Arm (Background)
    ctx.save();
    ctx.strokeStyle = '#38322B';
    ctx.lineWidth = 3.6;
    const farElbow = this.solve2BoneIK(shoulder, handFar, this.UPPER_ARM_LEN, this.FOREARM_LEN, true);
    ctx.beginPath();
    ctx.moveTo(shoulder.x - 1, shoulder.y);
    ctx.lineTo(farElbow.x, farElbow.y);
    ctx.lineTo(handFar.x, handFar.y);
    ctx.stroke();
    // Far hand palm flat against stone
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(handFar.x, handFar.y - 3);
    ctx.lineTo(handFar.x + 4, handFar.y);
    ctx.lineTo(handFar.x, handFar.y + 3);
    ctx.stroke();
    ctx.restore();

    // B. Far Leg (Background)
    ctx.save();
    ctx.strokeStyle = '#363029';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(farKnee.x, farKnee.y);
    ctx.lineTo(farLegData.foot.x, farLegData.foot.y);
    // Articulated foot (Heel & gripping toe)
    ctx.lineTo(farLegData.foot.x + (isActivelyPushing ? 6 : 5), farLegData.foot.y);
    ctx.stroke();
    ctx.restore();

    // C. Slipping skid marks
    if (isSlipping) {
      ctx.save();
      ctx.strokeStyle = 'rgba(235, 220, 200, 0.6)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-45, 0);
      ctx.lineTo(-20, 0);
      ctx.moveTo(-22, 0);
      ctx.lineTo(-6, 0);
      ctx.stroke();
      ctx.restore();
    }

    // D. Near Leg (Foreground - Heavy solid black)
    ctx.save();
    ctx.strokeStyle = '#090807';
    ctx.lineWidth = 4.8;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(nearKnee.x, nearKnee.y);
    ctx.lineTo(nearLegData.foot.x, nearLegData.foot.y);
    // Articulated foot digging in
    ctx.lineTo(nearLegData.foot.x + (isActivelyPushing ? 7 : 5), nearLegData.foot.y);
    ctx.stroke();

    // Ankle & Heel joint accent
    ctx.fillStyle = '#090807';
    ctx.beginPath();
    ctx.arc(nearLegData.foot.x, nearLegData.foot.y - 1, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // E. Spine & Torso (Curved anatomical arc)
    ctx.save();
    ctx.strokeStyle = '#090807';
    ctx.lineWidth = 5.2;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.quadraticCurveTo(spineMid.x, spineMid.y, shoulder.x, shoulder.y);
    ctx.stroke();
    ctx.restore();

    // F. Head (Solid circle tucked into the rock)
    ctx.save();
    ctx.fillStyle = '#090807';
    ctx.beginPath();
    ctx.arc(head.x, head.y, 8.0, 0, Math.PI * 2);
    ctx.fill();

    // Exertion sweat droplets spraying from forehead and back under colossal strain
    if (isActivelyPushing) {
      ctx.fillStyle = 'rgba(217, 180, 110, 0.85)';
      for (let s = 0; s < 3; s++) {
        const dropX = head.x - 7 - Math.sin(time * 0.05 + s) * 8;
        const dropY = head.y - 2 + Math.cos(time * 0.08 + s) * 7;
        ctx.beginPath();
        ctx.arc(dropX, dropY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hot breath vapor puff expelled toward boulder
      const breathPulse = Math.sin(time * 0.008);
      if (breathPulse > 0.2) {
        ctx.fillStyle = `rgba(235, 230, 220, ${0.12 * breathPulse})`;
        ctx.beginPath();
        ctx.ellipse(head.x + 8, head.y + 4, 6 * breathPulse, 3.5 * breathPulse, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // G. Near Arm (Foreground - Hydraulic force braced on stone)
    ctx.save();
    ctx.strokeStyle = '#090807';
    ctx.lineWidth = 4.6;
    const nearElbow = this.solve2BoneIK(shoulder, handNear, this.UPPER_ARM_LEN, this.FOREARM_LEN, true);
    ctx.beginPath();
    ctx.moveTo(shoulder.x + 1, shoulder.y);
    ctx.lineTo(nearElbow.x, nearElbow.y);
    ctx.lineTo(handNear.x, handNear.y);
    ctx.stroke();

    // Strong palm pressed flat against the boulder tangent
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(handNear.x, handNear.y - 4);
    ctx.lineTo(handNear.x + 5, handNear.y);
    ctx.lineTo(handNear.x, handNear.y + 4);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * PHILOSOPHICAL DESCENT (Camus's Conscious Walk Downhill)
   * Sisyphus walks freely down the mountain, conscious and sovereign.
   */
  private static renderDescentStroll(ctx: CanvasRenderingContext2D, time: number) {
    // Flip facing downhill (to the left)
    ctx.scale(-1, 1);
    ctx.fillStyle = '#090807';
    ctx.strokeStyle = '#090807';

    const walkCadence = time * 0.0042;
    const stride = Math.sin(walkCadence);
    const hipBob = Math.abs(Math.sin(walkCadence * 2)) * 2.2;

    const hip: Point2D = { x: 0, y: -29 + hipBob };
    const shoulder: Point2D = { x: 2, y: -54 };
    const head: Point2D = { x: 3, y: -64 };

    // Far Leg
    ctx.save();
    ctx.strokeStyle = '#36302A';
    ctx.lineWidth = 3.8;
    const farFoot: Point2D = { x: hip.x - stride * 15, y: 0 };
    const farKnee = this.solve2BoneIK(hip, farFoot, this.THIGH_LEN, this.SHIN_LEN, false);
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(farKnee.x, farKnee.y);
    ctx.lineTo(farFoot.x, farFoot.y);
    ctx.lineTo(farFoot.x + 5, farFoot.y);
    ctx.stroke();
    ctx.restore();

    // Near Leg
    ctx.lineWidth = 4.4;
    const nearFoot: Point2D = { x: hip.x + stride * 15, y: 0 };
    const nearKnee = this.solve2BoneIK(hip, nearFoot, this.THIGH_LEN, this.SHIN_LEN, false);
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(nearKnee.x, nearKnee.y);
    ctx.lineTo(nearFoot.x, nearFoot.y);
    ctx.lineTo(nearFoot.x + 5, nearFoot.y);
    ctx.stroke();

    // Spine (relaxed, upright, dignified)
    ctx.lineWidth = 4.8;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(head.x, head.y, 8.0, 0, Math.PI * 2);
    ctx.fill();

    // Arms swinging freely in rhythm with walking
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.lineTo(shoulder.x - stride * 9, shoulder.y + 13);
    ctx.lineTo(shoulder.x - stride * 14, shoulder.y + 24);
    ctx.stroke();
  }

  /**
   * COLLAPSED POSTURE (Crashing / Momentary Defeat)
   * Sisyphus dropped to his knees on the rocks, watching the boulder tumble down.
   */
  private static renderCollapsedPosture(ctx: CanvasRenderingContext2D, time: number) {
    ctx.fillStyle = '#090807';
    ctx.strokeStyle = '#090807';

    const heavyBreath = Math.sin(time * 0.005) * 1.5;

    // Pelvis on heels
    const hip: Point2D = { x: -18, y: -14 };
    const shoulder: Point2D = { x: 5, y: -20 + heavyBreath };
    const head: Point2D = { x: 14, y: -24 + heavyBreath };

    // Spine arched low in exhaustion
    ctx.lineWidth = 4.4;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(shoulder.x, shoulder.y);
    ctx.stroke();

    // Head bowed forward
    ctx.beginPath();
    ctx.arc(head.x, head.y, 8.0, 0, Math.PI * 2);
    ctx.fill();

    // Knees folded on the rock ground
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(hip.x, hip.y);
    ctx.lineTo(-8, 0); // knee resting on stone
    ctx.lineTo(-22, 0); // foot
    ctx.stroke();

    // Arms resting limp on stone
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.lineTo(11, -8);
    ctx.lineTo(18, 0); // hand flat on rock
    ctx.stroke();
  }
}
