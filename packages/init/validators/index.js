
/**
 * Validate the package name exists and is a string
 * 
 * @private
 * @param {string} val
 * @returns {boolean | string}
 */
export function validatePackageName(val) {
    return val && typeof val === 'string' ? true : 'Must define a root package name';
}


/**
 * Package scope must start with @
 * 
 * @private
 * @param {string} val
 * @returns {boolean | string}
 */
 export function validateScope(val) {
    return !val || val.charAt(0) === '@' ? true : 'Scope must start with @';
}
