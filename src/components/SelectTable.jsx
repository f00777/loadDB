import React, {useState} from "react";

const SelectTable = ({handleSelectTableSubmit}) => {

    const [value, setValue] = useState("");

    return (
        <div className="bg-transparent p-8 rounded-lg w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-indigo-600">Tablas Disponibles</h2>
          <form onSubmit={handleSelectTableSubmit}>

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
                </select>
            </div>
    


            <div className="mt-6">
              <button
                type="submit"
                className="cursor-pointer w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      );
}


export default SelectTable