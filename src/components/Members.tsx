import { useState, useEffect, ChangeEvent } from "react";
import CustomInput from "./Custominput";
import Button from "./Button";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";

// Define TypeScript interface for member
interface Member {
  id: string;
  name: string;
  email: string;
  phono: string;
  address: string;
}

export default function Members() {
  // State to store all members
  const [members, setMembers] = useState<Member[]>([]);

  // State for form inputs
  const [form, setForm] = useState<Omit<Member, "id">>({
    name: "",
    email: "",
    phono: "",
    address: "",
  });

  // State to track if we're editing a member
  const [editingId, setEditingId] = useState<string | null>(null);

  // Message to show success messages
  const [message, setMessage] = useState<string>("");

  // Message to show error messages
  const [error, setError] = useState<string>("");

  // Load members when component mounts
  useEffect(() => {
    getAllMembers();
  }, []);

  // Fetch all members from API
  const getAllMembers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/members", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMembers(response.data);
    } catch (error) {
      setError("Failed to fetch members.");
    }
  };

  // Update form state when user types
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add new member or update existing member
  const handleAdd = async () => {
    try {
      if (editingId) {
        // If editing, update member
        await axios.patch(`http://localhost:3000/members/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Member updated successfully.");
        setEditingId(null);
      } else {
        // Otherwise, add new member
        await axios.post("http://localhost:3000/members", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Member added successfully.");
      }
      setError("");
      getAllMembers(); // Refresh the list
      clearForm(); // Clear input fields
    } catch (error) {
      setMessage("");
      setError("Something went wrong while saving the member.");
    }
  };

  // Delete a member
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/members/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Member deleted successfully.");
      setError("");
      getAllMembers();
    } catch (error) {
      setMessage("");
      setError("Failed to delete member.");
    }
  };

  // Load member data into form for editing
  const handleEdit = (member: Member) => {
    setForm({
      name: member.name,
      email: member.email,
      phono: member.phono,
      address: member.address,
    });
    setEditingId(member.id);
    setMessage("");
    setError("");
  };

  // Clear the form and reset state
  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      phono: "",
      address: "",
    });
    setEditingId(null);
    setMessage("");
    setError("");
  };

  return (
    <div>
      {/* Message Box */}
      {message && (
        <div className="bg-green-100 text-green-800 p-2 m-2 rounded text-center">
          {message}
        </div>
      )}

      {/* Error Box */}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 m-2 rounded text-center">
          {error}
        </div>
      )}

      {/* Form to add or update member */}
      <div className="text-2xl font-bold mt-3.5">Member Form</div>
      <div className="Memberform flex flex-col gap-2 border-2 rounded-xl p-4 m-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2"
        >
          <CustomInput
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
          <CustomInput
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <CustomInput
            name="phono"
            label="Mobile number"
            value={form.phono}
            placeholder="Enter mobile number"
            onChange={handleChange}
          />
          <CustomInput
            name="address"
            label="Address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </form>
        <div className="flex gap-4 justify-center">
          <Button
            label={editingId ? "Update" : "Add"}
            onClick={handleAdd}
            className="flex justi"
          />
          <Button label="Clear" onClick={clearForm} />
        </div>
      </div>

      {/* Table to display members */}
      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile number</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border">
              <td className="border p-2">{member.id}</td>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.email}</td>
              <td className="border p-2">{member.phono}</td>
              <td className="border p-2">{member.address}</td>
              <td className="flex gap-2 justify-center items-center py-4">
                {/* <Button label="Edit" onClick={() => handleEdit(member)} />
                <Button
                  label="Delete"
                  onClick={() => handleDelete(member.id)} */}
                <Pencil
                  size={25}
                  onClick={() => handleEdit(member)}
                  className="cursor-pointer text-gray-600 text-shadow"
                />
                <Trash
                  size={25}
                  onClick={() => handleDelete(member.id)}
                  className="cursor-pointer text-gray-600 "
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
