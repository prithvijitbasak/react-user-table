import React, { useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import AddingConfirmationBox from "./components/AddingConfirmationBox";
import DeleteConfirmation from "./components/DeleteConfirmation";
import DeletionConfirmationBox from "./components/DeletionConfirmationBox";
import UpdationConfirmationBox from "./components/UpdationConfirmationBox";

// to get the items stored in the local storage for every rendering
const getUsers = () => {
  const row = localStorage.getItem("row");
  if (row) {
    return JSON.parse(row);
  } else {
    return [];
  }
};

const App = () => {
  // setting up all the state variables

  // for userform visibility functionality
  const [isFormVisible, setIsFormVisible] = useState(false);
  // for users that are being added, updated or deleted throughout the table
  const [users, setUsers] = useState(getUsers());
  // for marking the row that is being selected for updation
  const [selectedUser, setSelectedUser] = useState(null);
  // to add a key attribute to every row (it will change for every form openning/closing).
  const [formKey, setFormKey] = useState(0);
  // to show the dialogue that confirms the addition of a user into a row.
  const [addingComponentVisibility, setAddingComponentVisibility] =
    useState(false);
  // to show the confirmed deleteion dialogue box.
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  // to show the deletion confirmation box which asks whether to delete or not
  const [deleteConfirmationVisibility, setDeleteConfirmationVisibility] =
    useState(false);
  // to store the  index of the  row that is to be deleted
  const [deleteConfirmationIndex, setDeleteConfirmationIndex] = useState(null);
  // to show the confirmed updation dialogue box.
  const [confirmUpdation, setConfirmUpdation] = useState(false);

  // this function toggles of the visibility of user form.
  const toggleVisibility = () => {
    setIsFormVisible(!isFormVisible);
    setFormKey(formKey + 1);
  };

  // this function handles the functionality whenever a "Add User" button is clicked.
  const handleAddUserClick = () => {

    // this below line have a crucial purpose whenver the add user button
    // is hit it will nullify the selected element so no any value
    // will appear in the form. Such as when building this we were facing
    // a problem such as whenever the user is hitting the edit button
    // and then without editing anything he was hitting the X button
    // the values were still appearing in the form when "Add User" button was
    // hit. This was happening because of the selectedUser state variable
    // that was non null so even after hitting the "Add User" button the 
    // non-null value was showing the value that was previously selected.
    setSelectedUser(null);
    toggleVisibility();
  };

  // this function adds a new item to the table and updates the data into localStorage
  const addUser = (userData) => {
    setUsers([...users, userData]);
    toggleVisibility();
    setAddingComponentVisibility(true);
    setTimeout(() => {
      setAddingComponentVisibility(false);
    }, 3000);
  };

  // to edit row and store the index of selected user that is to be edited.
  const editRow = (index) => {
    setSelectedUser(users[index]);
    toggleVisibility();
  };

  // to update the row into the local storage if the data is edited.
  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user === selectedUser ? updatedUser : user
    );
    setUsers(updatedUsers);
    setSelectedUser(null);
    toggleVisibility();
    // to show the confirmed updation dialogue box for 3 seconds
    setConfirmUpdation(true);
    setTimeout(() => {
      setConfirmUpdation(false);
    }, 3000);
  };

  // to delete the selected row.
  const deleteRow = () => {
    if (deleteConfirmationIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers.splice(deleteConfirmationIndex, 1);
      setUsers(updatedUsers);
      setDeleteConfirmationIndex(null);
      setDeleteConfirmationVisibility(false);
      setConfirmDeletion(true);
      setTimeout(() => {
        setConfirmDeletion(false);
      }, 3000);
    }
  };

  // this serves a crucial purpose
  // to show the data is stored in local storage and update the values for every rendering i.e (refreshing)
  useEffect(() => {
    localStorage.setItem("row", JSON.stringify(users));
  }, [users]);

  return (
    <>
      {isFormVisible && (
        <UserForm
          key={formKey}
          visibility={toggleVisibility}
          addUser={addUser}
          selectedUser={selectedUser}
          updateUser={updateUser}
        />
      )}
      {addingComponentVisibility && <AddingConfirmationBox />}
      {deleteConfirmationVisibility && (
        <DeleteConfirmation
          deleteRow={deleteRow}
          cancelDeletion={() => {
            setDeleteConfirmationVisibility(false);
          }}
        />
      )}
      {confirmDeletion && <DeletionConfirmationBox />}
      {confirmUpdation && <UpdationConfirmationBox />}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between py-2">
          <h1 className="text-xl font-bold mb-2">User Information</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white py-2 px-4 my-2 rounded-md flex items-center transition duration-200 active:scale-90"
            id="openFormButton"
            title="Add new user into the table"
            onClick={handleAddUserClick}
          >
            <span className="mr-1">+</span> Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-200 border-b-2 border-gray-200">
                <tr>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    First Name
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Last Name
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Email
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Edit
                  </th>
                  <th className="py-2 text-sm font-semibold tracking-wide text-center border border-gray-300">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody id="tableBody">
                {users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center border px-4 py-2">
                        {user.firstName}
                      </td>
                      <td className="text-center border px-4 py-2">
                        {user.lastName}
                      </td>
                      <td className="text-center border px-4 py-2">
                        {user.email}
                      </td>
                      <td className="text-center border px-4 py-2">
                        <button
                          className="rounded bg-green-500 px-3 transition duration-300 hover:scale-110 active:scale-90 uppercase"
                          onClick={() => editRow(index)}
                        >
                          Edit
                        </button>
                      </td>
                      <td className="text-center border px-4 py-2">
                        <button
                          className="rounded bg-red-500 px-3 transition duration-300 hover:scale-110 active:scale-90 uppercase"
                          onClick={() => {
                            setDeleteConfirmationVisibility(true);
                            setDeleteConfirmationIndex(index);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;