export type BoardTarget = string; // e.g., "arduino:avr:uno"
export type SerialPortPath = string; // e.g., "COM3"

export type UploadRequest = {
  code: string;
  port?: SerialPortPath;
  board?: BoardTarget;
};

export type UploadResult = {
  ok: boolean;
  message?: string;
};
