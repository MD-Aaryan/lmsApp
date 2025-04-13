import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";

interface Book {
  id: number;
  name: string;
  author: string;
  availability: boolean;
  book_id?: number;
}

const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Omit<Book, "id">>({
    name: "",
    author: "",
    availability: true,
  });
  const [updatingBook, setUpdatingBook] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/books", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      setError("Failed to fetch books.");
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handle form submission (for adding/updating)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.author) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (updatingBook) {
        // Update existing book
        await axios.patch(`http://localhost:3000/books/${updatingBook}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Book updated successfully.");
      } else {
        // Add new book
        await axios.post("http://localhost:3000/books", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Book added successfully.");
      }

      // Reset form and fetch updated list
      setForm({ name: "", author: "", availability: true });
      setUpdatingBook(null);
      setError(null);
      fetchBooks();
    } catch (err) {
      setError("Failed to submit the form.");
    }
  };

  // Handle editing a book
  const handleEdit = (book: Book) => {
    setForm(book);
    setUpdatingBook(book.id);
    setMessage(null);
    setError(null);
  };

  // Handle deleting a book
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchBooks();
      setMessage("Book deleted successfully.");
      setError(null);
    } catch (err) {
      setError("Failed to delete the book.");
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Book Manager</h2>

      {message && (
        <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded text-center font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded text-center font-medium">
          {error}
        </div>
      )}

      {/* Form to add/update book */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-6 border-3 rounded-2xl p-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter book name"
          value={form.name}
          onChange={handleChange}
          className="border-2 p-2 w-full rounded "
        />
        <input
          type="text"
          name="author"
          placeholder="Enter author name"
          value={form.author}
          onChange={handleChange}
          className="border-2 p-2 w-full rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
            className="mr-2"
          />
          Available
        </label>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          {updatingBook ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* Displaying books in a table */}
      <table className="w-full border-2 rounded-2xl">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.id}</td>
              <td className="border p-2">{book.name}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">
                {book.availability ? "Available" : "Borrowed"}
              </td>
              <td className="flex border p-2 space-x-2 justify-center items-center">
                <Pencil
                  size={25}
                  onClick={() => handleEdit(book)}
                  className="cursor-pointer text-gray-600 text-shadow  "
                />
                <Trash
                  size={25}
                  onClick={() => handleDelete(book.id)}
                  className="cursor-pointer text-gray-600  "
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookManager;
