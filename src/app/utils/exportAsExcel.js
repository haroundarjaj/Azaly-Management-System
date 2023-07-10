import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

var pixelWidth = require('string-pixel-width');

export const exportAsExcel = (csvData, fileName, columns) => {
  const columns1 = columns.filter(column => (column.options?.download === true || column.options?.download === undefined));
  const columns2 = columns.filter(column => column.options?.download === false);
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  csvData.forEach(el => {
    Object.keys(el).forEach(key => {
      if (key === "id" || key === "Id" || key === "ID") delete el[key];
      if (columns2.some(column => column.name === key)) delete el[key];
      if (columns.every(column => column.name !== key)) delete el[key];
    })
  });
  const ws = XLSX.utils.json_to_sheet(csvData);
  if (csvData.length === 0) return;
  const headers = columns1 ? Object.keys(csvData[0]).map(key => {
    const existingColumn = columns1.find(el => el.name === key);
    if (!existingColumn) return key;
    return existingColumn.label;
  }) : Object.keys(csvData[0]);
  const wscols = autoFitColumns(csvData, ws, headers)
  ws['!cols'] = wscols
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

const autoFitColumns = (json, worksheet, header) => {
  const jsonKeys = header || Object.keys(json[0])

  const objectMaxLength = []
  jsonKeys.forEach((key) => {
    objectMaxLength.push(
      pixelWidth(key, {
        size: 2,
      })
    )
  })

  /*json.forEach((data, i) => {
    const value = json[i]
    jsonKeys.forEach((key, j) => {
      const l = value[jsonKeys[j]]
        ? pixelWidth(value[jsonKeys[j]], {
          size: 2,
        })
        : 0
      objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l
    })
  })*/


  return objectMaxLength.map((w) => {
    return { width: w }
  })
}
