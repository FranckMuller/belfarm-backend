import { diskStorage } from 'multer';

type FileNameCallback = (error: Error | null, filename: string) => void;

const generateId = () => {
  return Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
};

const normalizeFileName = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileNameCallback,
) => {
  console.log(file);
  const fileExtName = file.originalname.split('.').pop();
  cb(null, `${generateId()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: normalizeFileName,
});
