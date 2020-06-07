import React from "react";
import Booklist from "./components/Booklist";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./index.css";
import axios from "axios";
import Wishitems from "./components/Wishitems";

const App = () => {
  const languages = ["React", "Vue", "Angular", "Ruby"];
  const getDataFromAPI = async (keyword) => {
    const requestUrl = "https://www.googleapis.com/books/v1/volumes?q=intitle:";
    const result = await axios.get(`${requestUrl}${keyword}`);
    return result;
  };

  return (
    <BrowserRouter>
      <div className="container">
        <h1>react app-2</h1>

        <ul class="dispFlex">
          <li>
            <Link to="/">React</Link>
          </li>
          <li>
            <Link to="/vue">Vue</Link>
          </li>
          <li>
            <Link to="/angular">Angular</Link>
          </li>
          <li>
            <Link to="/ruby">Ruby</Link>
          </li>
          <li>
            <Link to="/list">★欲しいものリスト</Link>
          </li>
        </ul>

        <Route
          exact
          path="/"
          render={(props) => (
            <Booklist
              language={languages[0]}
              getData={(keyword) => getDataFromAPI(keyword)}
            />
          )}
        />
        <Route
          path="/vue"
          render={(props) => (
            <Booklist
              language={languages[1]}
              getData={(keyword) => getDataFromAPI(keyword)}
            />
          )}
        />
        <Route
          path="/angular"
          render={(props) => (
            <Booklist
              language={languages[2]}
              getData={(keyword) => getDataFromAPI(keyword)}
            />
          )}
        />
        <Route
          path="/ruby"
          render={(props) => (
            <Booklist
              language={languages[3]}
              getData={(keyword) => getDataFromAPI(keyword)}
            />
          )}
        />
        <Route
          path="/list"
          render={(props) => (
            <Wishitems
            // getWishListFromFirestore={getWishListFromFirestore}

            // language={languages[3]}
            // getData={(keyword) => getDataFromAPI(keyword)}
            />
          )}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
