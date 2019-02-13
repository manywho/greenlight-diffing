export const CHANGE_UNKNOWN = "Unknown";
export const CHANGE_ADDITION = "Added";
export const CHANGE_MODIFICATION = "Modified";
export const CHANGE_DELETION = "Deleted";

export function determineChangeType(item) {
    if (item instanceof Array) {
        switch (item.length) {
            case 1:
                return CHANGE_ADDITION;
            case 3:
                return CHANGE_DELETION;
            default:
                console.warn("An unknown change type was encountered", item);
                return CHANGE_UNKNOWN;
        }
    }

    return CHANGE_MODIFICATION;
}
