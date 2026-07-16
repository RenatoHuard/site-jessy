import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadDir, 'images');
const pdfsDir = path.join(uploadDir, 'pdfs');
const templatesDir = path.join(uploadDir, 'templates');

// Create directories if they don't exist with proper permissions
const createDirIfNotExists = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		try {
			fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
		} catch (error) {
			console.error(`Failed to create directory ${dirPath}:`, error);
		}
	}
};

[uploadDir, imagesDir, pdfsDir, templatesDir].forEach(createDirIfNotExists);

const ALLOWED_MIME_TYPES = {
	'image/jpeg': { folder: 'images', ext: '.jpg' },
	'image/png': { folder: 'images', ext: '.png' },
	'image/gif': { folder: 'images', ext: '.gif' },
	'image/webp': { folder: 'images', ext: '.webp' },
	'application/pdf': { folder: 'pdfs', ext: '.pdf' },
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const mimeType = file.mimetype;
		if (!ALLOWED_MIME_TYPES[mimeType]) {
			return cb(new Error(`Invalid MIME type: ${mimeType}`));
		}

		const folder = ALLOWED_MIME_TYPES[mimeType].folder;
		const destPath = path.join(uploadDir, folder);
		
		// Ensure destination directory exists
		createDirectoryIfNotExists(destPath);
		
		cb(null, destPath);
	},
	filename: (req, file, cb) => {
		const mimeType = file.mimetype;
		if (!ALLOWED_MIME_TYPES[mimeType]) {
			return cb(new Error(`Invalid MIME type: ${mimeType}`));
		}

		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 8);
		const ext = ALLOWED_MIME_TYPES[mimeType].ext;
		const filename = `${file.fieldname}-${timestamp}-${randomString}${ext}`;
		cb(null, filename);
	},
});

const fileFilter = (req, file, cb) => {
	if (!ALLOWED_MIME_TYPES[file.mimetype]) {
		return cb(new Error(`File type not allowed: ${file.mimetype}`));
	}
	cb(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
	},
});

// Helper function to create directory if it doesn't exist
const createDirectoryIfNotExists = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		try {
			fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
		} catch (error) {
			console.error(`Failed to create directory ${dirPath}:`, error);
		}
	}
};

export { upload, ALLOWED_MIME_TYPES, uploadDir };