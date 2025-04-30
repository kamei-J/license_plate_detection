"use client"
import { BiEdit, BiTrashAlt } from "react-icons/bi";

export default function Table({ data, onEdit, onDelete }) {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-16 py-2">
            <span className="text-gray-200">Vehicle ID</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Vehicle Type</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Toll Rate</span>
          </th>
          <th className="px-16 py-2">
            <span className="text-gray-200">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-200">
        {data.map((object, i) => (
          <Tr
            key={i}
            vehicleid={object.vehicleid}
            vehicletype={object.vehicletype}
            tollrate={object.tollrate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

function Tr({ vehicleid, vehicletype, tollrate, onEdit, onDelete }) {
  return (
    <tr className="bg-gray-50 text-center">
      <td className="px-16 py-2">
        <span className="text-center ml-2 font-semibold">{vehicleid || "Unknown"}</span>
      </td>
      <td className="px-16 py-2">
        <span>{vehicletype || "Unknown"}</span>
      </td>
      <td className="px-16 py-2">
        <span>{tollrate || "Unknown"}</span>
      </td>
      <td className="px-16 py-2 flex justify-center gap-5">
        <button
          className="cursor"
          onClick={() => onEdit({ vehicleid, vehicletype, tollrate })}
        >
          <BiEdit size={25} color={"rgb(34,197,94)"} />
        </button>
        <button
          className="cursor"
          onClick={() => onDelete(vehicleid)}
        >
          <BiTrashAlt size={25} color={"rgb(233, 64, 48)"} />
        </button>
      </td>
    </tr>
  );
}