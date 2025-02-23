async function enviarTextoPlanoEnOrden(dataArray, url) {
  try {
    for (const data of dataArray) {
      
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "text/plain" },
        body: data
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Respuesta recibida:", result);
    }

    return { exito: "Datos insertados correctamente" }; // Éxito
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error; // Error
  }
}

async function enviarJSONEnOrden(dataArray, url) {
  try {
    for (const data of dataArray) {
      
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Respuesta recibida:", result);
    }

    return { exito: "Datos insertados correctamente" }; // Éxito
  } catch (error) {
    console.error("Error en la petición:", error);
    return { error: error.message }; // Error
  }
}

export {enviarJSONEnOrden, enviarTextoPlanoEnOrden}