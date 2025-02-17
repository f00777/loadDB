import React from "react";

const generateSQLScript = (csvData, tableName) => {
  if (!csvData || csvData.length === 0) return "";
  
  const headers = csvData[0]; // Primera fila como headers
  const values = csvData.slice(1); // Resto como valores

  console.log(headers.slice(0,-1))
  console.log(values.slice(0,-1))

  //insertion
  let crudaScript = `INSERT INTO Cruda${tableName} (${headers.slice(0,-1).join(", ")}) VALUES\n`;
  let tScript = `INSERT INTO ${tableName} (${headers.slice(0,-1).join(", ")}) VALUES\n`;
  let transformScript = `INSERT INTO ${tableName}Transform (${headers.slice(0,-1).join(", ")}) VALUES\n`;
  
  const valueLines = values.map(row => `(${row.map(value => `'${value}'`).slice(0,-1).join(", ")})`).join(",\n");
  tScript += valueLines + ";";
  crudaScript += valueLines + ";";
  transformScript += valueLines + ";";

  //procedures

  let cleanTransform = `TRUNCATE TABLE ${tableName}Transform`
  let cleanTemp = `TRUNCATE TABLE ${tableName}Temp`
  let pTemp = `EXEC c${tableName}Temp` 
  let pTable = `EXEC c${tableName}`
  
  return {crudaScript, tScript, transformScript, cleanTransform, cleanTemp, pTemp, pTable};
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

export { generateSQLScript, downloadSQLFile };
