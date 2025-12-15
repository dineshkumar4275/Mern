import React, { useState, useEffect } from "react";
import { Input, Button, message, Popconfirm } from "antd";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const apiurl = "http://localhost:8000";

  //Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editId, setEditId] = useState(-1);

  //antd message
  const [messageApi, contextHolder] = message.useMessage();
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: `${message}`,
    });
  };
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: `${message}`,
    });
  };

  //post items
  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      //*call API
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            success("Item added successfully");
            setDescription("");
            setTitle("");
          } else {
            error("unable to create todo item");
          }
        })
        .catch(() => {
          error("unable to create todo item");
        });
    }
  };

  //get all items
  useEffect(() => {
    const getItems = () => {
      fetch(apiurl + "/todos")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setTodos(data);
        })
        .catch((error) => {
          console.error("Error fetching todos:", error);
        });
    };

    getItems();
  }, []);

  //set the value to the EDIT input field
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditDescription(item.description);
    setEditTitle(item.title);
  };
  //update items
  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      //*call API
      fetch(apiurl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            //update items
            const updatedToDo = todos.map((el) => {
              if (el._id === editId) {
                el.title = editTitle;
                el.description = editDescription;
              }
              return el;
            });
            setTodos(updatedToDo);
            success("Item updated successfully");
            setEditId(-1);
            setEditDescription("");
            setEditTitle("");
          } else {
            error("unable to update todo item");
          }
        })
        .catch(() => {
          error("unable to update todo item");
        });
    }
  };

  const confirm = (id) => {
    message.success(`deleted successfully`);
    fetch(apiurl + "/todos/" + id, {
      method: "DELETE",
    }).then(() => {
      const updatedtodos = todos.filter((el) => el._id !== id);
      setTodos(updatedtodos);
    });
  };

  const cancel = (e) => {
    message.error("cancled");
  };
  return (
    <div>
      {contextHolder}
      <h1 className="text-3xl font-semibold flex justify-center text-blue-600">
        Todo Project with MERN
      </h1>
      {/* Adding TODO list */}
      <section className="mt-10 p-3">
        <h5 className="text-2xl text-black font-bold">Add Items</h5>
        <div className="sm:flex sm:gap-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3"
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-3"
          />
          <Button
            className="mt-3 w-full sm:w-max"
            onClick={handleSubmit}
            type="primary"
          >
            Submit
          </Button>
        </div>
      </section>

      {/* List the TODO */}
      <section className="mt-5 p-3">
        <h5 className="text-2xl text-black font-bold">Tasks</h5>
        <div>
          <ul>
            {todos &&
              todos.map((item) => (
                <li
                  className="border-2 rounded p-2 my-2 flex justify-between items-center gap-2 bg-slate-600 text-white"
                  key={item._id}
                >
                  {editId === -1 || editId !== item._id ? (
                    <div className="flex flex-col gap-1 truncate">
                      <span className="text-l font-semibold">{item.title}</span>
                      <span>{item.description}</span>
                    </div>
                  ) : (
                    <div className="w-full sm:flex sm:gap-3">
                      <Input
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mt-2 sm:mt-0"
                      />
                    </div>
                  )}
                  <div className="flex gap-3">
                    {editId === -1 || editId !== item._id ? (
                      <Button type="primary" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                    ) : (
                      <Button type="primary" onClick={() => handleUpdate(item)}>
                        Update
                      </Button>
                    )}
                    {editId === -1 || editId !== item._id ? (
                      <Popconfirm
                        title="Delete the task"
                        description="Are you sure to delete this task?"
                        onConfirm={() => confirm(item._id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Button
                        type="primary"
                        danger
                        onClick={() => setEditId(-1)}
                      >
                        cancel
                      </Button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Todo;
