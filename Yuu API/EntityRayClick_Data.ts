import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { RayHit } from "./Raycast";
import { spawnPrimitive } from "./SpawnPrimitive";


export const entityRayClick_Data = {
  leftPointer: spawnPrimitive.cube(new Vector3(0, -10, 0), Vector3.one, Quaternion.one, Color.black, 0.5, false, 'Empty', undefined),
  rightPointer: spawnPrimitive.cube(new Vector3(0, -10, 0), Vector3.one, Quaternion.one, Color.black, 0.5, false, 'Empty', undefined),

  leftRayProperties: {
    lastHitUVEntity: undefined,
    isVisible: true,
    isIndexPressed: false,
    currentEntity: undefined,
    currentClickedEntity: undefined,
    rayHit: undefined,
    lastUV: undefined,
  } as RayPropertiesPerHand,
  rightRayProperties: {
    lastHitUVEntity: undefined,
    isVisible: true,
    isIndexPressed: false,
    currentEntity: undefined,
    currentClickedEntity: undefined,
    rayHit: undefined,
    lastUV: undefined,
  } as RayPropertiesPerHand,
}


export type RayPropertiesPerHand = {
  lastHitUVEntity: Entity | undefined,
  isVisible: boolean,
  isIndexPressed: boolean,
  currentEntity: Entity | undefined,
  currentClickedEntity: Entity | undefined,
  rayHit: RayHit | undefined,
  lastUV: Vector2 | undefined;
}
