import { genericComponent, renderBasicValue } from "./GenericComponent";

function renderProperty(key, value) {
    return renderBasicValue(value);
}

function validateRootElement(element) {
    return true;
}

const ServiceAction = genericComponent(renderProperty, validateRootElement);
export default ServiceAction;
