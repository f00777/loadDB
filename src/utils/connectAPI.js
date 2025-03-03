async function enviarTextoPlanoEnOrden(dataArray, url, setInsertados = () => {}, maximo =0) {
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

      
      setInsertados(prev => {
        if (prev + 200 <= maximo) {
            return prev + 200;
        } else {
            return maximo; // Evita que pase el límite
        }
      });


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


async function enviarTexto(data, url) {
  try {
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

    return { exito: result }; // Éxito
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error; // Error
  }
}

export {enviarJSONEnOrden, enviarTextoPlanoEnOrden, enviarTexto}