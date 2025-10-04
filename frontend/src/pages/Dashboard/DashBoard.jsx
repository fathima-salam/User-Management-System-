import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../../redux-toolkit/allUsersDataReducer";
import { logout } from "../../../redux-toolkit/adminDataReducer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
    const isAuthenticated = useSelector((state) => state.adminData.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const users = useSelector((state) => state.users.data);
    const token = useSelector((state) => state.adminData.token);
    const loading = useSelector((state) => state.users.loading);

    useEffect(() => {
        dispatch(fetchUsers(token)).catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/admin-login");
        }
    }, [isAuthenticated]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [load, setLoad] = useState(false);

    // Filter out admin users and apply search term
    const filteredUsers = users.filter(
        (user) =>
            !user.isAdmin && // Exclude users where isAdmin is true
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddUser = () => {
        setLoad(true);
        dispatch(addUser({ name: formData.name, email: formData.email, password: formData.password, token }))
            .unwrap()
            .then(() => {
                toast.success("User added successfully");
                setIsAddModalOpen(false);
                setFormData({ name: "", email: "", password: "" });
                dispatch(fetchUsers(token));
                setLoad(false);
            })
            .catch((err) => {
                setLoad(false);
                toast.error(err.message || "Failed to add user");
            });
    };

    const handleUpdateUser = () => {
        if (selectedUser) {
            setLoad(true);
            dispatch(updateUser({ id: selectedUser._id, name: formData.name, email: formData.email, token }))
                .unwrap()
                .then(() => {
                    toast.success("User updated successfully");
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    setFormData({ name: "", email: "" });
                    dispatch(fetchUsers(token));
                    setLoad(false);
                })
                .catch((err) => {
                    setLoad(false);
                    toast.error(err.message || "Failed to update user");
                });
        }
    };

    const handleDelete = () => {
        if (selectedUser) {
            setLoad(true);
            dispatch(deleteUser({ id: selectedUser._id, token }))
                .unwrap()
                .then(() => {
                    toast.success("User deleted successfully");
                    setDeleteModal(false);
                    setSelectedUser(null);
                    dispatch(fetchUsers(token));
                    setLoad(false);
                })
                .catch((err) => {
                    setLoad(false);
                    toast.error(err.message || "Failed to delete user");
                });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {loading && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                        <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-semibold text-gray-800">Loading...</span>
                    </div>
                </div>
            )}
            {load && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
                        <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-semibold text-gray-800">Loading...</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="space-x-4">
                        {/* <button
                            className="bg-[#002f34] text-white px-6 py-3 rounded-lg hover:bg-teal-700 shadow-md transition"
                            onClick={() => dispatch(fetchUsers(token))}
                        >
                            Refresh Users
                        </button> */}
                        <button
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 shadow-md transition"
                            onClick={() => {
                                dispatch(logout());
                                toast.success("Admin Logout successful");
                                navigate("/admin-login");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002f34] focus:border-[#002f34]"
                        />
                        <svg
                            className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <button
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
                        onClick={() => {
                            setIsAddModalOpen(true);
                            setFormData({ name: "", email: "", password: "" });
                        }}
                    >
                        Add New User
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow">
                                            {user.profileImage ? (
                                                <img
                                                    className="h-full w-full object-cover"
                                                    src={user.profileImage}
                                                    alt={user.name}
                                                />
                                            ) : (
                                                <span className="text-gray-600 font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${user.isAdmin
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {user.isAdmin ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            className="text-[#002f34] hover:text-teal-700 mr-4 transition"
                                            onClick={() => {
                                                setIsEditModalOpen(true);
                                                setSelectedUser(user);
                                                setFormData({ name: user.name, email: user.email });
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-700 transition"
                                            onClick={() => {
                                                setDeleteModal(true);
                                                setSelectedUser(user);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-center">
                    <nav className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-4 py-2 rounded-md ${currentPage === number
                                    ? "bg-[#002f34] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    } transition`}
                            >
                                {number}
                            </button>
                        ))}
                    </nav>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New User</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddUser();
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#002f34] focus:border-[#002f34]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#002f34] focus:border-[#002f34]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#002f34] focus:border-[#002f34]"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#002f34] text-white rounded-md hover:bg-teal-700"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit User</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdateUser();
                                }}
                            >
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#002f34] focus:border-[#002f34]"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-[#002f34] focus:border-[#002f34]"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setSelectedUser(null);
                                            setFormData({ name: "", email: "" });
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#002f34] text-white rounded-md hover:bg-teal-700"
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {deleteModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                            <h2 className="text-lg font-semibold text-gray-800">Delete Confirmation</h2>
                            <p className="text-sm text-gray-600 mt-2">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;