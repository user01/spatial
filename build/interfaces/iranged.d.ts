// [ts-npm-lint] disabled triple slash reference to '../references.d.ts'
import * as Vector from '../vector';
export interface IRanged {
    DistanceTo(v: Vector.VectorBase): number;
    IntensityAtDistance(v: Vector.VectorBase): number;
    IntensityAtDistanceAndTime(v: Vector.VectorBase, originTime: moment.Moment, currentTime: moment.Moment): number;
    IntensityAtDistanceAndDuration(v: Vector.VectorBase, d: moment.Duration): number;
    ClosestVector(v: Vector.VectorBase): Vector.VectorBase;
}
export default IRanged;
