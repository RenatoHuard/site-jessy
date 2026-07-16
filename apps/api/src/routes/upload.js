import express from 'express';
import path from 'path';
import { upload, ALLOWED_MIME_TYPES } from '../utils/multerConfig.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({
			success: false,
			error: 'No file provided',
		});
	}

	// Determine folder based on MIME type
	const mimeType = req.file.mimetype;
	const folderInfo = ALLOWED_MIME_TYPES[mimeType];

	if (!folderInfo) {
		return res.status(400).json({
			success: false,
			error: 'Invalid file type',
		});
	}

	// Construct file path for frontend
	const filePath = `/uploads/${folderInfo.folder}/${req.file.filename}`;

	logger.info(`File uploaded successfully: ${filePath}`);

	res.json({
		success: true,
		filePath,
		filename: req.file.filename,
		mimeType: req.file.mimetype,
		size: req.file.size,
	});
});

export default router;