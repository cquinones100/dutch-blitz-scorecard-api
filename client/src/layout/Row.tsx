import { ReactNode } from 'react';
import VerticallyCenteredRow from './VerticallyCenteredRow';

export type RowType = { 
  children: ReactNode;
  style?: {
    [property: string]: string;
  },
  className?: string;
};

const Row = ({ children, className, style }: RowType) => (
  <VerticallyCenteredRow className={className} style={{ height: '80%', ...style }}>
    {children}
  </VerticallyCenteredRow>
);

export default Row;
