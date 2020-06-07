// Booklist.jsx
import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import Wishitems from "./Wishitems";

//props：親から子にデータを渡すときにデータを入れる塊
//「Booklist.jsx」コンポーネントを「App.jsx」で呼び出す

const Booklist = (props) => {
  // ============ ①変数 ============

  //apiからとってきた本のデータを格納するための変数
  const [bookData, setBookData] = useState(null);

  //Firesotoreに登録したデータを表示するための変数
  const [wishList, setWishList] = useState(null);

  //選択したアイテムを登録するための変数
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // ============ ②関数 ============
  // firestoreから全データを取得してstateに格納する関数
  const getWishListFromFirestore = async () => {
    const itemListArray = await firebase
      .firestore()
      .collection("wishlist")
      .orderBy("date")
      .get();
    const bookArray = itemListArray.docs.map((x) => {
      return {
        id: x.id,
        data: x.data(),
      };
    });
    setWishList(bookArray);
    return bookArray;
  };

  // Firestoreにデータを送信する関数
  const postDataToFirestore = async (collectionName, postData) => {
    const addedData = await firebase
      .firestore()
      .collection(collectionName)
      .add(postData);
    return addedData;
  };

  // // timestamp形式のデータをいい感じの形式に変換する関数
  // const convertFromTimestampToDatetime = (timestamp) => {
  //   const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  //   const Y = _d.getFullYear();
  //   const m = (_d.getMonth() + 1).toString().padStart(2, "0");
  //   const d = _d.getDate().toString().padStart(2, "0");
  //   const H = _d.getHours().toString().padStart(2, "0");
  //   const i = _d.getMinutes().toString().padStart(2, "0");
  //   const s = _d.getSeconds().toString().padStart(2, "0");
  //   return `${Y}/${m}/${d} ${H}:${i}:${s}`;
  // };

  // ============ ボタンクリックの処理 ============
  // submitボタンクリック時の処理
  const submitData = async () => {
    //inputフォームが空の場合の処理
    if (title === "" || date === "") {
      return false;
    }
    const postData = {
      title: title,
      date: new Date(date),
      isDone: false,
    };
    const addedData = await postDataToFirestore("wishlist", postData);
    setTitle("");
    setDate("");
    getWishListFromFirestore();
  };

  // //ドキュメントIDを指定してFirestoreのデータを削除する関数
  // const deleteDataOnFirestore = async (collectionName, documentId) => {
  //   const removedData = await firebase
  //     .firestore()
  //     .collection(collectionName)
  //     .doc(documentId)
  //     .delete();
  //   getWishListFromFirestore();
  //   return;
  // };

  // ============ ③useEffectでデータ取得 ============
  useEffect(() => {
    // useEffectを利用してFirestoreからデータの一覧を取得．
    const addedlist = getWishListFromFirestore();

    //言語別の本一覧
    const result = props
      .getData?.(props.language)
      .then((response) => setBookData(response));
  }, [props]);

  // ============ ④必要な値だけを表示 ============
  return (
    <div>
      {/* <p>{JSON.stringify(wishList)}</p> */}
      {/* {wishList?.map((x, index) => ( */}
      {/* // ↓新しく作成した`Wishitems.jsx` 配列の形でデータを渡す。 */}
      {/* <Wishitems
        // key={index}
        // title={x}
        // index={index}
        // 一覧を渡す
        getWishListFromFirestore={getWishListFromFirestore}
      /> */}
      {/* ))} */}
      {/* <div>
        <ul>
          {wishList?.map((x, index) => (
            <li key={index} id={x.id}>
              <button
                value={x.id}
                onClick={(e) => deleteDataOnFirestore("wishlist", x.id)}
              >
                欲しいものリストから削除する
              </button>
              <p>
                追加した日：
                {convertFromTimestampToDatetime(x.data.date.seconds)}
              </p>
              <p>本のタイトル：{x.data.title}</p>
            </li>
          ))}
        </ul>
      </div> */}
      <ul>
        {bookData === null ? (
          <p>now loading...</p>
        ) : (
          bookData.data.items.map((x, index) =>
            x.volumeInfo.readingModes.image === false ? ( // サムネイル有無の判定
              <li key={index}>
                <div>
                  <img
                    src="https://i0.wp.com/kyoheiomi.com/wp-content/uploads/2019/06/5f0354968e64794129567a2b28ddd8d2.png?w=1667&ssl=1"
                    alt="NO IMAGE"
                    style={{ width: "300px" }}
                  />
                </div>
                <h3>【タイトルa】{x.volumeInfo.title}</h3>
                <p>(著者：{x.volumeInfo.authors.join("/")})</p>
                <p>{x.volumeInfo.description}</p>
                <hr />
              </li>
            ) : x.volumeInfo.authors === undefined ? ( // 著者有無の判定
              <li key={index}>
                <div>
                  <a href={x.volumeInfo.infoLink} target="blank">
                    <img
                      src={x.volumeInfo.imageLinks.thumbnail}
                      alt={x.volumeInfo.title}
                    />
                  </a>
                </div>
                <h3>【タイトルa】{x.volumeInfo.title}</h3>
                <p>著者不明</p>
                <p class="details">{x.volumeInfo.description}</p>
                <hr />
              </li>
            ) : (
              //サムネイルがあるとき
              <li key={index}>
                <div>
                  <a href={x.volumeInfo.infoLink} target="blank">
                    <img
                      src={x.volumeInfo.imageLinks.thumbnail}
                      alt={x.volumeInfo.title}
                    />
                  </a>
                </div>

                <div class="dispFlex m-10">
                  <input
                    type="checkbox"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(x.volumeInfo.title)}
                  />
                  <h3>【タイトルb】{x.volumeInfo.title}</h3>
                </div>

                <label htmlFor="limit">追加日</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <button type="button" onClick={submitData}>
                  欲しいものリストに追加する
                </button>

                <p>(著者：{x.volumeInfo.authors.join("/")})</p>
                <p class="details">{x.volumeInfo.description}</p>
                <hr />
              </li>
            )
          )
        )}
      </ul>
    </div>
  );
};
export default Booklist;
