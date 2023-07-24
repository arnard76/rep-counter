type KeyRepAreaData = {
  relativeToWhichKeypoint: string;
  areaSize: { width: number; height: number };
  topLeft: { x: string; y: string };
};

export type FormattedCorners = {
  absTopLeft: { x: number; y: number };
  relTopRight: { x: number; y: number };
  relBottomLeft: { x: number; y: number };
  relBottomRight: { x: number; y: number };
};

export default KeyRepAreaData;
