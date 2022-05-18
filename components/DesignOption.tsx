import { RectStyle } from 'hooks/useCanvas';
import React from 'react';
import { Updater } from 'use-immer';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import {
  colors,
  rectFillColors,
  rectLineColors,
  rgbGenerator,
} from 'styles/theme';

interface Props {
  rectDesign: RectStyle;
  setRectDesign: Updater<RectStyle>;
}

function DesignOption({ rectDesign, setRectDesign }: Props) {
  console.log(rectDesign);
  return (
    <Container>
      <FillColorsList>
        <h3>fill</h3>
        {Object.entries(rectFillColors).map(fill => {
          const roundColor = rgbGenerator([...fill[1]], '1');
          return (
            <FillColorsItem
              className={rectDesign.fill === fill[0] && 'active'}
              fillColor={css`
                background-color: ${roundColor};
              `}
              onClick={() =>
                setRectDesign(prev => {
                  prev.fill = fill[0] as any;
                })
              }
            ></FillColorsItem>
          );
        })}
      </FillColorsList>

      <LineColorsList>
        <h3>line</h3>
        {Object.entries(rectLineColors).map(line => {
          const roundColor = rgbGenerator([...line[1]], '1');
          return (
            <LineColorsItem
              className={rectDesign.line === line[0] && 'active'}
              fillColor={css`
                background-color: ${roundColor};
              `}
              onClick={() => {
                setRectDesign(prev => {
                  prev.line = line[0] as any;
                });
              }}
            ></LineColorsItem>
          );
        })}
      </LineColorsList>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: -6rem;
  display: flex;
  gap: 1rem;
`;

const FillColorsList = styled.ul`
  ${({ theme }) => theme.centerRow};
  gap: 1rem;
  background-color: ${colors.white};
  padding: 1rem 2rem;
  border-radius: 5rem;

  & h3 {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 2.5rem;
  }
`;

const FillColorsItem = styled.li<{ fillColor: SerializedStyles }>`
  width: 3rem;
  height: 3rem;
  border: 1px solid gray;
  border-radius: 50%;

  ${({ fillColor }) => fillColor};

  &.active {
    outline: 3px solid ${colors.indigo};
  }
`;

const LineColorsList = styled(FillColorsList)``;
const LineColorsItem = styled(FillColorsItem)``;

export default DesignOption;
