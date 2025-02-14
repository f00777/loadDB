import React from "react";

const generateSQLScript = (csvData, tableName) => {
  if (!csvData || csvData.length === 0) return "";
  
  const headers = csvData[0]; // Primera fila como headers
  const values = csvData.slice(1); // Resto como valores

  console.log(headers.slice(0,-1))
  console.log(values.slice(0,-1))

  let sqlScript = `INSERT INTO ${tableName} (${headers.slice(0,-1).join(", ")}) VALUES\n`;
  
  const valueLines = values.map(row => `(${row.map(value => `'${value}'`).slice(0,-1).join(", ")})`).join(",\n");
  sqlScript += valueLines + ";";
  
  return sqlScript;
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
