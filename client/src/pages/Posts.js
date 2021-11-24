import TopNavbar from "../comps/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../comps/Post";
import Popup from "../comps/Modal";
import Edit from "../comps/Edit";

const Posts = (props) => {
  axios.defaults.baseURL = "http://localhost:8080";
  const token = localStorage.getItem("user");
  const [posts, setPosts] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [username, setUsername] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [post, setPost] = useState({
    body: "",
  });
  const [id, setId] = useState({
    id: "",
  });

  const { BEAPI } = props;

  useEffect(() => {
    axios
      .get(`${BEAPI}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setUsername(res.data.username);
      })
      .catch((err) => console.log(err.message));
    // eslint-disable-next-line
  }, [modalShow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = post;
    await axios
      .post(
        "/create-post",
        {
          ...newPost,
        },
        {
          headers: {
            "x-access-token": `${token}`,
          },
        }
      )
      .then((res) => {
        setModalShow(false);
        setPost({
          body: "",
        });
      });
  };

  async function handleDelete(postId) {
    await axios
      .delete(`/delete-post/:${postId}`, {
        params: {
          post_id: postId,
        },
        headers: {
          "x-access-token": `${token}`,
        },
      })
      .then((res) => {
        const deletedId = res.data._id;
        setPosts(posts.filter((post) => post._id !== deletedId));
      })
      .catch((err) => console.log(err));
  }

  const submitEdit = async () => {
    await axios
      .patch(
        `/edit-post/:${id}`,
        {
          body: post.body,
        },
        {
          params: {
            post_id: id,
          },
          headers: {
            "x-access-token": `${token}`,
          },
        }
      )
      .then(() => {
        setPost({
          body: "",
        });
        setId({
          id: "",
        });
      });
  };

  return (
    <div>
      {username && <TopNavbar username={username} />}
      <Container className="home-page">
        <Row>
          <Col xs={10}>
            {posts && (
              <Post
                posts={posts}
                username={username}
                handleDelete={handleDelete}
                showEdit={showEdit}
                setShowEdit={setShowEdit}
                setPost={setPost}
                setId={setId}
              />
            )}
          </Col>
          <Col className="xtra">
            <Button
              size="lg"
              variant="outline-dark"
              id="addPost"
              onClick={() => {
                setModalShow(true);
              }}
            >
              +
            </Button>

            <Popup
              show={modalShow}
              onHide={() => setModalShow(false)}
              onChange={handleChange}
              onSubmit={handleSubmit}
              post={post}
            />

            <Edit
              show={showEdit}
              onHide={() => setShowEdit(false)}
              onChange={handleChange}
              post={post}
              submitEdit={submitEdit}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Posts;
