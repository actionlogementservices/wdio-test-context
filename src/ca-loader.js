/**
 * CA certificates loader.
 * @module
 * @category internal
 */

import path from 'node:path';

import { glob } from 'glob';
import { addCAs } from 'syswide-cas';

/**
 * Loads CA certificats if there are present in a ca folder.
 */
export function loadCACertificates() {
  const caFiles = glob.sync('**/*.crt', {
    absolute: true,
    cwd: path.join(process.cwd(), 'ca'),
    nodir: true
  });
  if (caFiles && caFiles.length > 0) {
    addCAs(caFiles);
  }
}
