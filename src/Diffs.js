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


export function renderChange(key, item, renderAddition, renderDeletion, renderModification, renderUnknown) {
    if (item instanceof Array) {
        return renderArray(key, item, renderAddition, renderDeletion, renderModification, renderUnknown);
    }

    return Object.entries(item).map(([innerKey, value]) => {
        console.log('aids', key, innerKey, item);

        if (value instanceof Array) {
            return renderArray(innerKey, value, renderAddition, renderDeletion, renderModification, renderUnknown);
        }

        if (innerKey === '_t' && value === 'a') {
            console.warn("Not sure what to do here", item);
        } else {
            return renderChange(key, value, renderAddition, renderDeletion, renderModification, renderUnknown);
        }
    })
}

function renderArray(key, item, renderAddition, renderDeletion, renderModification, renderUnknown) {
    switch (item.length) {
        case 1:
            return renderAddition(item[0]);
        case 2:
            return renderModification(key, item[0], item[1]);
        case 3:
            return renderDeletion(item[0]);
        default:
            console.warn("An unknown change type was encountered", item);
            return renderUnknown(item);
    }
}
