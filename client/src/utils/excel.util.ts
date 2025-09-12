import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Generates and downloads a sample Excel file.
 * @param fileName - Name of the downloaded file
 * @param sheetName - Name of the Excel sheet
 * @param sampleData - Example rows (array of objects)
 */
export const downloadSampleExcel = (
  fileName: string,
  sheetName: string,
  sampleData: Record<string, any>[]
) => {
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    `${fileName}.xlsx`
  );
};
