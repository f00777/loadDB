const Tabla = ({tabla, registros, ultimaFecha, ultimoPeriodo }) => {
    return (
        <table className="border-collapse border border-gray-300 w-full">
            <thead>
                <tr className="bg-indigo-500">
                    <th className="border border-gray-300 px-4 py-2">Tabla</th>
                    <th className="border border-gray-300 px-4 py-2">Registros ingresados</th>
                    <th className="border border-gray-300 px-4 py-2">Fecha de último registro</th>
                    <th className="border border-gray-300 px-4 py-2">Periodo último registro</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border border-gray-300 px-4 py-2 text-indigo-500">{tabla}</td>
                    <td className="border border-gray-300 px-4 py-2 text-indigo-500">{registros}</td>
                    <td className="border border-gray-300 px-4 py-2 text-indigo-500">{ultimaFecha}</td>
                    <td className="border border-gray-300 px-4 py-2 text-indigo-500">{ultimoPeriodo}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Tabla;
