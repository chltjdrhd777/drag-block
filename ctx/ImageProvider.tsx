import React, { createContext, useState, useEffect } from 'react';

interface Props {
  children: JSX.Element;
}

interface CTXState {
  img: string | null;
  setImage: React.Dispatch<React.SetStateAction<File | string>>;
  reset: () => void;
}

export const ImageCTX = createContext<CTXState | null>(null);

function Provider({ children }: Props) {
  const [img, setImage] = useState<string | null>(null);

  const reset = () => {
    setImage(null);
    localStorage.removeItem('img');
    localStorage.removeItem('savedList');
  };

  useEffect(() => {
    //when refresh
    const blobUrl = localStorage.getItem('img');
    setImage(blobUrl);
  }, []);

  useEffect(() => {
    if (img) {
      localStorage.setItem('img', img);
    }
  }, [img]);

  return (
    <ImageCTX.Provider value={{ img, setImage, reset }}>
      {children}
    </ImageCTX.Provider>
  );
}

export default Provider;
