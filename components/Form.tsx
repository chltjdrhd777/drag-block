import React from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';

interface Props {
  customStyle?: SerializedStyles;
  children?: JSX.Element[];
}

function Index({ customStyle, children }: Props) {
  return (
    <Form
      customStyle={customStyle}
      onSubmit={e => {
        e.preventDefault();
      }}
    >
      {children}
    </Form>
  );
}

const Form = styled.form<Props>`
  ${props => props.customStyle}
`;

export default Index;
