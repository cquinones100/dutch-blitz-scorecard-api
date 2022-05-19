import { FormGroup } from "react-bootstrap";
import { RowType } from "./Row";


function FormField<Props>(
  { children, className }: {
  } & Props & Pick<RowType, 'className' | 'children'>
) {
  if (children) {
    return (
      <FormGroup className={`mb-3 ${className}`}>
        {children}
      </FormGroup>
    );
  } else {
    return <></>;
  }
};
 
export default FormField;
