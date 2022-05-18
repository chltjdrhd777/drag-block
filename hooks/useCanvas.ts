import { useEffect } from 'react';
import { rectFillColors, rectLineColors, rgbGenerator } from 'styles/theme';
import { useImmer as useState } from 'use-immer';

type CoordsType = { x: number; y: number } | null;

interface Coords {
  start: CoordsType;
  end: CoordsType;
  isDrag: boolean;
}

type FillType = keyof typeof rectFillColors;
type LineType = keyof typeof rectLineColors;

export interface RectStyle {
  fill: FillType;
  line: LineType;
  fillOpacity: string;
  lineOpacity: string;
  lineWidth: number;
}

type SavedRect = Omit<Coords & RectStyle & { title: string }, 'isDrag'>[];

// 1. 마우스 업 => 내부 상태에 리스트 저장
// 2. 상태 업데이트마다 로컬스토리지에 해당 상태 내용 저장
// 3. 캔버스 파트에서 useEffect로 매번 컴포넌트 마운트 때마다 해당 상태 불러와서 내부상태에 저장

export function useCanvas(canvas: HTMLCanvasElement | null) {
  //state
  const [coords, setCoords] = useState<Coords>({
    start: null,
    end: null,
    isDrag: false,
  });

  const [rectDesign, setRectDesign] = useState<RectStyle>({
    fill: 'red',
    line: 'purple',
    fillOpacity: '0.5',
    lineOpacity: '1',
    lineWidth: 5,
  });

  const [savedRectList, setSavedRectList] = useState<SavedRect>([]);
  const rect = canvas?.getBoundingClientRect();
  const ctx = canvas?.getContext('2d');

  //hooks
  useEffect(() => {
    //when refresh
    const savedRectList = JSON.parse(localStorage.getItem('savedList')) ?? [];
    setSavedRectList(savedRectList);
  }, []);

  useEffect(() => {
    //drag rect
    if (coords.end) {
      ctx.clearRect(0, 0, 700, 700);

      ctx.fillStyle = rgbGenerator(
        [...rectFillColors[rectDesign.fill]],
        rectDesign.fillOpacity,
      );
      ctx.strokeStyle = rgbGenerator(
        [...rectLineColors[rectDesign.line]],
        rectDesign.lineOpacity,
      );
      ctx.lineWidth = rectDesign.lineWidth;

      ctx.fillRect(
        coords.start?.x,
        coords.start?.y,
        coords.end?.x - coords.start?.x,
        coords.end?.y - coords.start?.y,
      );
      ctx.strokeRect(
        coords.start?.x,
        coords.start?.y,
        coords.end?.x - coords.start?.x,
        coords.end?.y - coords.start?.y,
      );
      ctx.fillText('hello', 1, 1);
    }
  }, [coords]);

  useEffect(() => {
    //when list changed
    localStorage.setItem('savedList', JSON.stringify(savedRectList));
  }, [savedRectList]);

  useEffect(() => {
    // when mouseup outside
    const outsideMouseUp = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.modal-content') ||
        target.closest('#canvas-container')
      ) {
        return;
      }

      if (target.id !== 'drag-canvas') {
        clearAll();
      }
    };

    window.addEventListener('mouseup', outsideMouseUp);
    return () => window.removeEventListener('mouseup', outsideMouseUp);
  }, []);

  //methods
  const reset = () => {
    setCoords(prev => {
      (prev.start = null), (prev.end = null), (prev.isDrag = false);
    });
  };

  const clearAll = () => {
    reset();
    ctx?.clearRect(0, 0, 700, 700);
  };

  const dragEnd = () => {
    setCoords(prev => {
      prev.isDrag = false;
    });
  };

  const calcCoords = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    type: 'start' | 'end',
  ) => {
    setCoords(prev => {
      if (type === 'start') {
        prev.isDrag = true;
        prev[type] = { x: e.clientX - rect?.left, y: e.clientY - rect?.top };
      }

      if (type === 'end' && coords.isDrag) {
        prev[type] = { x: e.clientX - rect?.left, y: e.clientY - rect?.top };
      }
    });
  };

  const saveRect = (title: string) => {
    setSavedRectList(prev => {
      prev.push({ ...coords, ...rectDesign, title });
    });
    clearAll();
  };

  const editRect = (idx: number, title: string) => {
    const targetIdx = savedRectList.findIndex((_, rectIdx) => rectIdx === idx);

    setSavedRectList(prev => {
      prev[targetIdx].title = title;
    });
  };

  const removeRect = (idx: number) => {
    const filtered = savedRectList.filter((_, rectIdx) => rectIdx !== idx);

    setSavedRectList(filtered);
  };

  return {
    coords,
    calcCoords,
    dragEnd,
    savedRectList,
    reset,
    clearAll,
    saveRect,
    editRect,
    removeRect,
    rectDesign,
    setRectDesign,
  };
}
