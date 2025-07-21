import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Dishes() {
  const [dishes, setDishes] = useState([]);
  const [user, setUser] = useState(null);
 const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    priceOriginal: "",
    priceDiscounted: "",
    image: null,
    category: "",
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [commentModal, setCommentModal] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentsMap, setCommentsMap] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dishes"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDishes(data);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribes = dishes.map((dish) =>
      onSnapshot(collection(db, "dishes", dish.id, "comments"), (snapshot) => {
        setCommentsMap((prev) => ({
          ...prev,
          [dish.id]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        }));
      })
    );
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [dishes]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewDish((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewDish((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitDish = async () => {
    const { name, description, priceOriginal, priceDiscounted, image } = newDish;
    if (!name || !description || !priceOriginal || !priceDiscounted) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      let imageUrl = editingDish?.image || null;
      if (image) {
        const imageRef = ref(storage, `dishes/${image.name}`);
        await uploadBytesResumable(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const dishData = {
        name,
        description,
        priceOriginal: parseFloat(priceOriginal),
        priceDiscounted: parseFloat(priceDiscounted),
        image: imageUrl,
        likes: editingDish?.likes || 0,
        createdAt: serverTimestamp(),
      };

      if (editingDish) {
        await updateDoc(doc(db, "dishes", editingDish.id), dishData);
        toast.success("Dish updated");
      } else {
        await addDoc(collection(db, "dishes"), dishData);
        toast.success("Dish added");
      }

      setNewDish({ name: "", description: "", priceOriginal: "", priceDiscounted: "", image: null });
      setEditingDish(null);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save dish");
    }
  };

  const handleEdit = (dish) => {
    setEditingDish(dish);
    setNewDish({
      name: dish.name,
      description: dish.description,
      priceOriginal: dish.priceOriginal,
      priceDiscounted: dish.priceDiscounted,
      image: null,
    });
    setShowAddModal(true);
  };

  const confirmDeleteToast = async (dish) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      await deleteDoc(doc(db, "dishes", dish.id));
      toast.success("Dish deleted");
    }
  };

  const handleLike = async (id) => {
    await updateDoc(doc(db, "dishes", id), { likes: increment(1) });
  };

  const handleAddComment = async (dishId) => {
    if (!commentInput || !commentName) return;
    await addDoc(collection(db, "dishes", dishId, "comments"), {
      text: commentInput,
      name: commentName,
      createdAt: serverTimestamp(),
      userId: user?.uid || null,
    });
    setCommentInput("");
    setCommentName("");
  };

  const handleDeleteComment = async (dishId, commentId) => {
    await deleteDoc(doc(db, "dishes", dishId, "comments", commentId));
  };

  const capitalizeWords = (text) => text.replace(/\b\w/g, (char) => char.toUpperCase());

  const filteredDishes = filterCategory
    ? dishes.filter((dish) => dish.category === filterCategory)
    : dishes;

  return (
    <div id="dishes" className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Dishes</h2>
        {user && (
          <button
            onClick={() => {
              setNewDish({ name: "", description: "", priceOriginal: "", priceDiscounted: "", image: null });
              setEditingDish(null);
              setShowAddModal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Dish
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white p-4 rounded shadow-md">
            <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{capitalizeWords(dish.name)}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>

            <div className="text-sm mb-2">
              <span className="line-through text-gray-400">₦{dish.priceOriginal?.toLocaleString()}</span>
              <span className="font-semibold text-green-600 block">₦{dish.priceDiscounted?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div onClick={() => handleLike(dish.id)} className="cursor-pointer text-red-500">
                ❤️ {dish.likes || 0}
              </div>
              <div
                onClick={() => setCommentModal(dish.id)}
                className="cursor-pointer text-blue-600 flex items-center"
              >
                <FaRegCommentDots className="mr-1" /> {commentsMap[dish.id]?.length || 0}
              </div>
              <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Order</button>
            </div>

            {user && (
              <div className="flex justify-end mt-3 gap-3 text-xl">
                <FaEdit
                  onClick={() => handleEdit(dish)}
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                />
                <FaTrash
                  onClick={() => confirmDeleteToast(dish)}
                  className="text-red-600 cursor-pointer hover:text-red-800"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {commentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Comments</h3>
            <div className="max-h-60 overflow-y-auto mb-4">
              {commentsMap[commentModal]?.map((comment) => (
                <div key={comment.id} className="border-b py-2 text-sm">
                  <div className="font-medium">{comment.name}</div>
                  <div className="text-gray-700">{comment.text}</div>
                  <div className="text-xs text-gray-500">
                    {comment.createdAt?.toDate().toLocaleString()}
                  </div>
                  {user && (
                    <button
                      onClick={() => handleDeleteComment(commentModal, comment.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Your name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="w-full border px-3 py-2 mb-2"
            />
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment"
              className="w-full border px-3 py-2 mb-2"
            />
            <div className="flex justify-between">
              <button onClick={() => setCommentModal(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Close
              </button>
              <button
                onClick={() => handleAddComment(commentModal)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingDish ? "Edit Dish" : "Add Dish"}</h3>
            <input
              name="name"
              type="text"
              placeholder="Dish Name"
              value={newDish.name}
              onChange={handleInputChange}
              className="w-full mb-2 border px-3 py-2"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newDish.description}
              onChange={handleInputChange}
              className="w-full mb-2 border px-3 py-2"
            />
            <input
              name="priceOriginal"
              type="number"
              placeholder="Original Price (₦)"
              value={newDish.priceOriginal}
              onChange={handleInputChange}
              className="w-full mb-2 border px-3 py-2"
            />
            <input
              name="priceDiscounted"
              type="number"
              placeholder="Discounted Price (₦)"
              value={newDish.priceDiscounted}
              onChange={handleInputChange}
              className="w-full mb-2 border px-3 py-2"
            />
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDish}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingDish ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}