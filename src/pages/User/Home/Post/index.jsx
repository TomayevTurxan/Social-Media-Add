import React, { useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import style from "./index.module.scss";
import { Button } from "@mui/material";
import { Input, Row } from "antd";
import { UserContextItem } from "../../../../services/context/UserContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useFormik } from "formik";
import { UserContext } from "../../../../services/context/UsersContext";
import moment from "moment/moment";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;

  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Post = () => {
  let { user, setUser } = useContext(UserContextItem);
  let { users, setUsers } = useContext(UserContext);
  console.log("userdiiii", user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const formik = useFormik({
    initialValues: {
      postText: "",
      postImg: "",
    },
    onSubmit: async (values, actions) => {
      actions.resetForm();
      console.log(values);
      user.posts.push({
        id: Date.now().toString(),
        title: values.postText,
        imgUrl: values.postImg,
        likes: [],
        comments: [],
        createDate: Date.now(),
      });
      console.log("currentUser", user);
      const response = await fetch(
        `https://656dfda1bcc5618d3c245df9.mockapi.io/Users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (!response.ok) {
        throw new Error("error");
      }
      localStorage.setItem("user", JSON.stringify(user));
    },
  });
  console.log("userslardi", users);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            style={{
              marginLeft: "10px",
            }}
            src={user.profilePicture}
            className={style.customPrefix}
          />
          <div
            style={{
              width: "100%",
            }}
          >
            <Input
              className={style.searchInput}
              placeholder="Enter your post"
              id="postText"
              name="postText"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.postText}
            />
            <Input
              className={style.searchInput}
              placeholder="Enter your picture url"
              id="postImg"
              name="postImg"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.postImg}
            />
          </div>
          <Button type="submit" className={style.postBtn} variant="outlined">
            Post
          </Button>
        </div>
      </form>
      <Row
        style={{
          justifyContent: "center",
          margin: "20px auto",
        }}
      >
        {user?.posts.map((post, idx) => {
          return (
            <Card style={{
                width: "60%",
                margin: "20px 0px",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }} key={idx}>
              <Row
                style={{
                  alignItems: "center",
                }}
              >
                <CardHeader
                  style={{
                    width: "14%",
                  }}
                  avatar={<img src={user.profilePicture} alt="" />}
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  subheader="September 14, 2016"
                />
                <h3
                  style={{
                    marginLeft: "13px",
                  }}
                >
                  {user.username}
                </h3>
              </Row>
              <CardMedia
                component="img"
                height="194"
                image={post.imgUrl}
                alt="Paella dish"
                style={{
                  borderRadius: "0px",
                  margin: "20px auto",
                  width: "100%",
                  objectFit: "contain"
                }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {post.title}
                </Typography>
                <Typography style={{
                    margin:"10px 0px"
                }} variant="body2" color="text.secondary">
                  Date time: {moment(post.createDate).format('MMMM Do YYYY, h:mm:ss a')}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Row>
      ;
    </>
  );
};

export default Post;
