import Head from "next/head";
import { useState } from "react";
import firebase from "../firebase/clientApp";


import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [isbnInput, setIsbnInput] = useState("");
  const [individualBook, setIndividualBook] = useState(null);
  const [errorFetching, setErrorFetching] = useState(false);
  const [listOfBooks, setListOfBooks] = useState([]);

  // authentication
  const [username, setUsername] = useState("");
  const [password, setUPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [errorAuthentication, setErrorAuthentication] = useState(false);

  // add new book
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookIsbn, setNewBookIsbn] = useState("");

  //
  const authenticateUser = async () => {
    const db = firebase.firestore();
    const allUsers = await db.collection("profile").get();

    const data = [];

    allUsers.forEach((item) => {
      if (item.exists) {
        const result = item.data();

        if (
          result.name === username &&
          result.password === password &&
          result.admin === true
        ) {
          data.push({
            ...result,
          });
        }
      }
    });

    if (data.length > 0) {
      setAuthenticated(true);
    } else {
      setErrorAuthentication(true);
      setAuthenticated(false);
    }
  };

  const getSpecificBook = async () => {
    const db = firebase.firestore();
    const allBooksCollection = await db.collection("books").get();

    const data = [];

    allBooksCollection.forEach((item) => {
      if (item.exists) {
        const result = item.data();

        if (result.isbn === isbnInput) {
          data.push({
            ...result,
          });
        }
      }
    });

    if (data.length > 0) {
      setIndividualBook(data[0]);
    } else {
      setIndividualBook(null);
    }
  };

  const fetchAllBooks = async () => {
    const db = firebase.firestore();
    const allBooksCollection = await db.collection("books").get();

    const data = [];

    allBooksCollection.forEach((item) => {
      if (item.exists) {
        data.push({
          ...item.data(),
        });
      }
    });

    setListOfBooks(data);
  };

  const clearAllBooks = async () => {
    setListOfBooks([]);
    setIndividualBook(null);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;

    if (value === "" && errorFetching) {
      setErrorFetching(false);
    }

    setIsbnInput(value);
  };

  const handleUsernameInputChange = async (e) => {
    const value = e.target.value;

    if (errorAuthentication) {
      setErrorAuthentication(false);
    }

    setUsername(value);
  };

  const handlePasswordInputChange = async (e) => {
    const value = e.target.value;

    if (errorAuthentication) {
      setErrorAuthentication(false);
    }

    setUPassword(value);
  };

  const handleSubmit = () => {
    getSpecificBook();
  };

  const handleNewTitleInputChange = async (e) => {
    const value = e.target.value;

    setNewBookTitle(value);
  };

  const handleNewAuthorInputChange = async (e) => {
    const value = e.target.value;

    setNewBookAuthor(value);
  };

  const handleNewIsbnInputChange = async (e) => {
    const value = e.target.value;

    setNewBookIsbn(value);
  };

  const handleAddNewBook = async () => {
    const bookStructure = {
      title: newBookTitle,
      author: newBookAuthor,
      isbn: newBookIsbn,
    };

    const db = firebase.firestore();
    await db.collection("books").doc(uuidv4()).set(bookStructure);
    alert("Book created!!");
  };

  return (
    <div className="container">
      <Head>
        <title>Library Directory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {!authenticated ? (
          <>
            <input
              type="text"
              onChange={handleUsernameInputChange}
              value={username}
              placeholder="Username"
            />
            <input
              type="text"
              onChange={handlePasswordInputChange}
              value={password}
              placeholder="Password"
            />
            <button onClick={authenticateUser}>Login</button>
            {errorAuthentication && (
              <p>Wrong username or password or not an admin</p>
            )}
          </>
        ) : (
          <>
            <h1 className="title">Book Directory</h1>
            <p className="description">Enter ISBN to lookup for the book</p>
            <div>
              <p className="description">New Book</p>
              <input
                type="text"
                onChange={handleNewTitleInputChange}
                value={newBookTitle}
                placeholder="New Book Title"
              />
              <input
                type="text"
                onChange={handleNewAuthorInputChange}
                value={newBookAuthor}
                placeholder="New Book Author"
              />
              <input
                type="text"
                onChange={handleNewIsbnInputChange}
                value={newBookIsbn}
                placeholder="New Book Isbn"
              />
              <button onClick={handleAddNewBook}>Add new book</button>
            </div>
            <div>
              <input
                id="isbn-title"
                type="text"
                onChange={handleInputChange}
                //onChange={(e) => handleInputChange(e) } --alt
                value={isbnInput}
              />
            </div>
            <button onClick={handleSubmit}>Get Books Information</button>
            <button onClick={fetchAllBooks}>Get All Books</button>
            <button onClick={clearAllBooks}>Clear list</button>
            {individualBook !== null && (
              //js
              <>
                <p>{individualBook.title}</p>
                <p>{individualBook.author}</p>
                <p>{individualBook.isbn}</p>
              </>
            )}
            {listOfBooks.length > 0 && (
              <>
                <p> List of books</p>
                {listOfBooks.map((item, index, isbn) => {
                  return (
                    <p key={index}>
                      {index + 1}
                      {". "}
                      {item.isbn}
                      {" | "}
                      {item.title}
                    </p>
                  );
                })}
              </>
            )}
            {errorFetching && <p>There is an issue</p>}
          </>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          font-size: 1.5em;
          margin: 1em 0;
        }

        a {
          color: blue;
          font-size: 1.5em;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
