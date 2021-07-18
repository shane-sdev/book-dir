import firebase from "../firebase/clientApp";

export const getBooks = async (booksDocID = "ZbjY4c7uG79ZdZAx2N7V") => {
  const db = firebase.firestore();
  const booksCollection = db.collection("books");
  const booksDoc = await booksCollection.doc(booksDocID).get();

  if (!booksDoc.exists) {
    return null;
  }

  return booksDoc.data();
};


