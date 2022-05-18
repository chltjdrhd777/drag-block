import { css, SerializedStyles } from '@emotion/react';

export const colors = {
  black: '#2b2b2b',
  white: '#FFFFFF',
  indigo: '#181F38',
  grayOne: '#F7F7F7',
  grayTwo: '#E5E5E5',
  grayThree: '#707070',
  grayFour: '#5a5a5a',
  pointColorPurple: '#ad8bf6',
  pointColorYello: '#ffc114',
  pointColorCarrot: '#ff5248',
  pointColorMint: '#19cdca',
  pointColorBlue: '#4e80e1',
  lightblue: '#C5E2EE',
  footerColor: '#313131',
  mainColor: '#E7286A',
  waringColor: '#ff3838',
  starColor: '#fd4',
  baseButtonColor: '#f8f9fa',
} as const;

export const rectFillColors = {
  red: ['255', '051', '051'],
  green: ['128', '255', '51'],
  blue: ['51', '128', '255'],
  lime: ['0', '255', '0'],
} as const;
export const rectLineColors = {
  purple: ['153', '051', '255'],
  aqua: ['0', '255', '255'],
  yellow: ['255', '255', '0'],
} as const;

export const rgbGenerator = (
  rgba: [string, string, string],
  opacity: string,
) => {
  return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${opacity})`;
};

//breackpoint
export const Md = (styling: SerializedStyles) => {
  return css`
    @media screen and (min-width: 768px) {
      ${styling}
    }
  `;
};

//cetering
export const middle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const centerRow = css`
  display: flex;
  justify-content: center;
`;

export const centerCol = css`
  ${middle}
  flex-direction: column;
`;

export type ModeType = 'white' | 'dark';

export const commonTheme = {
  middle,
  centerRow,
  centerCol,
} as const;

export type ThemeType = typeof commonTheme;
