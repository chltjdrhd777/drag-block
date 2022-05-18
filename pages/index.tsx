import Link from 'next/link';
import styled from '@emotion/styled';
import { colors } from 'styles/theme';
import ImgService from 'components/ImgService';

const IndexPage = () => (
  <Main>
    <ImgService />
  </Main>
);

const Main = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: ${colors.pointColorBlue};
`;
export default IndexPage;
