import { NodeField } from "../NodeField";
export default function createRelationshipFields(fromTypeName: string, toTypeName: string, relType: string, propertiesTypeName?: string): {
    fromField: NodeField;
    toField: NodeField;
};
