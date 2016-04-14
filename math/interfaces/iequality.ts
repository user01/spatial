

export interface IEquality<T> {
  Equal(a: T, b: T): boolean;
}

export default IEquality;
