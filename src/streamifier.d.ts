declare module 'streamifier' {
  const streamifier: {
    createReadStream: (buffer: Buffer | string) => NodeJS.ReadableStream;
  };

  export default streamifier;
}
