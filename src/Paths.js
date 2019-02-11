export function createPrettyPathName(path) {
    switch (path) {
        case "dateCreated":
            return "flow creation date";
        case "dateModified":
            return "flow modification date";
        case "developerName":
            return "flow name";
        case "id.id":
            return "flow ID";
        case "id.versionId":
            return "flow version";
        case "groupElements":
            return "group element";
        case "macroElements":
            return "macro element";
        case "mapElements":
            return "map element";
        case "navigationElements":
            return "navigation element";
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
