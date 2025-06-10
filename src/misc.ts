export function chooseIntegerInRange(range : number[]) : number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}

/**
 * @param array
 * @returns a random element from {@link array}
 */
export function chooseFromArray<Type>(array : Type[]) : Type {
    return array[chooseIntegerInRange([0, array.length - 1])];
}