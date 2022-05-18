import React, { useContext, ChangeEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colors, Md } from 'styles/theme';
import { HiCursorClick } from 'react-icons/hi';

import dynamic from 'next/dynamic';
import { ImageCTX } from 'ctx/ImageProvider';
const Canvas = dynamic(() => import('components/Canvas'), { ssr: false });

function ImageUpload() {
  const { img, setImage } = useContext(ImageCTX);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetFileList = (target: EventTarget & HTMLInputElement) => {
    const dataTransfer = new DataTransfer();
    target.files = dataTransfer.files;
  };

  const convertBase64 = (file: any) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const handleChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files[0] || !target.files[0].type.includes('image')) {
      alert('please upload image');
      return;
    }
    const file = target.files[0];
    const base64 = (await convertBase64(file)) as string;

    setImage(base64);
    resetFileList(target);
  };

  return (
    <Container>
      {img && <Canvas />}

      <Form
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <Input
          type="file"
          id="fileInput"
          onChange={handleChange}
          ref={inputRef}
        />
        <Label htmlFor="fileInput">
          <div className="icons">
            <HiCursorClick />
          </div>
          <span>Upload your file</span>
        </Label>
      </Form>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
  height: 100%;
  position: relative;

  ${({ theme }) => theme.middle};
`;

const Form = styled.form`
  width: 100%;
  height: 100%;

  ${({ theme }) => theme.middle};
`;

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  display: inline-block;
  width: 50%;
  max-width: 50rem;
  height: 50%;
  max-height: 30rem;
  background-color: ${colors.white};
  color: ${colors.pointColorBlue};
  cursor: pointer;
  font-size: 2rem;
  font-weight: 700;
  position: relative;

  ${({ theme }) => theme.centerCol};
  gap: 1rem;

  & .icons {
    display: flex;
    gap: 3rem;
  }

  // media
  ${Md(css`
    font-size: 3rem;
  `)}
`;

export default ImageUpload;
