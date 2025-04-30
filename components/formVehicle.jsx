import AddUserForm from "./addUserForm";
import UpdateUserForm from "./updateUserForm";

export default function FormVehicle({ addVehicle, editData, onUpdate }) {
  return (
    <div className="container mx-auto py-5">
      {editData ? (
        <UpdateUserForm editData={editData} onUpdate={onUpdate} />
      ) : (
        <AddUserForm addVehicle={addVehicle} />
      )}
    </div>
  );
}