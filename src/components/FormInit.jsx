import React from "react";


const FormInit = ({formData, handleChange, handleSubmit}) =>{
    return (
        <div className="bg-transparent p-8 rounded-lg w-full max-w-md">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-amber-400">TZ Connect</h2>
          <form onSubmit={handleSubmit}>
    
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700" htmlFor="database">
                Nombre Base de Datos
              </label>
              <input
                type="text"
                id="database"
                name="database"
                value={formData.database}
                onChange={handleChange}
                className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700" htmlFor="user">
                Usuario
              </label>
              <input
                type="text"
                id="user"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="text-black w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
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

export default FormInit;