import * as duckdb from '@duckdb/duckdb-wasm';
import * as XLSX from 'xlsx';
import type { TableMetaData } from '@/type/table';
import { toast } from 'sonner';
import { detectDelimiter } from './utils';

export type DuckDBModule = typeof duckdb;
export type AsyncDuckDBInstance = InstanceType<typeof duckdb.AsyncDuckDB>;
export type DuckDBConnection = Awaited<ReturnType<AsyncDuckDBInstance['connect']>>;

export const loadFile = async (
  file: File,
  connection: DuckDBConnection,
  db: AsyncDuckDBInstance
): Promise<{ tableName: string; metadataTable: TableMetaData }> => {
  if (!file || !connection) {
    return {
      tableName: '',
      metadataTable: { label: '', columns: [], total_data: 0 }
    };
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  try {
    if (fileExtension === 'csv') {
      return await loadCSV(file, connection, db);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return await loadXLSX(file, connection, db);
    } else {
      toast.error('Unsupported file format. Please upload CSV or XLSX files.');
      return {
        tableName: '',
        metadataTable: { label: '', columns: [], total_data: 0 }
      };
    }
  } catch (err) {
    console.error('File loading error:', err);
    toast.error('File loading error: ' + err);
    return {
      tableName: '',
      metadataTable: { label: '', columns: [], total_data: 0 }
    };
  }
};

const loadCSV = async (
  file: File,
  connection: DuckDBConnection,
  db: AsyncDuckDBInstance
): Promise<{ tableName: string; metadataTable: TableMetaData }> => {
  const fileText = await file.text();
  const uint8Array = new TextEncoder().encode(fileText);
  const delim = detectDelimiter(fileText);
  const tableName = 'tbl_' + file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');

  await connection.query(`DROP TABLE IF EXISTS "${tableName}"`);
  await db.registerFileBuffer(file.name, uint8Array);
  const schemaResult = await connection.query(`
    DESCRIBE SELECT * FROM read_csv_auto('${file.name}', header=true) LIMIT 0
  `);

  const columns = schemaResult.toArray(); // [{ column_name, column_type, ... }]
  console.log('ini schemaResult', columns);

  // Build REPLACE expressions only for date/time columns
  const dateColumns = columns
    .filter((col) => ['DATE', 'TIMESTAMP', 'TIMESTAMPTZ', 'TIME'].includes(col.column_type))
    .map((col) => `CAST("${col.column_name}" AS VARCHAR) AS "${col.column_name}"`);

  const selectExpr = dateColumns.length > 0 ? `* REPLACE (${dateColumns.join(', ')})` : `*`;

  await connection.query(
    `CREATE TABLE "${tableName}" AS SELECT ${selectExpr} FROM read_csv_auto('${file.name}', header=true, delim='${delim}')`
  );

  const columnNames = schemaResult.toArray().map((row: { column_name: string }) => row.column_name);

  const metadataTable: TableMetaData = {
    label: tableName,
    columns: columnNames,
    total_data: 0
  };

  toast.success('CSV loaded successfully with table name: ' + tableName);
  return { tableName, metadataTable };
};

const loadXLSX = async (
  file: File,
  connection: DuckDBConnection,
  db: AsyncDuckDBInstance
): Promise<{ tableName: string; metadataTable: TableMetaData }> => {
  // Read the Excel file
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  // Get the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to CSV format
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  const uint8Array = new TextEncoder().encode(csvData);

  // Create a temporary CSV filename
  const csvFileName = file.name.replace(/\.(xlsx|xls)$/i, '.csv');
  const tableName = 'tbl_' + file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_]/g, '_');

  await connection.query(`DROP TABLE IF EXISTS "${tableName}"`);
  await db.registerFileBuffer(csvFileName, uint8Array);

  // Load the CSV data into DuckDB
  await connection.query(`CREATE TABLE "${tableName}" AS SELECT * FROM read_csv_auto('${csvFileName}', header=true)`);

  const schemaQuery = await connection.query(`DESCRIBE "${tableName}"`);
  const schemaResult = schemaQuery.toArray();
  const columnNames = schemaResult.map((row: { column_name: string }) => row.column_name);

  const metadataTable: TableMetaData = {
    label: tableName,
    columns: columnNames,
    total_data: 0
  };

  toast.success(`Excel file loaded successfully (Sheet: ${firstSheetName}) with table name: ${tableName}`);
  return { tableName, metadataTable };
};
