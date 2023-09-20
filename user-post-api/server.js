const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
// ADD THIS
var cors = require("cors");
app.use(cors());

const readFilePost = fs.readFileSync("./database/posts.json", "utf-8");
const readFileUser = fs.readFileSync("./database/users.json", "utf-8");
const dataPost = JSON.parse(readFilePost);
const dataUser = JSON.parse(readFileUser);

// ------------------------- MiddleWare ------------------------
// 1. MiddleWare Check User ID
function checkUserID(req, res, next) {
  const userID = req.params.id;
  const findUser = dataUser.find((item) => {
    return item.id == userID;
  });
  if (userID) {
    if (findUser) {
      req.user = findUser;
      next();
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  }
}

// 2. MiddleWare Check User Email
function checkUserEmail(req, res, next) {
  const userEmail = req.body?.email;
  const findUser = dataUser.find((item) => {
    return item.email === userEmail;
  });
  if (userEmail) {
    if (findUser) {
      res.status(503).json({ message: "Email Is Already Exist" });
    } else {
      req.userInfo = req.body;
      next();
    }
  }
}

// 3. MiddleWare Check Post ID
function checkPostID(req, res, next) {
  const postID = req.params.id;
  const findPost = dataPost.find((item) => {
    return item.id == postID;
  });
  if (postID) {
    if (findPost) {
      req.post = findPost;
      next();
    } else {
      res.status(404).json({ message: "Post Not Found" });
    }
  }
}

// 4. MiddleWare Check User Id in Post
function checkUserIdPost(req, res, next) {
  const post = req.body;
  const findUser = dataUser.find((item) => {
    return item.id == post.userId;
  });
  if (post) {
    if (findUser) {
      req.postData = req.body;
      next();
    } else {
      res.status(404).json({ message: "User Id Not Found" });
    }
  }
}

// ------------------------- MiddleWare ------------------------

// ------------------------ Users Routes -----------------------
// Câu 1: GET ->  Lấy về dữ liệu của một user
app.get("/api/users/:id", checkUserID, (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

// Câu 2: GET ->  Lấy về dữ liệu của toàn bộ users
app.get("/api/users", (req, res) => {
  if (dataUser) {
    res.status(200).json(dataUser);
  } else {
    res.status(404).json({ message: "No Data User" });
  }
});

// Câu 3: POST ->  Thêm mới dữ liệu về 1 users vào trong CSDL
app.post("/api/users/add", checkUserEmail, (req, res) => {
  const newUser = req.body;
  console.log(newUser, "NEW USER");
  if (
    !newUser.name ||
    !newUser.username ||
    !newUser.email ||
    !newUser.address ||
    !newUser.phone ||
    !newUser.website ||
    !newUser.company
  ) {
    return res.status(501).json({ message: "Data Error" });
  }

  // Lấy danh sách ID
  let listID = dataUser.map((item) => {
    return item.id;
  });

  // Tìm Max ID
  let maxID = Math.max(...listID);
  newUser.id = maxID + 1;

  // Push NewUser
  dataUser.push(newUser);
  fs.writeFileSync("./database/users.json", JSON.stringify(dataUser));
  res.status(200).json({ message: "User Added" });
});

// Câu 4: PUT ->  Chỉnh sửa dữ liệu của 1 user (email)
app.put("/api/users/edit/:id", checkUserID, checkUserEmail, (req, res) => {
  const user = req.user;
  const updatedUser = req.body;
  console.log(user, "user");

  console.log(updatedUser, "UPDATED USEr");
  if (!updatedUser.email) {
    return res.status(400).json({ message: "Data Error" });
  }

  const findUserIndex = dataUser.findIndex((item) => {
    return item.id == user.id;
  });
  if (findUserIndex !== -1) {
    dataUser[findUserIndex] = {
      ...user,
      ...updatedUser,
    };
    fs.writeFileSync("./database/users.json", JSON.stringify(dataUser));
    return res.status(200).json({ message: "User Updated" });
  } else {
    return res.status(404).json({ message: "User Not Found" });
  }
});

// Câu 5: DELETE	->  Xoá dữ liệu của 1 user
app.delete("/api/users/delete/:id", checkUserID, (req, res) => {
  const user = req.user;
  const filterUser = dataUser.filter((item) => {
    return item.id != user.id;
  });
  fs.writeFileSync("./database/users.json", JSON.stringify(filterUser));
  res.status(200).json({ message: "User Deleted" });
});

// ------------------------ Users Routes -----------------------

// ------------------------ Posts Routes -----------------------
// Câu 6: GET ->  Lấy về dữ liệu của một post
app.get("/api/posts/:id", checkPostID, (req, res) => {
  const post = req.post;
  res.status(200).json(post);
});

// Câu 7: GET ->  Lấy về dữ liệu của toàn bộ post
app.get("/api/posts", (req, res) => {
  if (dataPost) {
    res.status(200).json(dataPost);
  } else {
    res.status(404).json({ message: "No Data Post" });
  }
});

// Câu 8: POST ->  Thêm mới dữ liệu về 1 post vào trong CSDL
app.post("/api/posts/add", (req, res) => {
  const newPost = req.body;
  if (!newPost.userId || !newPost.title || !newPost.body) {
    return res.status(501).json({ message: "Data Error" });
  }

  const checkUserIDPost = dataUser.find((item) => {
    return item.id == newPost.userId;
  });
  if (checkUserIDPost) {
    // Lấy danh sách ID
    let listID = dataPost.map((item) => {
      return item.id;
    });

    // Tìm Max ID
    let maxID = Math.max(...listID);
    newPost.id = maxID + 1;

    // Push NewUser
    dataPost.push(newPost);
    fs.writeFileSync("./database/posts.json", JSON.stringify(dataPost));
    res.status(200).json({ message: "Post Added" });
  } else {
    res.status(404).json({ message: "User ID Not Found" });
  }
});

// Câu 9: PUT -> Chỉnh sửa dữ liệu của 1 post
app.put("/api/posts/edit/:id", checkPostID, checkUserIdPost, (req, res) => {
  const post = req.post;
  const updatedPost = req.postData;
  console.log(post, "POST");
  console.log(updatedPost, "updatedPost");

  if (!post.title || !post.body) {
    return res.status(400).json({ message: "Data Error" });
  }

  const findPostIndex = dataPost.findIndex((item) => {
    return item.id == post.id;
  });
  if (findPostIndex !== -1) {
    updatedPost.userId = Number(updatedPost.userId);
    dataPost[findPostIndex] = {
      ...post,
      ...updatedPost,
    };
    fs.writeFileSync("./database/posts.json", JSON.stringify(dataPost));
    return res.status(200).json({ message: "Post Updated" });
  } else {
    return res.status(404).json({ message: "Post Not Found" });
  }
});

// Câu 10: DELETE	 ->  Xoá dữ liệu của 1 post
app.delete("/api/posts/delete/:id", checkPostID, (req, res) => {
  const post = req.post;
  const filterPost = dataPost.filter((item) => {
    return item.id != post.id;
  });
  fs.writeFileSync("./database/posts.json", JSON.stringify(filterPost));
  res.status(200).json({ message: "Post Deleted" });
});

// Câu Bonus
app.get("/api/users/:id/posts", checkUserID, (req, res) => {
  const userID = req.params.id;
  const filterPostByUserId = dataPost.filter((item) => {
    return item.userId == userID;
  });
  if (filterPostByUserId) {
    res.status(200).json(filterPostByUserId);
  } else {
    res.status(404).json({ message: "Post Not Found" });
  }
});

// ------------------------ Posts Routes -----------------------

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
