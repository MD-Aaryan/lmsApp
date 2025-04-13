import React, { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;
  mem_id: number;
  book_id: number;
  borrow_date: string;
  return_date: string;
  status: boolean;
}

interface Member {
  id: number;
  name: string;
}

interface Book {
  id: number;
  name: string;
}

const TransactionManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<
    Omit<Transaction, "id" | "borrow_date" | "return_date">
  >({
    mem_id: 0,
    book_id: 0,
    status: true,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    const [tRes, mRes, bRes] = await Promise.all([
      axios.get("http://localhost:3000/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/members", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:3000/books", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setTransactions(tRes.data);
    setMembers(mRes.data);
    setBooks(bRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : parseInt(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mem_id || !form.book_id) return;

    try {
      if (updatingId) {
        await axios.patch(
          `http://localhost:3000/transactions/${updatingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUpdatingId(null);
      } else {
        await axios.post("http://localhost:3000/transactions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ mem_id: 0, book_id: 0, status: true });
      fetchData();
    } catch (err) {
      console.error("Transaction error", err);
    }
  };

  const handleEdit = (t: Transaction) => {
    setForm({
      mem_id: t.mem_id,
      book_id: t.book_id,
      status: t.status,
    });
    setUpdatingId(t.id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Transaction Manager</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <select
          name="mem_id"
          value={form.mem_id}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value={0}>Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          name="book_id"
          value={form.book_id}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value={0}>Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
            className="mr-2"
          />
          Returned
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {updatingId ? "Update Transaction" : "Create Transaction"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Member ID</th>
            <th className="border p-2">Book ID</th>
            <th className="border p-2">Borrow Date</th>
            <th className="border p-2">Return Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.mem_id}</td>
              <td className="border p-2">{t.book_id}</td>
              <td className="border p-2">
                {new Date(t.borrow_date).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {new Date(t.return_date).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {t.status ? "Returned" : "Borrowed"}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionManager;
