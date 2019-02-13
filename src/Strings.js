/**
 * This is a super naive way to pluralise a given string, which I think works for everything we need it to?
 *
 * @param group
 * @param count
 * @returns string
 */
export function pluralise(group, count = 0) {
    if (count === 1) {
        return group;
    }

    return group + 's';
}

export function stringify(str) {

    if(str === null)
        return '<NULL>';

    if(["undefined", "object", "symbol", "function"].includes(typeof str)) {
        throw new Error("Unsupported type");
    }

    if(typeof str === "boolean") {
        if(str === true)
            return 'true';
        else
            return 'false';
    }

    return str;
}