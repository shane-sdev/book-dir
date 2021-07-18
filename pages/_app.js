import { useEffect } from "react";
import UserProvider from "../context/userContext";
//import { useEffect } from "react";
import { getBooks } from "../fetchData/getBookData";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
  // useEffect(() => {
  //   const init = async () => {
  //     const response = await getBooks();
  //     console.log(response);
  //   };
  //   init();
  // }, []);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
