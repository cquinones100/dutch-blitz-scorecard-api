import { ReactNode } from 'react';
import { Row as BootstrapRow } from 'react-bootstrap';

const Row = ({ children }: { children: ReactNode }) => (
  <BootstrapRow className='align-items-center' style={{ height: '80%' }}>
    {children}
  </BootstrapRow>
);

export default Row;
