import styled from "styled-components";
import { RowType } from "./Row";

const CenteredH1 = styled.h1`
  text-align: center;
`;

const CenteredH2 = styled.h2`
  text-align: center;
`;

const CenteredH3 = styled.h3`
  text-align: center;
`;

const Container = [undefined, CenteredH1, CenteredH2, CenteredH3]

const CenteredH = ({ h, children }: { h: number, children: RowType['children'] }) => {
  const Component = Container[h];

  if (Component) {
    return (
      <Component>
        {children}
      </Component>
    );
  } else {
    return <></>;
  }
};


export default CenteredH;
