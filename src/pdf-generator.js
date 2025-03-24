/**
 * **Pdf file generator**.
 * @module
 * @category public
 */

import fs from 'node:fs/promises';
import path from 'node:path';

import { jsPDF } from 'jspdf';
import moment from 'moment';

import { logger } from './logger.js';

/**
 * Generates a pdf file with specified name and context data.
 * @param {string} filename file name
 * @param {import('./test-context.js').TestContext} context test context
 * @returns {Promise<string>} the file path
 */
async function generatePdf(filename, context) {
  const folder = path.join(process.cwd(), 'data', 'files');
  await fs.mkdir(folder, { recursive: true });
  const filepath = path.join(folder, `${filename}.pdf`);
  logger.debug(`Generating '${filepath}'...`);
  const timestamp = moment().format('[Le] DD/MM/YYYY [à] HH:mm:ss');
  const {
    user: { firstname, lastname, gender, email }
  } = context;
  const lines = [
    filename.toUpperCase(),
    timestamp,
    `${gender} ${firstname} ${lastname}`,
    `Adresse e-mail : ${email}`
  ];
  try {
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text(lines, 10, 10);
    const fileContent = Buffer.from(pdf.output('arraybuffer'));
    await fs.writeFile(filepath, fileContent, { encoding: 'utf8' });
    return filepath;
  } catch (error) {
    logger.detailError(error);
    throw new Error(`Unable to create pdf file '${filepath}': ${error.message}!`);
  }
}

/**
 * Deletes the specified file.
 * @param {string} filepath pdf file path
 */
async function deletePdf(filepath) {
  try {
    await fs.rm(filepath);
  } catch (error) {
    logger.detailError(error);
  }
}

export default { deletePdf, generatePdf };
