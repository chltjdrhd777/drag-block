import Reactl, { useContext, useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ImageCTX } from 'ctx/ImageProvider';
import {
  colors,
  rectFillColors,
  rectLineColors,
  rgbGenerator,
} from 'styles/theme';
import { useCanvas } from 'hooks/useCanvas';
import ModalPortal from './modal/ModalPortal';
import ModalForm from 'components/Form';
import { css } from '@emotion/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import DesignOption from './DesignOption';

function ImgCanvas() {
  //state
  const [_, shouldComponentUpdate] = useState<number>(0);
  const [isModalPop, setIsModalPop] = useState<boolean>(false);
  const [modalInput, setModalInput] = useState<string>('');
  const [edit, setEdit] = useState<{
    value: string;
    idx: number;
    isOpen: boolean;
  }>({
    value: '',
    idx: 0,
    isOpen: false,
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  //hooks
  const { img, reset } = useContext(ImageCTX);
  const dragCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    coords,
    calcCoords,
    dragEnd,
    savedRectList,
    saveRect,
    editRect,
    removeRect,
    clearAll,
    rectDesign,
    setRectDesign,
  } = useCanvas(dragCanvasRef.current);

  useEffect(() => {
    shouldComponentUpdate(Math.random());
  }, [dragCanvasRef.current, drawCanvasRef.current]);

  useEffect(() => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    ctx.clearRect(0, 0, 700, 700);

    for (let rect of savedRectList) {
      ctx.fillStyle = rgbGenerator(
        [...rectFillColors[rect.fill]],
        rect.fillOpacity,
      );
      ctx.strokeStyle = rgbGenerator(
        [...rectLineColors[rect.line]],
        rect.lineOpacity,
      );
      ctx.lineWidth = rect.lineWidth;

      ctx.fillRect(
        rect.start?.x,
        rect.start?.y,
        rect.end?.x - rect.start?.x,
        rect.end?.y - rect.start?.y,
      );
      ctx.strokeRect(
        rect.start?.x,
        rect.start?.y,
        rect.end?.x - rect.start?.x,
        rect.end?.y - rect.start?.y,
      );

      ctx.fillStyle = 'black';
      ctx.font = 'bold 1.3rem verdana, sans-serif ';

      let textXCoord =
        rect.start.x < rect.end.x ? rect.start.x - 5 : rect.end.x - 5;

      ctx.fillText(rect.title, textXCoord, rect.start?.y - 10);
    }
  }, [savedRectList]);

  //methods
  const modalSubmit = () => {
    if (!modalInput) return;
    saveRect(modalInput);
    setIsModalPop(false);
    setModalInput('');
  };

  const rectModalClose = () => {
    setIsModalPop(false);
    setModalInput('');
    clearAll();
  };

  const modalEdit = (title: string, idx: number, isOpen: boolean) => {
    setEdit({ value: title, idx, isOpen });
  };

  const editModalClose = () => {
    editRect(edit.idx, edit.value);
    setEdit({ value: '', idx: 0, isOpen: false });
  };

  //return
  return (
    <Container id="canvas-container">
      <DesignOption rectDesign={rectDesign} setRectDesign={setRectDesign} />

      <OpenListButtn open={isEditorOpen} onClick={() => setIsEditorOpen(true)}>
        <BiDownArrow />
      </OpenListButtn>

      <SavedRectList open={isEditorOpen}>
        {savedRectList.length &&
          savedRectList.map((rect, idx) => (
            <SavedRectItem key={rect.start.x + rect.start.y}>
              <div
                className="title"
                onClick={() => modalEdit(rect.title, idx, true)}
              >
                {rect.title}
              </div>
              <AiOutlineCloseCircle onClick={() => removeRect(idx)} />
            </SavedRectItem>
          ))}

        <div
          className="close-btn-container"
          onClick={() => setIsEditorOpen(false)}
        >
          <BiUpArrow className="close-icon" />
        </div>
      </SavedRectList>

      <RemoveBtn onClick={reset}>x</RemoveBtn>
      <Image src={img} onError={reset} />

      <DragCanvas
        ref={dragCanvasRef}
        id="drag-canvas"
        width="700"
        height="700"
        onMouseDown={e => calcCoords(e, 'start')}
        onMouseMove={e => calcCoords(e, 'end')}
        onMouseUp={e => {
          dragEnd();

          // if it is not drag but click
          if (!coords.end) {
            clearAll();
            return;
          }

          setIsModalPop(true);
        }}
      />
      <DrawCanvas
        ref={drawCanvasRef}
        id="draw-canvas"
        width="700"
        height="700"
      />

      {/* modal part */}
      {isModalPop && (
        <ModalPortal
          customStyle={modalPortalCustom}
          closeHandler={rectModalClose}
        >
          <ModalForm customStyle={modalFormCustom}>
            <h2>What is the name of that area</h2>
            <input
              type="text"
              placeholder="Ex) something great"
              maxLength={15}
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
            />
            <button className={modalInput && 'active'} onClick={modalSubmit}>
              submit
            </button>
          </ModalForm>
        </ModalPortal>
      )}

      {edit.isOpen && (
        <ModalPortal closeHandler={editModalClose}>
          <ModalForm customStyle={modalFormCustom}>
            <h2>What title do you want to modify</h2>
            <input
              type="text"
              placeholder="Ex) something great"
              maxLength={15}
              value={edit.value}
              onChange={e => setEdit({ ...edit, value: e.target.value })}
            />
            <button className={edit.value && 'active'} onClick={editModalClose}>
              confirm
            </button>
          </ModalForm>
        </ModalPortal>
      )}
    </Container>
  );
}

const modalPortalCustom = css`
  & .modal-content {
    background-color: ${colors.white};
    border-radius: 2rem;
  }
`;

const modalFormCustom = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  & input {
    width: 100%;
    height: 4rem;
    font-size: 2rem;
    text-align: center;
  }

  & button {
    background-color: ${colors.baseButtonColor};
    border: 1px solid gray;
    padding: 1.5rem;
    font-size: 2rem;
    transition: all 0.3s ease-in-out;
    color: ${colors.grayTwo};

    &.active {
      color: ${colors.black};
    }
  }
`;

const Container = styled.section`
  position: absolute;
  z-index: 10;
  width: 70rem;
  height: 70rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const DragCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  cursor: pointer;
`;

const DrawCanvas = styled(DragCanvas)`
  z-index: 10;
`;

const RemoveBtn = styled.button`
  width: 3rem;
  height: 3rem;
  position: absolute;
  border: 1px solid gray;
  padding: 1rem;
  border-radius: 100%;
  right: 1rem;
  top: 1rem;
  background-color: ${colors.white};
  z-index: 30;

  & > span {
    display: block;
    width: 100%;
    height: 100%;
  }

  ${({ theme }) => theme.middle};
`;

const OpenListButtn = styled(RemoveBtn)<{ open: boolean }>`
  left: 1rem;
  right: 0;

  opacity: 0;
  visibility: hidden;

  transition: all 0.5s ${({ open }) => (open ? '0s' : '0.7s')};

  ${({ open }) =>
    !open &&
    css`
      opacity: 1;
      visibility: visible;
    `}
`;

const SavedRectList = styled.ul<{ open: boolean }>`
  min-width: 5rem;
  min-height: 5rem;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 30;
  background-color: ${colors.white};
  border-radius: 1rem;
  padding: 1rem;
  padding-right: 2rem;

  opacity: 0.9;

  ${({ theme }) => theme.centerCol};
  align-items: flex-start;
  gap: 1rem;

  & .close-btn-container {
    width: 100%;
    margin-top: 1rem;
    border-top: 1px solid gray;
    padding-top: 1rem;
    ${({ theme }) => theme.middle};

    & svg {
      cursor: pointer;
    }
  }

  transform-origin: 100% 0;
  transform: scaleY(0);

  ${({ open }) =>
    open
      ? css`
          @keyframes showdown {
            0% {
              transform: scaleY(0);
            }
            100% {
              transform: scaleY(1);
            }
          }

          animation: showdown 0.5s both;
        `
      : css`
          @keyframes hideup {
            0% {
              transform: scaleY(1);
            }
            100% {
              transform: scaleY(0);
            }
          }

          animation: hideup 0.5s both;
        `}
`;

const SavedRectItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
  font-size: 1.5rem;

  & .title:hover {
    color: ${colors.lightblue};
    cursor: pointer;
  }

  & svg {
    cursor: pointer;
  }
`;

export default ImgCanvas;
