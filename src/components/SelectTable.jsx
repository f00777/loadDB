import React, { useState } from "react";
import CsvDateUpload from "./CsvDateUpload";

const SelectTable = ({ handleSelectTableSubmit }) => {

  const [value, setValue] = useState("");
  const [permitirEliminaciones, setPermitirEliminaciones] = useState(true);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [errorFechas, setErrorFechas] = useState("");

  // Estados para procedimientos almacenados
  const [isLoadingSP, setIsLoadingSP] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const validarFechas = (inicio, final) => {
    if (inicio && final) {
      if (new Date(final) < new Date(inicio)) {
        setErrorFechas("La fecha de término debe ser mayor o igual a la fecha de inicio");
        return false;
      }
    }
    setErrorFechas("");
    return true;
  };

  const handleFechaInicioChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaInicio(nuevaFecha);
    validarFechas(nuevaFecha, fechaFinal);
  };

  const handleFechaFinalChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaFinal(nuevaFecha);
    validarFechas(fechaInicio, nuevaFecha);
  };

  const handleCheckboxChange = (e) => {
    setPermitirEliminaciones(e.target.checked);
    if (!e.target.checked) {
      setFechaInicio("");
      setFechaFinal("");
      setErrorFechas("");
    }
  };

  const handleDatesExtracted = (fechaMin, fechaMax) => {
    setFechaInicio(fechaMin);
    setFechaFinal(fechaMax);
    setErrorFechas("");
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const executeStoredProcedure = async (procedureName) => {
    setIsLoadingSP(true);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: `EXEC ${procedureName}`,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details?.message || "Error al ejecutar el procedimiento");
      }

      showNotification("success", `Procedimiento ${procedureName} ejecutado con éxito`);
    } catch (error) {
      showNotification("error", `Error: ${error.message}`);
    } finally {
      setIsLoadingSP(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("Fecha Inicio:", fechaInicio);  // Mostrará "2026-01-07"
    console.log("Fecha Final:", fechaFinal);    // Mostrará "2026-01-15"

    if (permitirEliminaciones && !validarFechas(fechaInicio, fechaFinal)) {
      return;
    }

    // Crear objeto con los datos del formulario
    const formDataExtra = {
      permitirEliminaciones,
      fechaInicio: permitirEliminaciones ? fechaInicio : "",
      fechaFinal: permitirEliminaciones ? fechaFinal : ""
    };

    handleSelectTableSubmit(e, formDataExtra);
  };

  return (
    <div className="bg-transparent p-8 rounded-lg w-full max-w-4xl">
      {/* Notificación */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${notification.type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
            }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ show: false, type: "", message: "" })}
              className="ml-2 hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Overlay de carga */}
      {isLoadingSP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Ejecutando procedimiento...</p>
          </div>
        </div>
      )}

      <div className="flex gap-0">
        {/* Columna Izquierda - Selección de Tablas */}
        <div className="flex-1 pr-8">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-indigo-600">Tablas Disponibles</h2>
          <form onSubmit={onSubmit}>

            <div className="mb-4">
              <select
                id="table"
                name="table"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">-- Selecciona una tabla --</option>
                <option value="VentaNegocio">VentaNegocio</option>
                <option value="SabanaCompleta">SabanaCompleta</option>
                <option value="Tkt">Tkt</option>
                <option value="ComisionesVendedoraDetallado">CVD</option>
                <option value="UETT">UETT</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center text-black cursor-pointer">
                <input
                  type="checkbox"
                  id="permitirEliminaciones"
                  name="permitirEliminaciones"
                  checked={permitirEliminaciones}
                  onChange={handleCheckboxChange}
                  className="mr-2 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                ¿Permitir eliminaciones?
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Se deshabilitarán todos aquellos negocios/servicios que no se estén cargando dentro del periodo seleccionado.
              </p>
            </div>

            {permitirEliminaciones && (
              <div className="mb-4 p-4 border border-indigo-200 rounded-md bg-indigo-50">
                <CsvDateUpload onDatesExtracted={handleDatesExtracted} />
                <div className="mb-3">
                  <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={fechaInicio}
                    onChange={handleFechaInicioChange}
                    className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={permitirEliminaciones}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="fechaFinal" className="block text-sm font-medium text-gray-700">
                    Fecha de Término
                  </label>
                  <input
                    type="date"
                    id="fechaFinal"
                    name="fechaFinal"
                    value={fechaFinal}
                    onChange={handleFechaFinalChange}
                    className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={permitirEliminaciones}
                  />
                </div>
                {errorFechas && (
                  <p className="text-red-500 text-sm mt-2">{errorFechas}</p>
                )}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={permitirEliminaciones && (errorFechas || !fechaInicio || !fechaFinal)}
                className="cursor-pointer w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>

        {/* Línea divisoria vertical */}
        <div className="w-px bg-gray-300 mx-4"></div>

        {/* Columna Derecha - Procedimientos Almacenados */}
        <div className="flex-1 pl-8 max-h-[60vh] overflow-y-auto">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-indigo-600">Procedimientos</h2>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Categorizar Ruta</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ejecuta el procedimiento para categorizar NAC, INTER, VOID, ERR las rutas en tSabanaCompleta.
              </p>
              <button
                onClick={() => executeStoredProcedure("sp_CategorizarRuta")}
                disabled={isLoadingSP}
                className="cursor-pointer w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingSP ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ejecutando...
                  </span>
                ) : (
                  "Ejecutar"
                )}
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Procesos Post Subida</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ejecuta procesos varios que se deben realizar después de una carga a la SabanaCompleta.
              </p>
              <button
                onClick={() => executeStoredProcedure("sp_ProcesosPostSubida")}
                disabled={isLoadingSP}
                className="cursor-pointer w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingSP ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ejecutando...
                  </span>
                ) : (
                  "Ejecutar"
                )}
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sincronizar Devoluciones</h3>
              <p className="text-sm text-gray-600 mb-4">
                Lee la tabla Sabana Completa y actualiza fEsDevolucion si es que el ticket es devolución.
              </p>
              <button
                onClick={() => executeStoredProcedure("sp_syncDevolucionesSC")}
                disabled={isLoadingSP}
                className="cursor-pointer w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingSP ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ejecutando...
                  </span>
                ) : (
                  "Ejecutar"
                )}
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cargar aUETT</h3>
              <p className="text-sm text-gray-600 mb-4">
                Trunca la tabla aUETT y la vuelve a llenar cruzando los datos desde SC y UETT.
              </p>
              <button
                onClick={() => executeStoredProcedure("sp_CargarAUETT")}
                disabled={isLoadingSP}
                className="cursor-pointer w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingSP ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ejecutando...
                  </span>
                ) : (
                  "Ejecutar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}


export default SelectTable