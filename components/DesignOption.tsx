import { RectStyle } from 'hooks/useCanvas';
import React from 'react';
import { Updater } from 'use-immer';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface Props {
  setDesign: Updater<RectStyle>;
}

function DesignOption({ setDesign }: Props) {
  return <Container>DesignBar</Container>;
}

const Container = styled.div`
  position: absolute;
`;

export default DesignOption;
