import React, { MouseEventHandler, useContext, useState } from "react";
import { Button } from "../ui/button";
import { toBlob, toPng } from "@/lib/image";
import { FrameContext } from "@/lib/store/FrameContextStore";
import download from "@/lib/constants/download";
import { useAtom, useAtomValue } from "jotai";
import { fileNameAtom } from "@/lib/store";

const ExportButton: React.FC = () => {
  const frameContext = useContext(FrameContext);
  const customFileName = useAtomValue(fileNameAtom);
  const fileName = customFileName.replaceAll(" ", "-") || "time-trace-class";

  const savePng = async () => {
    if (!frameContext?.current) {
      throw new Error("Couldn't find a frame to export");
    }

    const dataUrl = await toPng(frameContext.current, {
      pixelRatio: 6,
    });

    download(dataUrl, `${fileName}.png`);
  };

  const copyPng = () => {
    navigator.clipboard.write([
      new ClipboardItem({
        "image/png": new Promise((resolve) => {
          if (!frameContext?.current) {
            throw new Error("Couldn't find a frame to export");
          }

          toBlob(frameContext.current, {
            pixelRatio: 6,
          }).then((blob) => {
            if (!blob) {
              throw new Error("expected toBlob to return a blob");
            }

            resolve(blob);
          });
        }),
      }),
    ]);
  };

  const handleExportClick: MouseEventHandler = (event) => {
    event.preventDefault();

    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    savePng();
  };

  return (
    <Button onClick={handleExportClick} aria-label='Export as PNG'>
      Export{" "}
      <span className='hidden md:inline-block underline-offset-4'>Image</span>
    </Button>
  );
};

export default ExportButton;
