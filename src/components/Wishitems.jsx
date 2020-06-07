// Firebase.jsx
import React, { useState, useEffect } from "react";
import firebase from "../firebase";

const Wishitems = (props) => {
  // ============ 変数 ============

  //apiからとってきた本のデータを格納するための変数
  const [bookData, setBookData] = useState(null);

  //Firesotoreに登録したデータを表示するための変数
  const [wishList, setWishList] = useState(null);

  // ============ 関数 ============

  // timestamp形式のデータをいい感じの形式に変換する関数
  const convertFromTimestampToDatetime = (timestamp) => {
    const _d = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = _d.getFullYear();
    const m = (_d.getMonth() + 1).toString().padStart(2, "0");
    const d = _d.getDate().toString().padStart(2, "0");
    const H = _d.getHours().toString().padStart(2, "0");
    const i = _d.getMinutes().toString().padStart(2, "0");
    const s = _d.getSeconds().toString().padStart(2, "0");
    return `${Y}/${m}/${d} ${H}:${i}:${s}`;
  };

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

  //ドキュメントIDを指定してFirestoreのデータを削除する関数
  const deleteDataOnFirestore = async (collectionName, documentId) => {
    const removedData = await firebase
      .firestore()
      .collection(collectionName)
      .doc(documentId)
      .delete();
    getWishListFromFirestore();
    return;
  };

  // ============ ③useEffectでデータ取得 ============
  useEffect(() => {
    // useEffectを利用してFirestoreからデータの一覧を取得．
    const addedlist = getWishListFromFirestore();

    //言語別の本一覧
    const result = props
      .getData?.(props.language)
      .then((response) => setBookData(response));
  }, [props]);

  // ============ ほしい物リストを表示 ============
  return (
    <div>
      <ul>
        {wishList?.map((x, index) => (
          <li key={index} id={x.id}>
            <h3>本のタイトル：{x.data.title}</h3>
            {/* <input type="checkbox" value={x.id} /> */}
            <p>
              （追加した日：
              {convertFromTimestampToDatetime(x.data.date.seconds)}）
            </p>
            <button
              value={x.id}
              onClick={(e) => deleteDataOnFirestore("wishlist", x.id)}
            >
              欲しいものリストから削除する
            </button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Wishitems;
