import get from 'lodash.get';

export function createPrettyPathName(path) {
    switch (path) {
        case "controlPoints":
            return "control point";
        case "dateCreated":
            return "creation date";
        case "dateModified":
            return "modification date";
        case "developerName":
            return "name";
        case "developerSummary":
            return "summary";
        case "id":
            return "ID";
        case "versionId":
            return "version";
        case "groupElements":
            return "group element";
        case "macroElements":
            return "macro element";
        case "mapElements":
            return "map element";
        case "navigationElements":
            return "navigation element";
        case "pageActionBindingType":
            return "page action binding type";
        case "pageElements":
            return "page element";
        case "serviceElements":
            return "service element";
        case "startMapElementId":
            return "starting map element ID";
        case "tagElements":
            return "tag element";
        case "typeElements":
            return "type element";
        case "valueElements":
            return "value element";
        case "whoCreated":
            return "creator";
        case "whoModified":
            // TODO
            return "modifier";
        case "whoOwner":
            return "owner";
        default:
            console.warn("An unknown path was encountered:", path);

            return path;
    }
}

export function findName(item, path) {
    // If we encounter a null field, we just want to return an empty string
    if (item === null) {
        return "";
    }

    // If we're given a deleted element path, remove the underscore so we can get the correct original element
    const explodedPath = path.replace('_', '').split('.');

    let result = get(item, explodedPath);
    if (result) {
       if (result.developerName) {
            return result.developerName;
        }
    }

    // Otherwise, fall back to just creating a "pretty" name from the final path segment
    return createPrettyPathName(explodedPath[explodedPath.length - 1]);
}
