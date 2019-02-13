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
