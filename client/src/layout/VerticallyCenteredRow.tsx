import { RowType } from "./Row";
import { Row as BootstrapRow } from 'react-bootstrap';

const VerticallyCenteredRow = ({ className, children, style }: RowType) => (
  <BootstrapRow
    className={`align-items-center ${className}`}
    {...(style ? { style } : {})}
    style={style}
  >
    {children}
  </BootstrapRow>
);

export default VerticallyCenteredRow;