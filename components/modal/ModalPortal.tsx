import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { createPortal } from 'react-dom';
import { colors } from 'styles/theme';

interface Props {
  children: JSX.Element;
  closeHandler: Dispatch<SetStateAction<any>>;
  customStyle?: SerializedStyles;
}

function ModalPortal({ children, customStyle, closeHandler }: Props) {
  const parent = document.querySelector('#__next');

  return createPortal(
    <ModalContainer customStyle={customStyle}>
      <ModalContent className="modal-content">{children}</ModalContent>
      <ModalBack className="modal-back" onClick={closeHandler} />
    </ModalContainer>,
    parent,
  );
}

const ModalContainer = styled.section<{ customStyle: SerializedStyles }>`
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 100;
  top: 0;

  ${({ theme }) => theme.middle};
  ${({ customStyle }) => customStyle}
`;

const ModalContent = styled.div`
  position: absolute;
  width: 50rem;
  height: 50rem;
  background-color: ${colors.white};
  z-index: 200;

  ${({ theme }) => theme.middle};
`;

const ModalBack = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.black};
  opacity: 0.7;
`;

export default ModalPortal;
