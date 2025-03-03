import React from "react";

const generateSQLScript = (csvData, tableName) => {
  if (!csvData || csvData.length === 0) return "";
  
  const headers = csvData[0]; // Primera fila como headers
  const values = csvData.slice(1); // Resto como valores
  const chunkSize = 200;

  const createInsertScripts = (prefix) => {
    let scripts = [];
    for (let i = 0; i < values.length; i += chunkSize) {
      const chunk = values.slice(i, i + chunkSize);
      const valueLines = chunk.map(row => `(${row.map(value => `'${value}'`).slice(0,-1).join(", ")})`).join(",\n");
      const script = `${prefix} VALUES\n${valueLines};`;
      scripts.push(script);
    }
    return scripts;
  };

  const headersFormatted = headers.slice(0,-1).map(header => `[${header}]`).join(", ");
  const crudaScripts = createInsertScripts(`INSERT INTO Cruda${tableName} (${headersFormatted})`);
  const tScripts = createInsertScripts(`INSERT INTO ${tableName} (${headersFormatted})`);
  const transformScripts = createInsertScripts(`INSERT INTO ${tableName}Transform (${headersFormatted})`);

  let cleanTransform = `TRUNCATE TABLE ${tableName}Transform`;
  let cleanTemp = `TRUNCATE TABLE ${tableName}Temp`;
  let pTemp = `EXEC c${tableName}Temp`;
  let pTable = `EXEC c${tableName}`;

  let lastFecha = `SELECT MAX(FechaCreacion) FROM q${tableName}`
  let periodo = `SELECT Periodo FROM q${tableName} WHERE FechaCreacion = (SELECT MAX(FechaCreacion) FROM q${tableName})`

  return { crudaScripts, tScripts, transformScripts, cleanTransform, cleanTemp, pTemp, pTable, values, lastFecha, periodo};
};


const downloadSQLFile = (sqlScript, fileName = "script.sql") => {
  const blob = new Blob([sqlScript], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {generateSQLScript, downloadSQLFile };
