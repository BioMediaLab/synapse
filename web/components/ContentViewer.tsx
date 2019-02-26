import React from "react";

import ErrorMessage from "./ErrorMessage";
import TextFileViewer from "./TextFileViewer";

interface IProps {
  name: string;
  url: string;
  type: string;
}

const viewers = {
  unimpl({ url }) {
    return (
      <div>
        This type of file cannot be viewed in your browser. Please{" "}
        <a target="_blank" href={url}>
          download it
        </a>{" "}
        instead.
      </div>
    );
  },

  pdf({ url }: { url: string }) {
    return <a href={url} />;
  },

  image({ url }: { url: string }) {
    return <img style={{ height: "100%", width: "auto" }} src={url} />;
  },

  text({ url }: { url: string }) {
    return <TextFileViewer file_url={url} />;
  },

  audio({ url }: { url: string }) {
    return (
      <audio controls src={url}>
        <ErrorMessage message="no web audio support" />
      </audio>
    );
  },

  video_mp4({ url }: { url: string }) {
    return (
      <video controls>
        <source src={url} type="video/mp4" />
        <ErrorMessage message="no web video support" />
      </video>
    );
  },

  getViewer(fileType: string) {
    switch (fileType) {
      case "application/pdf":
        return this.pdf;
      case "image/png":
        return this.image;
      case "image/jpeg":
        return this.image;
      case "image/svg+xml": // TODO: this filetype may be blocked by filestack
        return this.unimpl; // TODO: create viewer for this
      case "text/rust":
        return this.text;
      case "application/sql":
        return this.text;
      case "audio/mpeg":
        return this.audio;
      case "video/mp4":
        return this.video_mp4;
      default:
        return this.unimpl;
    }
  },
};

const ContentViewer: React.FunctionComponent<IProps> = ({
  type,
  name,
  url,
}) => {
  const ViewerComp: React.FunctionComponent<{
    name: string;
    url: string;
  }> = viewers.getViewer(type);
  return <ViewerComp name={name} url={url} />;
};

export default ContentViewer;
