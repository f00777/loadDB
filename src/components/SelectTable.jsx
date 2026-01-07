import React, { useState } from "react";

const SelectTable = ({ handleSelectTableSubmit }) => {

  const [value, setValue] = useState("");
  const [permitirEliminaciones, setPermitirEliminaciones] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [errorFechas, setErrorFechas] = useState("");

  const validarFechas = (inicio, final) => {
    if (inicio && final) {
      if (new Date(final) <= new Date(inicio)) {
        setErrorFechas("La fecha de término debe ser mayor que la fecha de inicio");
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
    <div className="bg-transparent p-8 rounded-lg w-full max-w-md">
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
            Se deshabilitarán todos aquellos negocios/servicios que no estén dentro del periodo seleccionado.
          </p>
        </div>

        {permitirEliminaciones && (
          <div className="mb-4 p-4 border border-indigo-200 rounded-md bg-indigo-50">
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
  );
}


export default SelectTable