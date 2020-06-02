const isNullOrUndefined = val => [null, undefined].includes(val)

const isObject = val => !isNullOrUndefined(val) && typeof val === "object"

const isString = val =>  !isNullOrUndefined(val) && typeof val === "string"

export {
    isObject,
    isString,
    isNullOrUndefined,
}